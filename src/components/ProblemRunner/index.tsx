import { useEffect, useState } from "react";
import { useRunner } from "./useRunner";
import { TestResults } from "./TestResults";
import type { TestCase } from "@/workers/protocol";

interface ProblemRunnerProps {
  code: string;
  tests: TestCase[];
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
}

export default function ProblemRunner({
  code: initialCode,
  tests,
  onCodeChange,
  readOnly = false,
}: ProblemRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const { state, run, reset } = useRunner();

  useEffect(() => {
    setCode(initialCode);
    reset();
  }, [initialCode, reset]);

  const handleRun = () => {
    onCodeChange?.(code);
    run(code, tests);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-800">
          {state.status === "idle"
            ? "Ready"
            : state.status === "running"
            ? "Running…"
            : state.status === "done" && state.result?.passed
            ? "All tests passed"
            : state.status === "done"
            ? `${state.result?.failures.filter((f: { actual: unknown; expected: unknown }) => f.actual !== f.expected).length} failed`
            : state.status === "timeout"
            ? "Timed out"
            : "Error"}
        </span>
        <div className="flex items-center gap-2">
          {state.result && (
            <span className="font-mono text-xs text-zinc-600">
              {state.result.runtimeMs > 0 ? `${state.result.runtimeMs}ms` : ""}
            </span>
          )}
          <button
            onClick={handleRun}
            disabled={state.status === "running"}
            className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {state.status === "running" ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      {/* Monaco-like textarea stub */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full resize-none rounded-md border border-zinc-300 bg-white px-4 py-3 font-mono text-sm text-black placeholder-zinc-700 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        rows={12}
      />

      {state.status === "done" && state.result && (
        <TestResults result={state.result} />
      )}
      {state.status === "timeout" && (
        <div className="rounded-md border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-600">
          Execution timed out. Your code ran for more than 8 seconds.
        </div>
      )}
      {state.status === "error" && state.result && (
        <TestResults result={state.result} />
      )}
    </div>
  );
}