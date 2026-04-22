# Invariant — Product Spec

## What It Is

**Invariant** is a local-first web app for staff software engineer DSA interview prep, with Python as the working language. It runs user-written Python in the browser via Pyodide (sandboxed, offline), persists progress to a SQLite-backed Bun API, and uses coss ui + magicui for a polished UI.

The premise: junior interviews test whether you can solve a problem. Staff interviews test whether you can *pick the right approach, defend the tradeoffs, and reason about scale*. Leetcode grinding builds the wrong muscle. Invariant drills the staff-specific one.

## Product Name

**Invariant** — a loop/data-structure invariant is the property that stays true under transformation. Staff engineers are paid to find and preserve invariants under changing requirements.

---

## User Flow

### Six-Step Topic Loop

Every topic runs the same loop. You cannot skip steps (though you can mark revisit to come back).

**Step 1: Concept Brief**
2–3 minute explanation. One diagram. One invariant statement. Python-native examples. Covers the "why" before the "what" — when would you reach for this, what property does it guarantee.

**Step 2: Visualize**
Interactive canvas. Execute a short Python snippet step by step; the data structure's state animates in SVG as each operation runs. Step forward, step back, scrub a timeline. Powered by actual Pyodide execution — not pre-recorded frames.

**Step 3: Tradeoff Matrix**
This structure vs. 2–3 alternatives. Columns: time (amortized), space, cache locality, concurrency cost, implementation cost, mutation support. Python-specific call-outs in each row (e.g., "`list.pop(0)` is O(n) — use `deque`", "`heapq` is min-heap only — negate to simulate max", "`dict` is insertion-ordered from 3.7", "`set` is unordered — don't rely on iteration order").

**Step 4: Pick-the-Approach Drill**
3–5 short problem stubs. Pick an approach from a dropdown and write 1–2 sentence justification *before* seeing the solution. No code yet. This is the staff-specific muscle — approach selection is often the whole interview signal.

**Step 5: Implement + Run**
Monaco editor, Python mode. Write a solution. Hit Run (or Cmd+Enter). Pyodide worker executes against hidden test cases. Pass/fail per case, runtime shown, stdout captured. Hidden tests expose edge cases: empty input, single element, duplicates, max-size inputs.

**Step 6: Scale-Up Cascade**
Same problem restated at four scales: 1K, 1M, 1B, distributed. At each tier the user predicts: does the answer change? What breaks? What's the new bottleneck? Then reveals the expected answer. Drills the "what if this is 10x bigger" reflex.

---

### Mock Interview Mode

30-minute countdown timer. Problem statement with constraints. Two alternating panels:
- **Explain** tab: user types a verbal-style explanation of their approach
- **Code** tab: Monaco + Run

On submit: self-grade against a rubric (7 items, checkboxes):
- [ ] Clarified constraints and edge cases before coding
- [ ] Proposed brute-force before jumping to optimal
- [ ] Stated time and space complexity correctly
- [ ] Handled edge cases in code
- [ ] Named the key tradeoff vs. a simpler approach
- [ ] Explained what changes at scale
- [ ] Code is readable without explanation

Session transcript (explanation text + final code + rubric scores) saved to SQLite. Viewable in History.

---

### Review Mode

Spaced-repetition queue. Each topic generates one SRS card from its invariant statement. Failed pick-the-approach drills also surface as cards. SM-2 lite algorithm: grades 0–5, interval and ease updated on each review. "Due today" count shown in nav badge.

---

## Topic Coverage (v1)

**Linear** — lists (cost model!), strings, linked lists, deque, stacks, queues

**Hashing** — dict, set, Counter, Bloom filter, Count-Min Sketch

**Trees** — binary, BST, segment tree, Fenwick tree, tries; conceptual coverage of AVL/red-black

**Heaps** — `heapq` patterns, d-ary heaps, interval scheduling patterns

**Graphs** — BFS, DFS, Dijkstra, Bellman-Ford, union-find, topological sort, SCC (Tarjan/Kosaraju), MST (Kruskal/Prim)

**Dynamic Programming** — 1D, 2D, bitmask, tree DP, digit DP, intervals

**Greedy** — with exchange argument proofs

**Divide & Conquer** — master theorem intuition, merge sort, quickselect

**Strings** — KMP, Z-algorithm, Rabin-Karp, suffix arrays (concept), tries

**Advanced / Staff-flavored** — skip lists, LSM trees, consistent hashing, HyperLogLog, reservoir sampling, B-trees, rope

The Advanced section is what separates Invariant from a leetcode clone. These structures appear constantly in system design interviews but almost no DSA tool covers them.

---

## Python-Specific Design Choices

The tool makes Python's cost model explicit, not assumed:

- `list.insert(0, x)` and `list.pop(0)` are O(n) — use `collections.deque`
- `str +=` in a loop is O(n²) — use `"".join(parts)`
- `heapq` is min-heap only — negate values to simulate max-heap
- `@lru_cache` adds ~1µs overhead per call — not free
- `dict` and `set` have O(1) amortized ops but O(n) worst-case on hash collision
- `bisect` for sorted-list search; `sortedcontainers.SortedList` for mutation
- GIL means threads don't parallelize CPU-bound work; reach for `multiprocessing`

Every tradeoff matrix calls out the Python-specific gotcha for that structure.

---

## Out of Scope (v1)

- User accounts and cloud sync (schema is multi-user-ready; wiring deferred)
- Languages other than Python
- Mobile layout (desktop-first study tool)
- Real-time collaboration
- Auto-graded mock evaluation (self-grade only)
- AI-generated hints or explanations (static content only)

---

## Implementation Phases

1. Scaffold: bun + Vite + Tailwind + Biome + folder layout
2. Component libraries: coss ui primitives + magicui animated
3. Backend: Hono + bun:sqlite + migrations + /api/* routes
4. Shell + routing: Home, Topic, Mock, Review, History pages
5. Pyodide worker: load + warm pool + run harness + ProblemRunner UI
6. First topic end-to-end: heapq (minimal surface, stdlib-backed, easy to visualize)
7. Visualizer engine: trace-driven, generalize to all structure types
8. Mock + rubric + SRS: timer, self-grade, transcript persistence
9. Remaining topics: scripted authoring with add-topic.ts
10. Polish: hotkeys, heatmap, marquee, theming
