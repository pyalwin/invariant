import { Hono } from "hono";
import { db, LOCAL_USER_ID } from "../db";
import { z } from "zod";

const MockSessionSchema = z.object({
  problem_id: z.string().min(1),
  transcript: z.string(),
  rubric: z.record(z.boolean()),
  duration_s: z.number().int().nonnegative(),
});

export const mock = new Hono();

mock.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = MockSessionSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid request" }, 400);
  }

  const { problem_id, transcript, rubric, duration_s } = parsed.data;

  const result = db.query(
    `INSERT INTO mock_sessions (user_id, problem_id, transcript, rubric_json, duration_s)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(LOCAL_USER_ID, problem_id, transcript, JSON.stringify(rubric), duration_s);

  return c.json({ id: result.lastInsertRowid });
});

mock.get("/history", (c) => {
  const rows = db.query(
    `SELECT id, problem_id, transcript, rubric_json, duration_s, created_at
     FROM mock_sessions
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 20`,
  ).all(LOCAL_USER_ID);

  return c.json({
    sessions: rows.map((r: any) => ({
      ...r,
      rubric: JSON.parse(r.rubric_json),
    })),
  });
});