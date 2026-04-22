# Architecture Decision Records

## ADR-001: Bun as runtime, package manager, and test runner

**Decision**: Use Bun for everything — install, dev server, build, test, production serve.

**Rationale**: Bun ships a fast package manager, a bundler, a test runner, `bun:sqlite` (zero-dep SQLite), and `Bun.serve` (HTTP server) in one binary. No npm/yarn/pnpm, no jest/vitest setup. Eliminates the "which thing handles which" overhead on a new project.

**Trade-offs**: Bun is not Node. A small number of npm packages that rely on Node internals may not work. For this project's dependency surface (Hono, Zustand, React, Monaco, Pyodide) there are no known incompatibilities.

---

## ADR-002: Pyodide for Python execution

**Decision**: Run user Python code in a Web Worker via Pyodide (CPython 3.11 compiled to WASM).

**Rationale**:
- No server round-trip per run — execution is instant after warm-up
- Sandboxed — user code cannot affect the host
- Offline-capable — once Pyodide CDN assets are cached, no network needed
- stdlib fully available: `collections`, `heapq`, `bisect`, `functools`, `itertools`, `math`
- Timeout enforced by terminating the worker (no cooperative yield needed)

**Trade-offs**:
- Cold start is ~2–3s (amortized with a 1-worker warm pool)
- Cannot install arbitrary PyPI packages (only Pyodide-ported ones)
- WASM execution is slower than native Python (~5–10x); not a problem for DSA problem sizes

**Fallback (v2)**: Backend subprocess via `python3` for problems needing unported packages. Feature-flagged off in v1.

---

## ADR-003: coss ui for primitive components

**Decision**: Use coss ui (Base UI + Tailwind) for buttons, dialogs, dropdowns, tabs, selects, tooltips, toasts, inputs, tables, and the command palette.

**Rationale**: coss ui is built on Base UI (the headless primitives library from the Radix/MUI lineage), which provides robust accessibility without visual opinions. Tailwind-styled so it fits our design tokens. Copy-paste model means no runtime dep on upstream — we own the code.

---

## ADR-004: magicui for animated components

**Decision**: Use magicui for AnimatedBeam (topic graph), NumberTicker (timers/stats), BorderBeam (active step highlight), BlurFade (step transitions), AnimatedList (SRS queue), Marquee (system callouts).

**Rationale**: These are one-off visual polish elements that would take hours to build from scratch with framer-motion. magicui ships them as copy-paste components; we take only what we use.

---

## ADR-005: bun:sqlite for persistence

**Decision**: SQLite via `bun:sqlite`, single file at `~/.invariant/db.sqlite` (configurable via `DATABASE_PATH`).

**Rationale**: This is a local-first single-user app. SQLite is fast, zero-config, and requires no running server. `bun:sqlite` is built into Bun — no driver to install. Schema is multi-user-ready so cloud sync later is a driver swap, not a migration.

---

## ADR-006: MDX for topic content

**Decision**: Topic content (concept briefs, tradeoff matrices, drill problems, scale-up scenarios) is authored in MDX files under `content/topics/`.

**Rationale**: Content authors need to embed React components (visualizers, drill widgets) directly in prose. MDX is the standard solution. The MDX loader (via `@mdx-js/rollup`) is configured in Vite. Component bindings are declared in `src/lib/mdx.ts`.

---

## ADR-007: Monaco for code editing

**Decision**: Use `@monaco-editor/react` for the Python code editor in ProblemRunner and Mock mode.

**Rationale**: Monaco (VS Code's editor) has Python syntax highlighting, multi-cursor, keyboard shortcuts users already know, and is the de-facto standard for in-browser code editors. The `@monaco-editor/react` wrapper handles web worker setup.
