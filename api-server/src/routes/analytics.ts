import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, trackersTable, trackerItemsTable, completionsTable } from "@workspace/db";
import { requireAuth } from "../lib/requireAuth";
import {
  GetDashboardSummaryResponse,
  GetTrackerAnalyticsParams,
  GetTrackerAnalyticsResponse,
} from "@workspace/api-zod";
import { getDbUser } from "./trackers";

const router: IRouter = Router();

function dateRange(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();
}

async function getItemIds(trackerId: number): Promise<number[]> {
  const items = await db.select({ id: trackerItemsTable.id }).from(trackerItemsTable).where(eq(trackerItemsTable.trackerId, trackerId));
  return items.map(i => i.id);
}

async function getCompletionsForItems(itemIds: number[]) {
  if (itemIds.length === 0) return [];
  return db
    .select()
    .from(completionsTable)
    .where(sql`${completionsTable.itemId} = ANY(ARRAY[${sql.join(itemIds.map(id => sql`${id}`), sql`, `)}]::int[])`);
}

async function calcStreak(itemIds: number[], completionsByDate: Record<string, number>): Promise<{ current: number; longest: number }> {
  let current = 0;
  let longest = 0;
  let streak = 0;

  const days = dateRange(365);

  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if ((completionsByDate[day] ?? 0) > 0) {
      streak++;
      if (i === days.length - 1 || i === days.length - 2) current = streak;
    } else {
      if (streak > longest) longest = streak;
      streak = 0;
    }
  }
  if (streak > longest) longest = streak;

  return { current, longest };
}

router.get("/analytics/dashboard", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);
  const trackers = await db.select().from(trackersTable).where(eq(trackersTable.userId, user.id));
  const today = new Date().toISOString().slice(0, 10);

  let totalCompleted = 0;
  let totalItems = 0;
  let activeToday = 0;
  let longestStreak = 0;
  let currentStreak = 0;
  const recentActivity: any[] = [];

  for (const tracker of trackers) {
    const itemIds = await getItemIds(tracker.id);
    if (itemIds.length === 0) continue;

    const completions = await getCompletionsForItems(itemIds);
    const todayCompletions = completions.filter(c => c.date === today && c.completed);

    totalItems += itemIds.length;
    totalCompleted += todayCompletions.length;
    if (todayCompletions.length > 0) activeToday++;

    const byDate = completions.reduce<Record<string, number>>((acc, c) => {
      if (c.completed) acc[c.date] = (acc[c.date] ?? 0) + 1;
      return acc;
    }, {});

    const { current, longest } = await calcStreak(itemIds, byDate);
    if (current > currentStreak) currentStreak = current;
    if (longest > longestStreak) longestStreak = longest;

    recentActivity.push({
      trackerId: tracker.id,
      trackerTitle: tracker.title,
      date: today,
      completionPct: itemIds.length > 0 ? (todayCompletions.length / itemIds.length) * 100 : 0,
    });
  }

  const todayCompletionPct = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0;

  const last7 = dateRange(7);
  let weeklyCompleted = 0;
  let weeklyTotal = 0;
  for (const tracker of trackers) {
    const itemIds = await getItemIds(tracker.id);
    if (itemIds.length === 0) continue;
    weeklyTotal += itemIds.length * 7;
    const completions = await getCompletionsForItems(itemIds);
    weeklyCompleted += completions.filter(c => last7.includes(c.date) && c.completed).length;
  }
  const weeklyCompletionPct = weeklyTotal > 0 ? (weeklyCompleted / weeklyTotal) * 100 : 0;
  const productivityScore = Math.round((todayCompletionPct * 0.4 + weeklyCompletionPct * 0.4 + Math.min(currentStreak * 2, 20)) * 10) / 10;

  res.json(GetDashboardSummaryResponse.parse({
    totalTrackers: trackers.length,
    activeToday,
    todayCompletionPct,
    weeklyCompletionPct,
    longestStreak,
    currentStreak,
    productivityScore: Math.min(productivityScore, 100),
    recentActivity: recentActivity.slice(0, 10),
  }));
});

router.get("/analytics/trackers/:trackerId", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = GetTrackerAnalyticsParams.safeParse({ trackerId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [tracker] = await db
    .select()
    .from(trackersTable)
    .where(and(eq(trackersTable.id, params.data.trackerId), eq(trackersTable.userId, user.id)));

  if (!tracker) {
    res.status(404).json({ error: "Tracker not found" });
    return;
  }

  const itemIds = await getItemIds(tracker.id);
  const completions = itemIds.length > 0 ? await getCompletionsForItems(itemIds) : [];
  const totalCompletions = completions.filter(c => c.completed).length;

  const byDate = completions.reduce<Record<string, number>>((acc, c) => {
    if (c.completed) acc[c.date] = (acc[c.date] ?? 0) + 1;
    return acc;
  }, {});

  const { current, longest } = await calcStreak(itemIds, byDate);

  const completionRate = itemIds.length > 0
    ? (totalCompletions / (itemIds.length * Math.max(Object.keys(byDate).length, 1))) * 100
    : 0;

  const last7 = dateRange(7);
  const last30 = dateRange(30);

  const weeklyData = last7.map(date => {
    const completed = completions.filter(c => c.date === date && c.completed).length;
    return { date, completionPct: itemIds.length > 0 ? (completed / itemIds.length) * 100 : 0, completedCount: completed, totalCount: itemIds.length };
  });

  const monthlyData = last30.map(date => {
    const completed = completions.filter(c => c.date === date && c.completed).length;
    return { date, completionPct: itemIds.length > 0 ? (completed / itemIds.length) * 100 : 0, completedCount: completed, totalCount: itemIds.length };
  });

  res.json(GetTrackerAnalyticsResponse.parse({
    trackerId: tracker.id,
    currentStreak: current,
    longestStreak: longest,
    totalCompletions,
    completionRate,
    weeklyData,
    monthlyData,
  }));
});

export default router;
