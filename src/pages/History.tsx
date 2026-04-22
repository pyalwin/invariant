import { useEffect, useState } from "react";
import type { MockSession } from "@/api/types";

export default function History() {
  const [sessions, setSessions] = useState<MockSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mock/history")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-600">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 font-mono text-xl font-semibold text-black">Mock History</h1>
      {!sessions.length ? (
        <p className="text-zinc-600">No sessions yet. Complete a mock to see it here.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900">{s.problem_id}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {new Date(s.created_at * 1000).toLocaleDateString()} ·{" "}
                    {Math.floor(s.duration_s / 60)}m {s.duration_s % 60}s
                  </p>
                </div>
                <div className="flex gap-1">
                  {Object.entries(s.rubric).map(([k, v]) =>
                    v ? (
                      <span key={k} className="h-2 w-2 rounded-full bg-emerald-500" />
                    ) : (
                      <span key={k} className="h-2 w-2 rounded-full bg-zinc-200" />
                    ),
                  )}
                </div>
              </div>
              {s.transcript && (
                <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{s.transcript}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}