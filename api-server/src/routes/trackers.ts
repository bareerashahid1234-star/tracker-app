import { Router, type IRouter } from "express";
import { eq, and, ilike, sql } from "drizzle-orm";
import { db, usersTable, trackersTable, trackerSectionsTable, trackerItemsTable, completionsTable } from "@workspace/db";
import { requireAuth } from "../lib/requireAuth";
import {
  ListTrackersQueryParams,
  ListTrackersResponse,
  CreateTrackerBody,
  GetTrackerParams,
  GetTrackerResponse,
  UpdateTrackerParams,
  UpdateTrackerBody,
  UpdateTrackerResponse,
  DeleteTrackerParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getDbUser(clerkId: string) {
  const [user] = await db
    .insert(usersTable)
    .values({ clerkId })
    .onConflictDoUpdate({ target: usersTable.clerkId, set: { clerkId } })
    .returning();
  return user;
}

async function enrichTracker(tracker: any) {
  const items = await db.select().from(trackerItemsTable).where(eq(trackerItemsTable.trackerId, tracker.id));
  const itemCount = items.length;

  const sections = await db.select({ id: trackerSectionsTable.id }).from(trackerSectionsTable).where(eq(trackerSectionsTable.trackerId, tracker.id));
  const sectionCount = sections.length;

  const today = new Date().toISOString().slice(0, 10);
  let todayCompleted = 0;
  let currentStreak = 0;

  if (itemCount > 0) {
    const todayCompletions = await db
      .select()
      .from(completionsTable)
      .where(
        and(
          sql`${completionsTable.itemId} = ANY(ARRAY[${sql.join(items.map(i => sql`${i.id}`), sql`, `)}]::int[])`,
          eq(completionsTable.date, today),
          eq(completionsTable.completed, true),
        )
      );
    todayCompleted = todayCompletions.length;

    // Calculate streak
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const dayCompletions = await db
        .select()
        .from(completionsTable)
        .where(
          and(
            sql`${completionsTable.itemId} = ANY(ARRAY[${sql.join(items.map(it => sql`${it.id}`), sql`, `)}]::int[])`,
            eq(completionsTable.date, ds),
            eq(completionsTable.completed, true),
          )
        );
      if (dayCompletions.length > 0) currentStreak++;
      else break;
    }
  }

  return {
    ...tracker,
    createdAt: tracker.createdAt.toISOString(),
    updatedAt: tracker.updatedAt.toISOString(),
    itemCount,
    sectionCount,
    todayCompletionPct: itemCount > 0 ? (todayCompleted / itemCount) * 100 : 0,
    currentStreak,
  };
}

router.get("/trackers", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const qp = ListTrackersQueryParams.safeParse(req.query);
  const { category, search } = qp.success ? qp.data : { category: undefined, search: undefined };

  let conditions = [eq(trackersTable.userId, user.id)];
  if (category) conditions.push(eq(trackersTable.category, category));
  if (search) conditions.push(ilike(trackersTable.title, `%${search}%`));

  const trackers = await db.select().from(trackersTable).where(and(...conditions));

  const enriched = await Promise.all(trackers.map(enrichTracker));
  res.json(ListTrackersResponse.parse(enriched));
});

router.post("/trackers", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const parsed = CreateTrackerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [tracker] = await db
    .insert(trackersTable)
    .values({ ...parsed.data, userId: user.id })
    .returning();

  const enriched = await enrichTracker(tracker);
  res.status(201).json(GetTrackerResponse.parse(enriched));
});

router.get("/trackers/:id", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetTrackerParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [tracker] = await db
    .select()
    .from(trackersTable)
    .where(and(eq(trackersTable.id, params.data.id), eq(trackersTable.userId, user.id)));

  if (!tracker) {
    res.status(404).json({ error: "Tracker not found" });
    return;
  }

  const enriched = await enrichTracker(tracker);
  res.json(GetTrackerResponse.parse(enriched));
});

router.patch("/trackers/:id", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateTrackerParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTrackerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [tracker] = await db
    .update(trackersTable)
    .set(parsed.data)
    .where(and(eq(trackersTable.id, params.data.id), eq(trackersTable.userId, user.id)))
    .returning();

  if (!tracker) {
    res.status(404).json({ error: "Tracker not found" });
    return;
  }

  const enriched = await enrichTracker(tracker);
  res.json(UpdateTrackerResponse.parse(enriched));
});

router.delete("/trackers/:id", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteTrackerParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(trackersTable)
    .where(and(eq(trackersTable.id, params.data.id), eq(trackersTable.userId, user.id)))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Tracker not found" });
    return;
  }

  res.sendStatus(204);
});

export { getDbUser, enrichTracker };
export default router;
