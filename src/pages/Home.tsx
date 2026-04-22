import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProgressStore, TOTAL_STEPS } from "@/store/progress";
import { topics } from "@/lib/topics";
import type { TopicMeta } from "@/lib/topics";

export default function Home() {
  const { topics: progressTopics, hydrated, hydrate } = useProgressStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-semibold text-black">Topics</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Staff-level DSA prep. Pick an approach before you write any code.
        </p>
      </div>

      <div className="grid gap-3">
        {CATEGORIES.map((cat) => {
          const catTopics = topics.filter((t) => t.category === cat);
          if (!catTopics.length) return null;
          return (
            <section key={cat} className="space-y-1">
              <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                {cat}
              </h2>
              <div className="grid gap-1">
                {catTopics.map((t) => {
                  const completedSteps = (progressTopics[t.id] ?? []).length;
                  const pct = Math.round((completedSteps / TOTAL_STEPS) * 100);
                  return (
                    <Link
                      key={t.id}
                      to={`/topic/${t.id}`}
                      className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-900">{t.title}</span>
                          <DifficultyBadge difficulty={t.difficulty} />
                        </div>
                        {t.prereqs.length > 0 && (
                          <p className="mt-0.5 text-xs text-zinc-600">
                            Requires:{" "}
                            {t.prereqs.map((p) => topics.find((x) => x.id === p)?.title).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-zinc-200">
                          <div
                            className="h-full rounded-full bg-black transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-zinc-600">
                          {completedSteps}/{TOTAL_STEPS}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border border-amber-200",
    hard: "bg-red-50 text-red-700 border border-red-200",
  } as const;
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors[difficulty as keyof typeof colors] ?? colors.medium}`}>
      {difficulty}
    </span>
  );
}

const CATEGORIES = [
  "Linear",
  "Hashing",
  "Trees",
  "Heaps",
  "Graphs",
  "DP",
  "Greedy",
  "Divide & Conquer",
  "Strings",
  "Advanced",
];