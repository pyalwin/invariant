import { Hono } from "hono";
import { db, LOCAL_USER_ID } from "../db";
import { z } from "zod";

const AttemptSchema = z.object({
  problem_id: z.string().min(1),
  code: z.string(),
  passed: z.boolean(),
  runtime_ms: z.number().nullable(),
});

export const attempts = new Hono();

attempts.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = AttemptSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid request" }, 400);
  }

  const { problem_id, code, passed, runtime_ms } = parsed.data;

  const result = db.query(
    `INSERT INTO attempts (user_id, problem_id, code, passed, runtime_ms)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(LOCAL_USER_ID, problem_id, code, passed ? 1 : 0, runtime_ms);

  return c.json({ id: result.lastInsertRowid });
});

attempts.get("/", (c) => {
  const problem_id = c.req.query("problem_id");

  const rows = problem_id
    ? db.query(
        `SELECT id, problem_id, code, passed, runtime_ms, created_at
         FROM attempts
         WHERE user_id = ? AND problem_id = ?
         ORDER BY created_at DESC
         LIMIT 20`,
      ).all(LOCAL_USER_ID, problem_id)
    : db.query(
        `SELECT id, problem_id, code, passed, runtime_ms, created_at
         FROM attempts
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 50`,
      ).all(LOCAL_USER_ID);

  return c.json({ attempts: rows });
});