# Invariant

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Powered by Bun](https://img.shields.io/badge/Bun-1.3-black.svg)](https://bun.sh/)

Invariant is a local-first study app for staff-level data structures and algorithms interview prep in Python.

It focuses on the skill senior interviews actually test: choosing the right approach, defending tradeoffs, reasoning from invariants, and explaining what changes at scale.

## Features

- Structured six-step learning loop for every topic
- Python-specific cost models and implementation notes
- Staff-style approach-selection drills
- Scale-up prompts from 1K to distributed systems
- In-browser Python execution through Pyodide
- Local progress, mock interview history, and review state in SQLite
- React/Vite frontend with a Bun + Hono local API

## Topics

Current coverage:

| Module | Topics |
| --- | --- |
| Linear | Arrays & Lists, Strings, Linked Lists, Stacks & Queues |
| Hashing | Dicts & Sets, Bloom Filters |
| Heaps | `heapq` Patterns |
| Trees | Binary Trees, BST, Segment Trees, Fenwick Trees, Tries |
| Graphs | BFS, DFS, Dijkstra, Bellman-Ford, Union-Find, MST |
| Dynamic Programming | 1D, 2D, Bitmask |
| Strings | KMP |
| Advanced | Consistent Hashing, LSM Trees |

Each topic has:

1. **Brief**: invariant, use cases, Python cost model, and system connections
2. **Visualize**: trace of the core algorithm or data structure behavior
3. **Tradeoffs**: comparison against adjacent approaches
4. **Drill**: approach-selection prompts with explanations
5. **Implement**: Python exercise with hidden-test guidance
6. **Scale**: 1K, 1M, 1B, and distributed-scale reasoning

## Screens

- **Topics**: module/topic catalog with progress indicators
- **Topic**: six-step study loop
- **Mock**: interview-style practice flow
- **Review**: spaced-repetition queue
- **History**: saved mock/interview attempts

## Tech Stack

- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- SQLite via `bun:sqlite`
- [Pyodide](https://pyodide.org/) in a Web Worker
- [Biome](https://biomejs.dev/) for formatting and linting

## Requirements

- Bun 1.3+
- Node.js 20+ recommended

Python execution loads Pyodide from jsDelivr on first worker boot:

```text
https://cdn.jsdelivr.net/pyodide/v0.26.0/full/
```

The app is local-first, but first-time code execution needs network access unless Pyodide is vendored.

## Installation

Clone the repository:

```bash
git clone https://github.com/pyalwin/invariant.git
cd invariant
```

Install dependencies:

```bash
bun install
```

Start the app:

```bash
bun run dev
```

Open:

```text
http://localhost:5173
```

Development starts two processes:

- Vite client: `http://localhost:5173`
- Bun API: `http://localhost:3001`

Vite proxies `/api/*` to the Bun API.

## Configuration

Optional environment variables:

```bash
PORT=3001
DATABASE_PATH=/absolute/path/to/db.sqlite
```

Default database path:

```text
~/.invariant/db.sqlite
```

See [.env.example](.env.example).

## Scripts

```bash
bun run dev       # Start Vite and the Bun API
bun run build     # Typecheck and build production assets
bun run start     # Start the Bun API server
bun run test      # Run tests with Bun
bun run lint      # Run Biome checks
bun run format    # Format src and server
```

## Architecture

```text
Browser
  React app
    Pages, topic renderer, Zustand stores
  Web Worker
    Pyodide runtime for Python execution

Bun server
  Hono API routes
  SQLite persistence
```

Key paths:

```text
src/
  content/        Typed study-plan content
  components/     Shared React components
  pages/          Route-level pages
  store/          Zustand stores
  workers/        Pyodide worker and message protocol
  lib/topics.ts   Topic manifest

server/
  routes/         Hono API routes
  migrations/     SQLite schema
  db.ts           SQLite initialization

docs/
  ARCHITECTURE.md
  CONTENT_AUTHORING.md
  DECISIONS.md
  PLAN.md
  PYODIDE_NOTES.md
```

More detail is available in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Study Content

Topic metadata lives in [src/lib/topics.ts](src/lib/topics.ts).

Rendered study content lives in typed modules:

- [src/content/linearStudyPlans.ts](src/content/linearStudyPlans.ts)
- [src/content/hashingStudyPlans.ts](src/content/hashingStudyPlans.ts)
- [src/content/heapsStudyPlans.ts](src/content/heapsStudyPlans.ts)
- [src/content/treesStudyPlans.ts](src/content/treesStudyPlans.ts)
- [src/content/graphsStudyPlans.ts](src/content/graphsStudyPlans.ts)
- [src/content/dpStudyPlans.ts](src/content/dpStudyPlans.ts)
- [src/content/stringStudyPlans.ts](src/content/stringStudyPlans.ts)
- [src/content/advancedStudyPlans.ts](src/content/advancedStudyPlans.ts)

The topic route resolves a topic id to a study-plan object and renders it with [src/components/LinearStudyPage.tsx](src/components/LinearStudyPage.tsx).

## Data Storage

Invariant stores local data in SQLite:

- topic progress
- spaced-repetition review cards
- mock interview attempts
- problem attempts

The default user id is `local`; the schema is ready for multiple users later.

Main API routes:

- `GET /api/health`
- `GET /api/progress`
- `PUT /api/progress`
- `POST /api/attempts`
- `GET /api/srs`
- `POST /api/srs`
- `POST /api/mock`
- `GET /api/mock/history`

## Development Notes

- Topic content is currently React/TypeScript-backed, not MDX-backed.
- The production build is the primary sanity check: `bun run build`.
- `bun run lint` may surface older lint debt in server/worker files.
- Generated artifacts such as `node_modules`, `dist`, Playwright output, screenshots, and TS build info are ignored.

## Roadmap

Potential next steps:

- Real interactive visualizers for each topic trace
- Monaco-backed exercises on every Implement step
- Better generated test harnesses for study-plan exercises
- Search and filtering over topics
- Cloud sync or export/import for progress
- Hosted deployment packaging

## Contributing

Contributions are welcome. For content changes:

1. Update the relevant `src/content/*StudyPlans.ts` module.
2. Keep the matching metadata in `src/lib/topics.ts` aligned.
3. Run `bun run build`.
4. Include screenshots or notes if UI layout changes.

For architecture context, read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DECISIONS.md](docs/DECISIONS.md).

## License

Invariant is licensed under the [MIT License](LICENSE).
