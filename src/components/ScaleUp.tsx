import { useState } from "react";
import { cn } from "@/lib/cn";

interface ScaleTier {
  scale: string;
  answer?: string;
}

interface ScaleUpProps {
  tiers: ScaleTier[];
}

export function ScaleUp({ tiers }: ScaleUpProps) {
  const [revealed, setRevealed] = useState<number[]>([]);

  const toggleReveal = (i: number) => {
    setRevealed((s) =>
      s.includes(i) ? s.filter((x) => x !== i) : [...s, i],
    );
  };

  const allRevealed = tiers.every((_, i) => revealed.includes(i));

  return (
    <div className="space-y-3">
      {tiers.map((tier, i) => {
        const isRevealed = revealed.includes(i);
        return (
          <div
            key={i}
            className={cn(
              "rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 transition-all",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-medium text-black">
                {tier.scale}
              </span>
              {!isRevealed && (
                <button
                  onClick={() => toggleReveal(i)}
                  className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                >
                  Reveal
                </button>
              )}
            </div>
            {isRevealed && tier.answer && (
              <p className="mt-2 text-sm text-zinc-800">{tier.answer}</p>
            )}
            {isRevealed && !tier.answer && (
              <p className="mt-2 text-sm text-zinc-600">Answer hidden in MDX content.</p>
            )}
            {!isRevealed && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-zinc-100" />
                <span className="text-xs text-zinc-700">???</span>
              </div>
            )}
          </div>
        );
      })}

      {tiers.length === 0 && (
        <p className="text-zinc-600">Scale-up tiers coming soon.</p>
      )}
    </div>
  );
}