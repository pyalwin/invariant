import { useState } from "react";
import { cn } from "@/lib/cn";

interface DrillProblem {
  id: string;
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface PickApproachProps {
  problems: DrillProblem[];
}

export function PickApproach({ problems }: PickApproachProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const prob = problems[current];
  if (!prob) return null;

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    setSelected(null);
    setRevealed(false);
    setCurrent((s) => Math.min(problems.length - 1, s + 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-600">
          Problem {current + 1} of {problems.length}
        </span>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4">
        <p className="font-medium text-zinc-900">{prob.stem}</p>
      </div>

      <div className="space-y-2">
        {prob.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={revealed}
            className={cn(
              "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              revealed
                ? i === prob.answer
                  ? "border-emerald-400/50 bg-emerald-50/50 text-emerald-700"
                  : i === selected
                  ? "border-red-600/50 bg-red-50/50 text-red-600"
                  : "border-zinc-200 bg-zinc-50/50 text-zinc-600"
                : selected === i
                ? "border-indigo-300 bg-indigo-50/50 text-black"
                : "border-zinc-200 bg-zinc-50/50 text-zinc-800 hover:border-zinc-300",
            )}
          >
            <span className="mr-3 font-mono text-zinc-600">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>

      {revealed && (
        <div
          className={cn(
            "rounded-lg border p-4 text-sm",
            selected === prob.answer
              ? "border-emerald-200/50 bg-emerald-50/50 text-emerald-700"
              : "border-red-200/50 bg-red-50/50 text-red-700",
          )}
        >
          <p className="font-medium">{selected === prob.answer ? "Correct" : "Incorrect"}</p>
          <p className="mt-1 text-zinc-600">{prob.explanation}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!revealed && selected !== null ? (
          <button
            onClick={handleReveal}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Reveal answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={current === problems.length - 1}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm text-zinc-800 transition-colors hover:bg-zinc-200 disabled:opacity-30"
          >
            {current < problems.length - 1 ? "Next →" : "Done"}
          </button>
        )}
      </div>
    </div>
  );
}