# Pyodide Notes

## Worker Lifecycle

```
App starts
    ↓
useRunner hook (first mount) → new Worker(pyodide.worker.ts)
    ↓
Worker: loads Pyodide from CDN (~2–3s first time, cached after)
Worker: preloads stdlib modules
Worker: sends {type:"ready"} to host
    ↓
Host: marks worker as warm, renders Run button as enabled
    ↓
User hits Run
    ↓
Host: sends {type:"run", code, tests, timeoutMs:5000}
    ↓
Worker: executes code + test harness
    ↓
Worker: sends {type:"result", ...} or {type:"timeout"}
    ↓
If timeout:
    Host: terminates worker, boots a new warm worker in background
```

## Preloaded Modules

The worker preloads (via `pyodide.runPythonAsync`) these modules so they're importable instantly:

```python
import collections, heapq, bisect, functools, itertools, math, sys, time
```

Other stdlib modules (`random`, `re`, `string`, etc.) are available but not preloaded — they import on first use with a small delay.

## Test Harness

The harness wraps user code in a module, calls the target function with each test case, and compares output:

```python
# harness template (expanded by the worker before execution)
import sys, time, traceback

def _run_tests(user_fn, cases):
    results = []
    for i, (args, kwargs, expected) in enumerate(cases):
        try:
            t0 = time.perf_counter()
            actual = user_fn(*args, **kwargs)
            elapsed = (time.perf_counter() - t0) * 1000  # ms
            passed = actual == expected
            results.append({
                "index": i,
                "passed": passed,
                "actual": repr(actual),
                "expected": repr(expected),
                "runtimeMs": round(elapsed, 2),
                "error": None
            })
        except Exception as e:
            results.append({
                "index": i,
                "passed": False,
                "actual": None,
                "expected": repr(expected),
                "runtimeMs": 0,
                "error": traceback.format_exc()
            })
    return results
```

Test cases are serialized from the topic MDX `tests` prop and passed to the worker as JSON. The worker deserializes them, calls the harness, and serializes results back.

## Timeout Enforcement

Pyodide runs synchronously in the worker thread. The host sets a `setTimeout` for `timeoutMs` on the host side; when it fires, it calls `worker.terminate()`. This is the only reliable way to interrupt WASM execution — cooperative cancellation doesn't work.

After termination, the host creates a new worker immediately (background warm-up) so the next run doesn't pay the cold-start cost.

## CDN Caching

Pyodide assets (~10MB of WASM + stdlib) are served from `cdn.jsdelivr.net/pyodide`. They are HTTP-cached after the first load. In production, consider copying Pyodide assets into `public/pyodide/` to avoid CDN dependency:

```bash
# One-time: copy assets to public
bunx pyodide-cdn-copy --version 0.26.0 --dest public/pyodide
```

Then in the worker:
```ts
await loadPyodide({ indexURL: '/pyodide/' })
```

## Known Limitations

- `input()` is not supported (no stdin in WASM)
- File system operations are sandboxed — no disk access
- `threading` and `multiprocessing` are not available
- Package install (`micropip.install`) is supported but slow; avoid in problem harnesses
- WASM execution is ~5–10x slower than native CPython — times shown to users reflect this; don't use for benchmarking
