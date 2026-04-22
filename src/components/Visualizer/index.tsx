import { useState } from "react";
import { cn } from "@/lib/cn";

export interface TraceStep {
  step: string;
  highlight?: number[];
  state: Record<string, unknown>;
}

interface VisualizerProps {
  code: string;
  structure: "heap" | "array" | "tree" | "graph" | "hash" | "linked-list";
  trace?: TraceStep[];
}

export function Visualizer({ code, structure, trace }: VisualizerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = trace?.length ?? 0;

  const currentStep = trace?.[stepIndex];

  return (
    <div className="space-y-4">
      {/* Code panel */}
      <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/80 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </span>
          <span className="ml-2 font-mono text-xs text-zinc-600">Python</span>
        </div>
        <pre className="p-4 font-mono text-sm leading-relaxed">
          {code.split("\n").map((line, i) => (
            <span
              key={i}
              className={cn(
                "block transition-colors",
                currentStep?.highlight?.includes(i + 1)
                  ? "bg-indigo-100/30 text-black"
                  : "text-zinc-600",
              )}
            >
              <span className="mr-4 inline-block w-6 select-none text-right text-zinc-700">
                {i + 1}
              </span>
              {line}
            </span>
          ))}
        </pre>
      </div>

      {/* Canvas area */}
      {totalSteps > 0 && (
        <div className="min-h-48 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-800">
              {currentStep?.step ?? "Initial state"}
            </span>
            <span className="font-mono text-xs text-zinc-600">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>
          {/* Render the appropriate structure */}
          <StructureRenderer structure={structure} state={currentStep?.state ?? {}} />
        </div>
      )}

      {/* Step controls */}
      {totalSteps > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
            disabled={stepIndex === 0}
            className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-200 disabled:opacity-30"
          >
            ← Back
          </button>
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={totalSteps - 1}
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={() => setStepIndex((s) => Math.min(totalSteps - 1, s + 1))}
            disabled={stepIndex === totalSteps - 1}
            className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-200 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function StructureRenderer({
  structure,
  state,
}: {
  structure: string;
  state: Record<string, unknown>;
}) {
  switch (structure) {
    case "heap":
      return <HeapViz state={state} />;
    case "array":
      return <ArrayViz state={state} />;
    case "tree":
      return <TreeViz state={state} />;
    case "graph":
      return <GraphViz state={state} />;
    case "hash":
      return <HashViz state={state} />;
    case "linked-list":
      return <LinkedListViz state={state} />;
    default:
      return <p className="text-zinc-600">No visualizer for {structure}</p>;
  }
}

function HeapViz({ state }: { state: Record<string, unknown> }) {
  const heap = (state.heap as number[] | undefined) ?? [];

  // Draw heap as a tree in levels
  const levels: number[][] = [];
  for (let i = 0; i < heap.length; ) {
    const levelSize = Math.pow(2, levels.length);
    levels.push(heap.slice(i, i + levelSize));
    i += levelSize;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {levels.map((level, li) => (
        <div key={li} className="flex gap-4">
          {level.map((val, vi) => (
            <div
              key={vi}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                val === (state.heap as number[] | undefined)?.at(-1)
                  ? "border-indigo-500 bg-indigo-950 text-black"
                  : "border-zinc-300 bg-zinc-100/50 text-zinc-800",
              )}
            >
              {val}
            </div>
          ))}
        </div>
      ))}
      {heap.length === 0 && <p className="text-zinc-600">heap is empty</p>}
    </div>
  );
}

function ArrayViz({ state }: { state: Record<string, unknown> }) {
  const arr = (state.arr ?? state.array ?? []) as number[];
  const highlight = (state.highlight as number[] | undefined) ?? [];

  return (
    <div className="flex flex-wrap gap-1">
      {arr.map((val, i) => (
        <div
          key={i}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded border text-sm font-mono transition-colors",
            highlight.includes(i)
              ? "border-indigo-500 bg-indigo-950 text-black"
              : "border-zinc-300 bg-zinc-100/50 text-zinc-800",
          )}
        >
          {val}
        </div>
      ))}
    </div>
  );
}

function TreeViz({ state }: { state: Record<string, unknown> }) {
  // Generic binary tree visualizer
  const nodes = (state.nodes as Array<{ val: number; left?: number; right?: number }> | undefined) ?? [];
  if (!nodes.length) return <p className="text-zinc-600">tree is empty</p>;

  // Simple SVG tree
  const cx = 200;
  const cy = 30;
  const dx = 30;

  return (
    <div className="overflow-x-auto">
      <svg width="400" height="120" viewBox="0 0 400 120">
        {nodes.map((node, i) => {
          const x = cx + (i % 4 - 2) * 60;
          const y = cy + Math.floor(i / 2) * 40;
          return (
            <g key={i}>
              {node.left !== undefined && (
                <line x1={x} y1={y} x2={x - dx} y2={y + 35} stroke="#3f3f46" strokeWidth="1" />
              )}
              {node.right !== undefined && (
                <line x1={x} y1={y} x2={x + dx} y2={y + 35} stroke="#3f3f46" strokeWidth="1" />
              )}
              <circle cx={x} cy={y} r="16" fill="#27272a" stroke="#3f3f46" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fill="#e4e4e7" fontFamily="monospace">
                {node.val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function GraphViz({ state }: { state: Record<string, unknown> }) {
  const edges = (state.edges as Array<[number, number]> | undefined) ?? [];
  const dist = (state.dist as Record<string, number> | undefined) ?? {};

  return (
    <div className="space-y-2">
      {Object.entries(dist).map(([k, v]) => (
        <div key={k} className="flex items-center gap-2 text-sm">
          <span className="font-mono text-zinc-600">{k}</span>
          <span className="text-zinc-700">→</span>
          <span className={cn("font-mono", v === Infinity ? "text-zinc-700" : "text-emerald-600")}>
            {v === Infinity ? "∞" : v}
          </span>
        </div>
      ))}
      {edges.length > 0 && (
        <p className="text-xs text-zinc-600">
          {edges.length} edge{edges.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

function HashViz({ state }: { state: Record<string, unknown> }) {
  const map = (state.map ?? state.table ?? {}) as Record<string, number>;
  return (
    <div className="space-y-1">
      {Object.entries(map).map(([k, v]) => (
        <div key={k} className="flex items-center gap-3 font-mono text-sm">
          <span className="w-8 text-black">{k}</span>
          <span className="text-zinc-700">→</span>
          <span className="text-zinc-800">{String(v)}</span>
        </div>
      ))}
    </div>
  );
}

function LinkedListViz({ state }: { state: Record<string, unknown> }) {
  const nodes = (state.nodes as Array<{ val: number; next?: number }> | undefined) ?? [];

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-zinc-300 bg-zinc-100/50 font-mono text-sm text-zinc-800">
            {node.val}
          </div>
          {node.next !== undefined && (
            <svg width="24" height="40" className="shrink-0">
              <path d="M 0 20 L 20 20" stroke="#3f3f46" strokeWidth="1" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                  <path d="M 0 0 L 4 2 L 0 4 Z" fill="#3f3f46" />
                </marker>
              </defs>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}