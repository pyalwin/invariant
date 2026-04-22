import { Hono } from "hono";
import { db, LOCAL_USER_ID } from "../db";
import { sm2, nextDue } from "../lib/srs-algo";
import { z } from "zod";

const SRSGradeSchema = z.object({
  card_id: z.number(),
  grade: z.number().min(0).max(5),
});

export const srs = new Hono();

srs.get("/due", (c) => {
  const now = Math.floor(Date.now() / 1000);
  const rows = db.query(
    `SELECT id, topic_id, prompt, answer, ease, interval_days, due_at
     FROM srs_cards
     WHERE user_id = ? AND due_at <= ?
     ORDER BY due_at ASC`,
  ).all(LOCAL_USER_ID, now);

  return c.json({ cards: rows });
});

srs.post("/grade", async (c) => {
  const body = await c.req.json();
  const parsed = SRSGradeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid request" }, 400);
  }

  const { card_id, grade } = parsed.data;

  const card = db.query(
    `SELECT ease, interval_days FROM srs_cards WHERE id = ? AND user_id = ?`,
  ).get(card_id, LOCAL_USER_ID) as { ease: number; interval_days: number } | undefined;

  if (!card) {
    return c.json({ error: "card not found" }, 404);
  }

  const updated = sm2(card.ease, card.interval_days, grade);

  db.query(
    `UPDATE srs_cards SET ease = ?, interval_days = ?, due_at = ? WHERE id = ?`,
  ).run(updated.ease, updated.intervalDays, nextDue(updated.intervalDays), card_id);

  return c.json({ ok: true });
});

srs.post("/add", async (c) => {
  const body = await c.req.json();
  const { topic_id, prompt, answer } = body as {
    topic_id: string;
    prompt: string;
    answer: string;
  };

  const now = Math.floor(Date.now() / 1000);
  db.query(
    `INSERT INTO srs_cards (user_id, topic_id, prompt, answer, due_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(LOCAL_USER_ID, topic_id, prompt, answer, now);

  return c.json({ ok: true });
});