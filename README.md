# Invariant

Invariant is a local-first study app for staff-level data structures and algorithms interview prep in Python. It is built around the idea that senior interview signal comes from choosing the right approach, defending tradeoffs, and reasoning about scale, not just producing code.

The app combines structured topic pages, progress tracking, review queues, mock interview flow, and in-browser Python execution through Pyodide.

## What It Covers

Every topic follows a six-step loop:

1. Brief: the invariant, when to use the structure, Python cost model, and system connections.
2. Visualize: a small trace of how the structure or algorithm evolves.
3. Tradeoffs: when this approach wins and when it does not.
4. Drill: approach-selection prompts with explanations.
5. Implement: a Python exercise with hidden-test guidance.
6. Scale: how the same problem changes at 1K, 1M, 1B, and distributed scale.

Current topic coverage:

- Linear: arrays/lists, strings, linked lists, stacks and queues
- Hashing: dicts and sets, Bloom filters
- Heaps: `heapq` patterns
- Trees: binary trees, BSTs, segment trees, Fenwick trees, tries
- Graphs: BFS, DFS, Dijkstra, Bellman-Ford, Union-Find, MST
- Dynamic Programming: 1D, 2D, bitmask
- Strings: KMP
- Advanced: consistent hashing, LSM trees

## Tech Stack

- React 18 + Vite
- TypeScript
- Tailwind CSS
- Zustand for client state
- Hono on Bun for the local API
- SQLite via `bun:sqlite`
- Pyodide in a Web Worker for browser-side Python execution
- Biome for linting/formatting

## Requirements

- Bun 1.3+
- Node.js 20+ is recommended for the Vite/tooling ecosystem

The first Python execution loads Pyodide from jsDelivr:

```text
https://cdn.jsdelivr.net/pyodide/v0.26.0/full/
```

So the app can run locally, but code execution needs network access on first Pyodide load unless you vendor Pyodide separately.

## Quick Start

Install dependencies:

```bash
bun install
```

Run the app in development:

```bash
bun run dev
```

This starts:

- Vite client at `http://localhost:5173`
- Bun API server at `http://localhost:3001`

The Vite dev server proxies `/api/*` to the Bun server.

Build for production:

```bash
bun run build
```

Run the API server directly:

```bash
bun run start
```

## Configuration

Optional environment variables:

```bash
PORT=3001
DATABASE_PATH=/absolute/path/to/db.sqlite
```

If `DATABASE_PATH` is not set, the app stores SQLite data at:

```text
~/.invariant/db.sqlite
```

See [.env.example](.env.example).

## Useful Commands

```bash
bun run dev       # start Vite + Bun API
bun run build     # typecheck and build the client
bun run test      # run Bun tests
bun run lint      # run Biome checks
bun run format    # format src and server
```

Note: the current repository has some older lint debt outside the study-plan work. `bun run build` is the main production sanity check.

## Project Structure

```text
src/
  content/               # Typed study-plan content by module
  components/            # Shared React components and study renderer
  pages/                 # Route-level pages
  store/                 # Zustand stores
  workers/               # Pyodide worker and protocol
  lib/topics.ts          # Topic manifest

server/
  routes/                # Hono API routes
  migrations/            # SQLite schema
  db.ts                  # SQLite initialization

docs/
  ARCHITECTURE.md
  CONTENT_AUTHORING.md
  DECISIONS.md
  PLAN.md
  PYODIDE_NOTES.md
```

Topic pages are currently React-backed through typed study-plan modules, not MDX. The route in [Topic.tsx](src/pages/Topic.tsx) looks up a topic id in the study-plan maps and renders it with [LinearStudyPage.tsx](src/components/LinearStudyPage.tsx).

## Adding or Editing Study Content

Topic metadata lives in [src/lib/topics.ts](src/lib/topics.ts). The rendered content lives in module-specific files:

- [src/content/linearStudyPlans.ts](src/content/linearStudyPlans.ts)
- [src/content/hashingStudyPlans.ts](src/content/hashingStudyPlans.ts)
- [src/content/heapsStudyPlans.ts](src/content/heapsStudyPlans.ts)
- [src/content/treesStudyPlans.ts](src/content/treesStudyPlans.ts)
- [src/content/graphsStudyPlans.ts](src/content/graphsStudyPlans.ts)
- [src/content/dpStudyPlans.ts](src/content/dpStudyPlans.ts)
- [src/content/stringStudyPlans.ts](src/content/stringStudyPlans.ts)
- [src/content/advancedStudyPlans.ts](src/content/advancedStudyPlans.ts)

Each study plan includes:

- `brief`
- `visualize`
- `tradeoffs`
- `drill`
- `implement`
- `scale`
- `patterns`

When adding a new topic:

1. Add the topic to `src/lib/topics.ts`.
2. Add a matching study-plan object in the appropriate `src/content/*StudyPlans.ts` file.
3. If the module is new, import its map in `src/pages/Topic.tsx` and include it in the `studyPlan` lookup.
4. Run `bun run build`.

## Data Model

Progress, mock attempts, and SRS review cards are persisted in local SQLite. The default user id is `local`; the schema is prepared for multiple users later.

Main API routes:

- `GET/PUT /api/progress`
- `POST /api/attempts`
- `GET/POST /api/srs`
- `POST/GET /api/mock`
- `GET /api/health`

## Design Notes

Invariant is intentionally local-first:

- No hosted account system
- No cloud sync
- SQLite-backed progress on the local machine
- Browser-executed Python in a worker sandbox

This makes it fast to iterate on content and safe to run interview-practice code without sending it to a remote executor.

## Verification Status

Recently verified:

- `bun run build`
- Scoped Biome checks on touched study-plan files
- Browser smoke checks across representative topic routes
- `/api/progress` returning 200 during dev-server verification

## License

No license has been selected yet.
