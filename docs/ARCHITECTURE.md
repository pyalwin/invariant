# Architecture

## System Boundaries

```
Browser
├── React app (Vite, port 5173 in dev)
│   ├── UI Components (coss ui + magicui)
│   ├── Pages (Home, Topic, Mock, Review, History)
│   ├── Monaco Editor (Python mode)
│   └── Zustand stores (progress, srs, mock, prefs)
│       └── sync via fetch to /api/*
│
└── Web Worker (pyodide.worker.ts)
    └── Pyodide runtime (Python 3.11 WASM)
        └── User code execution + test harness

Bun process (port 3001 in dev, same origin in prod)
├── Hono router (/api/*)
└── bun:sqlite → ~/.invariant/db.sqlite

In prod: Bun.serve() handles both /api/* (Hono) and /* (static Vite build)
In dev: Vite dev server proxies /api/* to Bun (port 3001)
```

## Data Flow: Code Execution

```
User types Python in Monaco
    ↓
"Run" button (Cmd+Enter)
    ↓
useRunner hook sends {type:"run", code, tests, timeoutMs} to worker
    ↓
pyodide.worker.ts receives message
    ↓
Pyodide executes user code + test harness in sandbox
    ↓
Worker responds with {type:"result", passed, failures, runtimeMs, stdout}
  OR {type:"timeout"} if > 5s
    ↓
ProblemRunner UI renders TestResults
    ↓
useRunner calls POST /api/attempts (persists to SQLite)
```

## Data Flow: Progress

```
User completes a topic step
    ↓
Topic.tsx calls progress.markStep(topicId, step)
    ↓
Zustand store updates local state (instant UI update)
    ↓
progress.ts store syncs via PUT /api/progress
    ↓
Hono route writes to topic_progress table in SQLite
    ↓
On next app load, store hydrates from GET /api/progress
```

## Worker Lifecycle

- One warm worker is kept alive after first load (amortizes ~2–3s Pyodide boot)
- On timeout, the worker is terminated and a new warm worker is booted in background
- Worker message protocol defined in `src/workers/protocol.ts`
- Worker loaded via `new Worker(new URL('./workers/pyodide.worker.ts', import.meta.url), { type: 'module' })`

## Key Type Boundaries

`server/lib/schemas.ts` defines zod schemas for all API request/response shapes.
`src/api/types.ts` re-exports the inferred TypeScript types — shared between client and server via a path alias (`@api/*` → `../../server/lib/schemas`). This is the single source of truth for the API contract; no code gen required.

## Vite Config (key points)

- `@mdx-js/rollup` plugin for MDX
- `/api/*` proxied to `http://localhost:3001` in dev
- Web Worker loaded as a module (Vite handles bundling)
- Monaco loaded lazily via dynamic import (heavy, ~2MB)
- `VITE_API_BASE` env var for prod API URL override
