import { Hono } from "hono";
import { db, LOCAL_USER_ID } from "../db";
import { z } from "zod";

const ProgressPutSchema = z.object({
  topic: z.string().min(1),
  step: z.string().min(1),
  completed_at: z.number().optional(),
});

export const progress = new Hono();

progress.get("/", (c) => {
  const rows = db.query<
    { topic_id: string; step: string; completed_at: number },
    [string]
  >(
    `SELECT topic_id, step, completed_at
     FROM topic_progress
     WHERE user_id = ?`,
  ).all(LOCAL_USER_ID);

  const topics: Record<string, { step: string; completed_at: number }[]> = {};
  for (const row of rows) {
    if (!topics[row.topic_id]) topics[row.topic_id] = [];
    topics[row.topic_id].push({ step: row.step, completed_at: row.completed_at });
  }

  return c.json({ topics });
});

progress.put("/", async (c) => {
  const body = await c.req.json();
  const parsed = ProgressPutSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid request" }, 400);
  }

  const { topic, step, completed_at = Math.floor(Date.now() / 1000) } = parsed.data;

  db.query(
    `INSERT OR REPLACE INTO topic_progress (user_id, topic_id, step, completed_at)
     VALUES (?, ?, ?, ?)`,
  ).run(LOCAL_USER_ID, topic, step, completed_at);

  return c.json({ ok: true });
});