import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/requireAuth";
import { UpdateMeBody, GetMeResponse, UpdateMeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/users/me", requireAuth, async (req: any, res): Promise<void> => {
  const clerkId = req.clerkUserId as string;

  let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));

  if (!user) {
    [user] = await db.insert(usersTable).values({ clerkId }).returning();
  }

  res.json(GetMeResponse.parse({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
});

router.patch("/users/me", requireAuth, async (req: any, res): Promise<void> => {
  const clerkId = req.clerkUserId as string;

  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) {
    [user] = await db.insert(usersTable).values({ clerkId }).returning();
  }

  const [updated] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.clerkId, clerkId))
    .returning();

  res.json(UpdateMeResponse.parse({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  }));
});

export default router;
