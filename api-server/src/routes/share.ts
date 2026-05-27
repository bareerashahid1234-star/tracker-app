import { Router, type IRouter } from "express";
import { eq, and, asc, sql } from "drizzle-orm";
import { db, trackersTable, trackerSectionsTable, trackerItemsTable, completionsTable } from "@workspace/db";
import crypto from "crypto";
import { requireAuth } from "../lib/requireAuth";
import {
  CreateShareLinkParams,
  CreateShareLinkBody,
  DeleteShareLinkParams,
  GetSharedTrackerParams,
  GetSharedTrackerResponse,
} from "@workspace/api-zod";
import { getDbUser, enrichTracker } from "./trackers";

const router: IRouter = Router();

router.post("/trackers/:trackerId/share", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = CreateShareLinkParams.safeParse({ trackerId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateShareLinkBody.safeParse(req.body);
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

  const token = crypto.randomBytes(16).toString("hex");

  const [updated] = await db
    .update(trackersTable)
    .set({ shareToken: token, shareLinkMode: parsed.data.mode })
    .where(eq(trackersTable.id, tracker.id))
    .returning();

  res.status(201).json({
    token,
    trackerId: tracker.id,
    mode: parsed.data.mode,
    createdAt: new Date().toISOString(),
  });
});

router.delete("/trackers/:trackerId/share", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);

  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = DeleteShareLinkParams.safeParse({ trackerId: parseInt(raw, 10) });
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

  await db
    .update(trackersTable)
    .set({ shareToken: null, shareLinkMode: null })
    .where(eq(trackersTable.id, tracker.id));

  res.sendStatus(204);
});

router.get("/share/:token", async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
  const params = GetSharedTrackerParams.safeParse({ token: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [tracker] = await db
    .select()
    .from(trackersTable)
    .where(eq(trackersTable.shareToken, params.data.token));

  if (!tracker) {
    res.status(404).json({ error: "Shared tracker not found" });
    return;
  }

  const enriched = await enrichTracker(tracker);

  const sections = await db
    .select()
    .from(trackerSectionsTable)
    .where(eq(trackerSectionsTable.trackerId, tracker.id))
    .orderBy(asc(trackerSectionsTable.position));

  const items = await db
    .select()
    .from(trackerItemsTable)
    .where(eq(trackerItemsTable.trackerId, tracker.id));

  const itemIds = items.map(i => i.id);
  const completions = itemIds.length > 0
    ? await db
        .select()
        .from(completionsTable)
        .where(sql`${completionsTable.itemId} = ANY(ARRAY[${sql.join(itemIds.map(id => sql`${id}`), sql`, `)}]::int[])`)
    : [];

  const sectionItemCounts = new Map<number, number>();
  items.forEach(i => {
    if (i.sectionId) {
      sectionItemCounts.set(i.sectionId, (sectionItemCounts.get(i.sectionId) ?? 0) + 1);
    }
  });

  const enrichedSections = sections.map(s => ({
    ...s,
    itemCount: sectionItemCounts.get(s.id) ?? 0,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  res.json(GetSharedTrackerResponse.parse({
    tracker: enriched,
    sections: enrichedSections,
    items: items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })),
    completions: completions.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })),
  }));
});

export default router;
