/// <reference types="vite/client" />
import type { RunRequest, RunResult, TestCase } from "./protocol";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const self = globalThis as any;

let pyodide: any = null;
let isReady = false;

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/";

async function bootstrap() {
  try {
    // Dynamically import pyodide-core from CDN
    // @ts-ignore
    importScripts(`${PYODIDE_CDN}pyodide.js`);
    // @ts-ignore
    pyodide = await loadPyodide({ indexURL: PYODIDE_CDN });

    // Preload stdlib modules
    await pyodide.runPythonAsync(`
import collections, heapq, bisect, functools, itertools, math, sys, time, json, os
`);

    isReady = true;
    self.postMessage({ type: "ready" });
  } catch (err) {
    console.error("[pyodide.worker] bootstrap failed:", err);
  }
}

async function handleRun(req: RunRequest): Promise<RunResult> {
  const { code, tests, timeoutMs } = req;

  const stdout: string[] = [];
  const originalWrite = (s: string) => stdout.push(s);
  // Capture print() output
  pyodide.runPython(`
import sys
class _Capture:
    def __init__(self):
        self.output = []
    def write(self, s):
        if s and s.strip():
            self.output.append(s)
    def flush(self):
        pass
_capture = _Capture()
`);

  try {
    // Set timeout
    const start = performance.now();
    const deadline = start + timeoutMs;

    // Run user code — gets its own namespace
    const userNs = { ...pyodide.globals.get("__dict__") };
    await pyodide.runPythonAsync(code, { globals: userNs });

    // Find the last defined function (heuristic: user writes one function)
    const funcName = findTargetFunction(pyodide, userNs);
    if (!funcName) {
      return {
        type: "result",
        passed: false,
        failures: [
          {
            index: 0,
            actual: null,
            expected: null,
            runtimeMs: performance.now() - start,
            error: "No function found. Define a function like `def solve(...):` to be tested.",
          },
        ],
        runtimeMs: performance.now() - start,
        stdout: stdout.join(""),
      };
    }

    const pyFunc = userNs[funcName];
    const failures: RunResult["failures"] = [];
    let totalMs = 0;

    for (let i = 0; i < tests.length; i++) {
      const tc = tests[i];
      try {
        const t0 = performance.now();
        const argsJson = JSON.stringify(tc.args);
        const kwargsJson = JSON.stringify(tc.kwargs);
        const actual = pyodide.runPython(
          `${funcName}(*${argsJson}, **${kwargsJson})`,
          { globals: userNs },
        );
        const elapsed = performance.now() - t0;
        totalMs += elapsed;

        // Deep equality check
        const actualrepr = JSON.stringify(actual);
        const expectedrepr = JSON.stringify(tc.expected);
        const passed = actualrepr === expectedrepr;

        failures.push({
          index: i,
          actual: actualrepr,
          expected: expectedrepr,
          runtimeMs: Math.round(elapsed * 100) / 100,
          error: null,
        });
      } catch (err: any) {
        failures.push({
          index: i,
          actual: null,
          expected: JSON.stringify(tc.expected),
          runtimeMs: 0,
          error: String(err?.message ?? err),
        });
      }

      if (performance.now() > deadline) {
        return { type: "timeout" } as any;
      }
    }

    const allPassed = failures.every((f) => !f.error && f.actual === f.expected);

    return {
      type: "result",
      passed: allPassed,
      failures,
      runtimeMs: Math.round(totalMs),
      stdout: stdout.join(""),
    };
  } catch (err: any) {
    return {
      type: "result",
      passed: false,
      failures: [
        {
          index: 0,
          actual: null,
          expected: null,
          runtimeMs: 0,
          error: String(err?.message ?? err),
        },
      ],
      runtimeMs: 0,
      stdout: stdout.join(""),
    };
  }
}

function findTargetFunction(pyodide: any, ns: Record<string, unknown>): string | null {
  // Heuristic: return the last defined function that isn't a dunder
  const entries = Object.entries(ns).filter(
    ([k, v]) =>
      k.startsWith("solve") ||
      k.startsWith("implement") ||
      k.startsWith("run") ||
      (typeof v === "function" && !k.startsWith("_")),
  );
  return entries[entries.length - 1]?.[0] ?? null;
}

self.onmessage = async (e: MessageEvent) => {
  const req = e.data as RunRequest;

  if (req.type === "run") {
    if (!isReady) {
      self.postMessage({
        type: "result",
        passed: false,
        failures: [{ index: 0, actual: null, expected: null, runtimeMs: 0, error: "Pyodide not ready yet." }],
        runtimeMs: 0,
        stdout: "",
      } satisfies RunResult);
      return;
    }

    const result = await handleRun(req);
    self.postMessage(result);
  }
};

// Start bootstrapping
bootstrap();