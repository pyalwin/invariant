// Protocol between the main thread and pyodide.worker.ts

export interface TestCase {
  args: unknown[];
  kwargs: Record<string, unknown>;
  expected: unknown;
}

export interface RunRequest {
  type: "run";
  code: string;
  tests: TestCase[];
  timeoutMs: number;
}

export interface RunResult {
  type: "result";
  passed: boolean;
  failures: Array<{
    index: number;
    actual: unknown;
    expected: unknown;
    runtimeMs: number;
    error: string | null;
  }>;
  runtimeMs: number;
  stdout: string;
}

export interface ReadyMessage {
  type: "ready";
}

export type WorkerMessage = RunRequest;
export type WorkerResponse = RunResult | ReadyMessage | { type: "timeout" };