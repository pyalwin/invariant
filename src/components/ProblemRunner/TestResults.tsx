import type { RunResult } from "@/workers/protocol";

interface TestResultsProps {
  result: RunResult;
}

export function TestResults({ result }: TestResultsProps) {
  return (
    <div className="space-y-2">
      {result.stdout && (
        <div className="mb-2 rounded bg-white px-3 py-2 font-mono text-xs text-zinc-600">
          <pre className="whitespace-pre-wrap">{result.stdout}</pre>
        </div>
      )}
      <div className="space-y-1">
        {result.failures.map((f) => (
          <div
            key={f.index}
            className={`rounded-md border px-3 py-2 text-sm ${
              f.error
                ? "border-red-200 bg-red-50/80"
                : f.actual === f.expected
                ? "border-emerald-200/50 bg-emerald-50/50"
                : "border-amber-200/50 bg-amber-50/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-800">
                Test {f.index + 1}
              </span>
              <span className="font-mono text-xs text-zinc-600">
                {f.runtimeMs > 0 ? `${f.runtimeMs.toFixed(2)}ms` : "—"}
              </span>
            </div>
            {f.error ? (
              <p className="mt-1 text-xs text-red-600">{f.error}</p>
            ) : f.actual !== f.expected ? (
              <div className="mt-1 space-y-0.5 text-xs">
                <p className="text-red-600">
                  Expected: <span className="font-mono">{String(f.expected)}</span>
                </p>
                <p className="text-amber-600">
                  Got: <span className="font-mono">{String(f.actual)}</span>
                </p>
              </div>
            ) : (
              <p className="mt-1 text-xs text-emerald-600">Passed</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}