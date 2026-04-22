// Re-export types matching server/lib/schemas.ts
// Keep in sync with server/lib/schemas.ts

export interface ProgressTopic {
  step: string;
  completed_at: number;
}

export interface ProgressResponse {
  topics: Record<string, ProgressTopic[]>;
}

export interface Attempt {
  id: number;
  problem_id: string;
  code: string;
  passed: boolean;
  runtime_ms: number | null;
  created_at: number;
}

export interface SRSCard {
  id: number;
  topic_id: string;
  prompt: string;
  answer: string;
  ease: number;
  interval_days: number;
  due_at: number;
}

export interface MockSession {
  id: number;
  problem_id: string;
  transcript: string;
  rubric: Record<string, boolean>;
  duration_s: number;
  created_at: number;
}