import { Router, type IRouter } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, trackersTable, trackerSectionsTable, trackerItemsTable } from "@workspace/db";
import { requireAuth } from "../lib/requireAuth";
import { getDbUser } from "./trackers";
import {
  ListSectionsParams,
  CreateSectionParams,
  CreateSectionBody,
  ReorderSectionsParams,
  ReorderSectionsBody,
  UpdateSectionParams,
  UpdateSectionBody,
  DeleteSectionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const parseId = (raw: string | string[]) =>
  parseInt(Array.isArray(raw) ? raw[0] : raw, 10);

async function assertTrackerOwner(trackerId: number, userId: number) {
  const [tracker] = await db
    .select()
    .from(trackersTable)
    .where(and(eq(trackersTable.id, trackerId), eq(trackersTable.userId, userId)));
  return tracker ?? null;
}

async function enrichSection(section: typeof trackerSectionsTable.$inferSelect) {
  const items = await db
    .select({ id: trackerItemsTable.id })
    .from(trackerItemsTable)
    .where(eq(trackerItemsTable.sectionId, section.id));
  return {
    ...section,
    itemCount: items.length,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString(),
  };
}

// GET /trackers/:trackerId/sections
router.get("/trackers/:trackerId/sections", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);
  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = ListSectionsParams.safeParse({ trackerId: parseId(raw) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  if (!(await assertTrackerOwner(params.data.trackerId, user.id))) {
    res.status(404).json({ error: "Tracker not found" }); return;
  }

  const sections = await db
    .select()
    .from(trackerSectionsTable)
    .where(eq(trackerSectionsTable.trackerId, params.data.trackerId))
    .orderBy(asc(trackerSectionsTable.position));

  res.json(await Promise.all(sections.map(enrichSection)));
});

// POST /trackers/:trackerId/sections
router.post("/trackers/:trackerId/sections", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);
  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = CreateSectionParams.safeParse({ trackerId: parseId(raw) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  if (!(await assertTrackerOwner(params.data.trackerId, user.id))) {
    res.status(404).json({ error: "Tracker not found" }); return;
  }

  const parsed = CreateSectionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const existing = await db
    .select({ position: trackerSectionsTable.position })
    .from(trackerSectionsTable)
    .where(eq(trackerSectionsTable.trackerId, params.data.trackerId))
    .orderBy(asc(trackerSectionsTable.position));

  const position = parsed.data.position ?? (existing.length > 0 ? existing[existing.length - 1].position + 1 : 0);

  const [section] = await db
    .insert(trackerSectionsTable)
    .values({
      trackerId: params.data.trackerId,
      name: parsed.data.name,
      icon: parsed.data.icon ?? "📋",
      color: parsed.data.color ?? "#9333ea",
      layoutType: parsed.data.layoutType ?? "habit_grid",
      position,
    })
    .returning();

  res.status(201).json(await enrichSection(section));
});

// PUT /trackers/:trackerId/sections/reorder
router.put("/trackers/:trackerId/sections/reorder", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);
  const raw = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const params = ReorderSectionsParams.safeParse({ trackerId: parseId(raw) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  if (!(await assertTrackerOwner(params.data.trackerId, user.id))) {
    res.status(404).json({ error: "Tracker not found" }); return;
  }

  const parsed = ReorderSectionsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  await Promise.all(
    (parsed.data.order as number[]).map((id: number, idx: number) =>
      db
        .update(trackerSectionsTable)
        .set({ position: idx, updatedAt: new Date() })
        .where(and(eq(trackerSectionsTable.id, id), eq(trackerSectionsTable.trackerId, params.data.trackerId)))
    )
  );

  const sections = await db
    .select()
    .from(trackerSectionsTable)
    .where(eq(trackerSectionsTable.trackerId, params.data.trackerId))
    .orderBy(asc(trackerSectionsTable.position));

  res.json(await Promise.all(sections.map(enrichSection)));
});

// PATCH /trackers/:trackerId/sections/:sectionId
router.patch("/trackers/:trackerId/sections/:sectionId", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);
  const rawTrackerId = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const rawSectionId = Array.isArray(req.params.sectionId) ? req.params.sectionId[0] : req.params.sectionId;

  const params = UpdateSectionParams.safeParse({ trackerId: parseId(rawTrackerId), sectionId: parseId(rawSectionId) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  if (!(await assertTrackerOwner(params.data.trackerId, user.id))) {
    res.status(404).json({ error: "Tracker not found" }); return;
  }

  const parsed = UpdateSectionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [section] = await db
    .update(trackerSectionsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(trackerSectionsTable.id, params.data.sectionId), eq(trackerSectionsTable.trackerId, params.data.trackerId)))
    .returning();

  if (!section) { res.status(404).json({ error: "Section not found" }); return; }

  res.json(await enrichSection(section));
});

// DELETE /trackers/:trackerId/sections/:sectionId
router.delete("/trackers/:trackerId/sections/:sectionId", requireAuth, async (req: any, res): Promise<void> => {
  const user = await getDbUser(req.clerkUserId);
  const rawTrackerId = Array.isArray(req.params.trackerId) ? req.params.trackerId[0] : req.params.trackerId;
  const rawSectionId = Array.isArray(req.params.sectionId) ? req.params.sectionId[0] : req.params.sectionId;

  const params = DeleteSectionParams.safeParse({ trackerId: parseId(rawTrackerId), sectionId: parseId(rawSectionId) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  if (!(await assertTrackerOwner(params.data.trackerId, user.id))) {
    res.status(404).json({ error: "Tracker not found" }); return;
  }

  const [deleted] = await db
    .delete(trackerSectionsTable)
    .where(and(eq(trackerSectionsTable.id, params.data.sectionId), eq(trackerSectionsTable.trackerId, params.data.trackerId)))
    .returning();

  if (!deleted) { res.status(404).json({ error: "Section not found" }); return; }

  res.sendStatus(204);
});

export default router;
