# Content Authoring Guide

## Adding a Topic

Run the scaffold script:

```bash
bun scripts/add-topic.ts --id graphs-dijkstra --title "Dijkstra's Algorithm" --category graphs --difficulty hard
```

This creates `content/topics/graphs-dijkstra.mdx` with placeholder sections and adds it to the topic manifest in `src/lib/topics.ts`.

## MDX Structure

Every topic file follows this exact structure:

```mdx
---
id: graphs-dijkstra
title: Dijkstra's Algorithm
category: graphs
difficulty: hard           # easy | medium | hard
prereqs: [graphs-bfs]      # topic IDs that should be done first
invariant: "All relaxed nodes have their shortest distance finalized."
realWorldConnections:
  - "PostgreSQL index seeks (B-tree)"
  - "Uber routing engine"
  - "Google Maps ETA"
---

## Brief

<!-- 2–3 paragraphs. Cover WHY first: when would you reach for this?
     Then WHAT: what does it guarantee? Then HOW: sketch the approach.
     Python-native examples. Max 400 words. -->

Dijkstra computes the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights...

## Visualizer

<Visualizer
  code={`
import heapq

def dijkstra(graph, src):
    dist = {node: float('inf') for node in graph}
    dist[src] = 0
    heap = [(0, src)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))

    return dist
`}
  structure="graph"
  trace={[
    { step: "init", highlight: [2,3], state: { dist: { A: 0, B: "∞", C: "∞" }, heap: [[0, "A"]] } },
    { step: "pop A", highlight: [7,8], state: { dist: { A: 0, B: 4, C: "∞" }, heap: [[4, "B"]] } },
    /* ... */
  ]}
/>

## Tradeoffs

<TradeoffMatrix
  subject="Dijkstra (min-heap)"
  alternatives={[
    {
      name: "Bellman-Ford",
      time: "O(VE)",
      space: "O(V)",
      notes: "Handles negative edges; slower; no heap needed"
    },
    {
      name: "BFS (unweighted)",
      time: "O(V+E)",
      space: "O(V)",
      notes: "Only for unit-weight graphs; simpler"
    },
    {
      name: "A*",
      time: "O(E log V) best case",
      space: "O(V)",
      notes: "Heuristic guidance; beats Dijkstra when destination is known"
    }
  ]}
  pythonNotes={[
    "`heapq` is a min-heap — distances work directly",
    "Use a `visited` set OR the `d > dist[u]` lazy-deletion check (shown above)",
    "Dict for `dist` is fine; defaultdict(lambda: float('inf')) avoids KeyError"
  ]}
/>

## Drill

<PickApproach
  problems={[
    {
      id: "dijkstra-drill-1",
      stem: "You have a dense graph (10k nodes, 90M edges). Which shortest-path algorithm?",
      options: ["Dijkstra with binary heap", "Dijkstra with Fibonacci heap", "Bellman-Ford", "BFS"],
      answer: 1,
      explanation: "Dense graphs (E ≈ V²) favor Fibonacci heap Dijkstra O(E + V log V). Binary heap is O(E log V) — worse here. Bellman-Ford is O(VE), far worse. BFS only works for unit weights."
    },
    /* more problems... */
  ]}
/>

## Scale-Up

<ScaleUp
  tiers={[
    {
      scale: "1K nodes",
      answer: "Dijkstra with binary heap. Runs in microseconds. No special treatment."
    },
    {
      scale: "1M nodes",
      answer: "Still fine in-memory with an adjacency list. Peak memory ~100MB. Watch for dense graphs."
    },
    {
      scale: "1B nodes",
      answer: "Graph doesn't fit in one machine. Partition via consistent hashing. Use distributed BFS/SSSP (Pregel model). Landmark-based approximations for latency-sensitive paths."
    },
    {
      scale: "Distributed / real-time",
      answer: "Precompute landmark distances offline. Serve ALT (A* + Landmarks + Triangle inequality) or Contraction Hierarchies. Google Maps uses CH with real-time traffic overlays."
    }
  ]}
/>
```

## Visualizer Trace Format

The `trace` prop is a list of steps. Each step has:
- `step`: label shown in the step controls
- `highlight`: line numbers to highlight in the code snippet
- `state`: arbitrary object rendered by the structure-specific renderer

The renderer is selected by the `structure` prop: `"array"`, `"tree"`, `"graph"`, `"heap"`, `"hash"`, `"linked-list"`.

If `trace` is omitted, the Visualizer shows the code but does not animate state — acceptable for topics where step-by-step state is complex to encode.

## Writing Good Pick-the-Approach Problems

- Stem should be a realistic scenario, not an abstract "which complexity is better"
- Options must all be plausible — bad options teach nothing
- Explanation must justify *why* the others are wrong, not just why the answer is right
- Minimum 3 problems per topic, target 5

## Writing Good Scale-Up Cascades

- 1K: "is the naive approach fine?" — usually yes
- 1M: "does it still fit in memory?" — often yes, but call out constants
- 1B: "it doesn't fit on one machine" — partition, approximate, or precompute
- Distributed: "real-world system answer" — name actual systems (Dynamo, Cassandra, Spanner, etc.)
