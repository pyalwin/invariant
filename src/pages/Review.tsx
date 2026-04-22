import { useEffect } from "react";
import { useSRSStore } from "@/store/srs";
import { cn } from "@/lib/cn";

export default function Review() {
  const { cards, loading, hydrate, grade } = useSRSStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-600">
        Loading…
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-zinc-600">No cards due. Check back later.</p>
      </div>
    );
  }

  const [current, ...rest] = cards;
  const gradeLabels = ["Again", "Hard", "Good", "Great", "Easy"];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 font-mono text-xl font-semibold text-black">Review</h1>
      <p className="mb-6 text-sm text-zinc-600">
        {cards.length} card{cards.length !== 1 ? "s" : ""} due today.
      </p>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-6">
        <div className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-600">
          {current.topic_id}
        </div>
        <p className="text-lg text-zinc-900">{current.prompt}</p>
        <div className="mt-6 rounded-md border border-zinc-300 bg-zinc-100/50 p-4">
          <p className="text-sm text-zinc-600">{current.answer}</p>
        </div>
        <div className="mt-4 flex gap-2">
          {[0, 1, 2, 3, 5].map((g) => (
            <button
              key={g}
              onClick={() => grade(current.id, g)}
              className="flex-1 rounded-md bg-zinc-100 py-2 text-sm text-zinc-800 transition-colors hover:bg-zinc-200 hover:text-black"
            >
              {gradeLabels[g]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}