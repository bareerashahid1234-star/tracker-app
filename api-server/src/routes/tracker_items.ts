import { Router, type IRouter } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, trackersTable, trackerItemsTable } from "@workspace/db";
import { requireAuth } from "../lib/requireAuth";
import {
  ListTrackerItemsParams,
  ListTrackerItemsResponse,
  CreateTrackerItemParams,
  CreateTrackerItemBody,
  UpdateTrackerItemParams,
  UpdateTrackerItemBody,
  UpdateTrackerItemResponse,
  DeleteTrackerItemParams,
} from "@workspace/api-zod";
import { getDbUser } from "./trackers";

const router: IRouter = Router();

router.get("/trackers/:trackerId/items", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = ListTrackerItemsParams.safeParse({ trackerId: parseInt(raw, 10) });
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

  const sectionIdFilter = req.query.sectionId ? parseInt(req.query.sectionId as string, 10) : undefined;

  const conditions = sectionIdFilter
    ? and(eq(trackerItemsTable.trackerId, params.data.trackerId), eq(trackerItemsTable.sectionId, sectionIdFilter))
    : eq(trackerItemsTable.trackerId, params.data.trackerId);

  const items = await db
    .select()
    .from(trackerItemsTable)
    .where(conditions)
    .orderBy(asc(trackerItemsTable.position));

  res.json(ListTrackerItemsResponse.parse(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() }))));
});

router.post("/trackers/:trackerId/items", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const rawId = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = CreateTrackerItemParams.safeParse({ trackerId: parseInt(rawId, 10) });
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

  const parsed = CreateTrackerItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db
    .insert(trackerItemsTable)
    .values({ ...parsed.data, trackerId: params.data.trackerId })
    .returning();

  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

router.patch("/trackers/:trackerId/items/:itemId", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const rawTrackerId = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const rawItemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;

  const params = UpdateTrackerItemParams.safeParse({
    trackerId: parseInt(rawTrackerId, 10),
    itemId: parseInt(rawItemId, 10),
  });
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

  const parsed = UpdateTrackerItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db
    .update(trackerItemsTable)
    .set(parsed.data)
    .where(and(eq(trackerItemsTable.id, params.data.itemId), eq(trackerItemsTable.trackerId, params.data.trackerId)))
    .returning();

  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  res.json(UpdateTrackerItemResponse.parse({ ...item, createdAt: item.createdAt.toISOString() }));
});

router.delete("/trackers/:trackerId/items/:itemId", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const rawTrackerId = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const rawItemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;

  const params = DeleteTrackerItemParams.safeParse({
    trackerId: parseInt(rawTrackerId, 10),
    itemId: parseInt(rawItemId, 10),
  });
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

  const [deleted] = await db
    .delete(trackerItemsTable)
    .where(and(eq(trackerItemsTable.id, params.data.itemId), eq(trackerItemsTable.trackerId, params.data.trackerId)))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
