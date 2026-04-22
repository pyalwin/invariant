import { Link } from "react-router-dom";
import { useMockStore, RUBRIC_KEYS, RUBRIC_LABELS } from "@/store/mock";
import { cn } from "@/lib/cn";

export default function Mock() {
  const {
    transcript,
    rubric,
    duration,
    startedAt,
    setTranscript,
    setRubricItem,
    startTimer,
    stopTimer,
    reset,
  } = useMockStore();

  const elapsed = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-semibold text-black">Mock Interview</h1>
          <p className="mt-0.5 text-sm text-zinc-600">30-minute timed practice. Speak your approach, then code it.</p>
        </div>
        {!startedAt ? (
          <button
            onClick={startTimer}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Start 30:00
          </button>
        ) : (
          <span className="font-mono text-2xl font-medium tabular-nums text-zinc-900">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        )}
      </div>

      {startedAt && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
            Problem: "Two Sum (1M elements, need O(1) space)"
          </div>
          <p className="text-sm text-zinc-800">
            Given an array of integers <code className="text-black">nums</code> and an integer{" "}
            <code className="text-black">target</code>, return indices of the two numbers such
            that they add up to target. Input size is 1 million elements. Space complexity must be O(1).
          </p>
        </div>
      )}

      {startedAt && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-800">Your approach (speak here)</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={8}
              className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-600 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              placeholder="Walk through your approach: constraints, complexity, tradeoffs, edge cases..."
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-800">Code (Monaco coming soon)</label>
            <div className="flex h-48 items-center justify-center rounded-md border border-zinc-300 bg-zinc-50/80 text-sm text-zinc-600">
              Monaco editor coming in next phase
            </div>
          </div>
        </div>
      )}

      {startedAt && (
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={stopTimer}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            Submit
          </button>
          <button
            onClick={reset}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-200"
          >
            Reset
          </button>
        </div>
      )}

      {!startedAt && (
        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50/80 p-8 text-center">
          <p className="text-zinc-600">
            Press <span className="font-mono text-zinc-900">Start 30:00</span> to begin your mock
            session.
          </p>
          <p className="mt-2 text-xs text-zinc-700">
            Your transcript and rubric will be saved to history when you submit.
          </p>
        </div>
      )}

      {duration > 0 && (
        <div className="mt-6 rounded-lg border border-zinc-200 p-4">
          <h2 className="mb-3 text-sm font-medium text-zinc-900">Self-Grade Rubric</h2>
          <div className="space-y-2">
            {RUBRIC_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={rubric[key]}
                  onChange={(e) => setRubricItem(key, e.target.checked)}
                  className="h-4 w-4 rounded border-black/20 bg-zinc-100 text-indigo-600 focus:ring-indigo-600"
                />
                <span className={cn("transition-colors", rubric[key] ? "text-emerald-600" : "text-zinc-600")}>
                  {RUBRIC_LABELS[key]}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            Duration: {Math.floor(duration / 60)}m {duration % 60}s. This will be saved to history.
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-200"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}