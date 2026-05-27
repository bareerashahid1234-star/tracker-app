import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, trackersTable, trackerItemsTable, completionsTable } from "@workspace/db";
import { requireAuth } from "../lib/requireAuth";
import {
  GetCompletionLogParams,
  GetCompletionLogResponse,
  ToggleCompletionParams,
  ToggleCompletionBody,
  ToggleCompletionResponse,
} from "@workspace/api-zod";
import { getDbUser } from "./trackers";

const router: IRouter = Router();

router.get("/trackers/:trackerId/completions", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = GetCompletionLogParams.safeParse({ trackerId: parseInt(raw, 10) });
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

  const items = await db
    .select()
    .from(trackerItemsTable)
    .where(eq(trackerItemsTable.trackerId, params.data.trackerId));

  if (items.length === 0) {
    res.json([]);
    return;
  }

  const itemIds = items.map(i => i.id);
  const completions = await db
    .select()
    .from(completionsTable)
    .where(sql`${completionsTable.itemId} = ANY(ARRAY[${sql.join(itemIds.map(id => sql`${id}`), sql`, `)}]::int[])`);

  res.json(GetCompletionLogResponse.parse(completions.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }))));
});

router.post("/trackers/:trackerId/completions", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = ToggleCompletionParams.safeParse({ trackerId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = ToggleCompletionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
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

  const { itemId, date, completed = true, value } = parsed.data;

  const [existing] = await db
    .select()
    .from(completionsTable)
    .where(and(eq(completionsTable.itemId, itemId), eq(completionsTable.date, date)));

  let completion;

  if (existing) {
    [completion] = await db
      .update(completionsTable)
      .set({ completed: completed !== undefined ? completed : !existing.completed, value })
      .where(eq(completionsTable.id, existing.id))
      .returning();
  } else {
    [completion] = await db
      .insert(completionsTable)
      .values({ itemId, date, completed, value })
      .returning();
  }

  res.json(ToggleCompletionResponse.parse({ ...completion, createdAt: completion.createdAt.toISOString() }));
});

export default router;
