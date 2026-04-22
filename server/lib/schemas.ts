import { z } from "zod";

export const ProgressGetSchema = z.object({});

export const ProgressPutSchema = z.object({
  topic: z.string().min(1),
  step: z.string().min(1),
  completed_at: z.number().optional(),
});

export const AttemptSchema = z.object({
  problem_id: z.string().min(1),
  code: z.string(),
  passed: z.boolean(),
  runtime_ms: z.number().nullable(),
});

export const SRSCardSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  topic_id: z.string(),
  prompt: z.string(),
  answer: z.string(),
  ease: z.number(),
  interval_days: z.number(),
  due_at: z.number(),
});

export const SRSGradeSchema = z.object({
  card_id: z.number(),
  grade: z.number().min(0).max(5),
});

export const MockSessionSchema = z.object({
  problem_id: z.string().min(1),
  transcript: z.string(),
  rubric: z.record(z.boolean()),
  duration_s: z.number().int().nonnegative(),
});