import { useCallback, useRef, useState } from "react";
import type { RunRequest, RunResult, TestCase } from "@/workers/protocol";

interface RunnerState {
  status: "idle" | "running" | "done" | "timeout" | "error";
  result: RunResult | null;
}

export function useRunner() {
  const [state, setState] = useState<RunnerState>({ status: "idle", result: null });
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warmWorkerRef = useRef<Worker | null>(null);

  const getWorker = useCallback(() => {
    if (warmWorkerRef.current) {
      return warmWorkerRef.current;
    }
    const w = new Worker(
      new URL("@/workers/pyodide.worker.ts", import.meta.url),
      { type: "module" },
    );
    warmWorkerRef.current = w;
    return w;
  }, []);

  const run = useCallback(
    (code: string, tests: TestCase[], timeoutMs = 8000) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }

      const worker = getWorker();
      workerRef.current = worker;

      setState({ status: "running", result: null });

      const req: RunRequest = { type: "run", code, tests, timeoutMs };

      const timer = setTimeout(() => {
        worker.terminate();
        warmWorkerRef.current = null;
        setState({ status: "timeout", result: null });
        // Boot replacement in background
        warmWorkerRef.current = new Worker(
          new URL("@/workers/pyodide.worker.ts", import.meta.url),
          { type: "module" },
        );
      }, timeoutMs);

      timeoutRef.current = timer;

      worker.onmessage = (e: MessageEvent) => {
        if (e.data.type === "ready") return;

        clearTimeout(timer);
        workerRef.current = null;

        if (e.data.type === "timeout") {
          setState({ status: "timeout", result: null });
        } else {
          setState({ status: "done", result: e.data as RunResult });
        }
      };

      worker.onerror = (e) => {
        clearTimeout(timer!);
        setState({
          status: "error",
          result: {
            type: "result",
            passed: false,
            failures: [
              {
                index: 0,
                actual: null,
                expected: null,
                runtimeMs: 0,
                error: e.message ?? "Worker error",
              },
            ],
            runtimeMs: 0,
            stdout: "",
          },
        });
      };

      worker.postMessage(req);
    },
    [getWorker],
  );

  const reset = useCallback(() => {
    setState({ status: "idle", result: null });
  }, []);

  return { state, run, reset };
}