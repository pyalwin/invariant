import type { ProgressResponse } from "./types";

const BASE = "/api";

export async function fetchProgress(): Promise<ProgressResponse> {
  const res = await fetch(`${BASE}/progress`);
  if (!res.ok) throw new Error(`progress fetch failed: ${res.status}`);
  return res.json();
}

export async function putProgress(topic: string, step: string): Promise<void> {
  const res = await fetch(`${BASE}/progress`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, step }),
  });
  if (!res.ok) throw new Error(`progress put failed: ${res.status}`);
}