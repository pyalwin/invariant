// Topic manifest — used by Home.tsx and Topic.tsx
// Must be kept in sync with content/topics/*.mdx frontmatter

export interface TopicMeta {
  id: string;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  prereqs: string[];
  invariant: string;
}

export const topics: TopicMeta[] = [
  // Linear
  {
    id: "arrays",
    title: "Arrays & Lists",
    category: "Linear",
    difficulty: "easy",
    prereqs: [],
    invariant: "Elements occupy contiguous memory; index i is always i elements from start.",
  },
  {
    id: "strings",
    title: "Strings",
    category: "Linear",
    difficulty: "easy",
    prereqs: ["arrays"],
    invariant: "Immutable in Python; concatenation in a loop is O(n²).",
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    category: "Linear",
    difficulty: "medium",
    prereqs: ["arrays"],
    invariant: "No random access; traversal requires following next pointers.",
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    category: "Linear",
    difficulty: "easy",
    prereqs: ["arrays"],
    invariant: "LIFO for stack; FIFO for queue; deque achieves both in O(1).",
  },
  // Hashing
  {
    id: "hashmaps",
    title: "Dicts & Sets",
    category: "Hashing",
    difficulty: "easy",
    prereqs: [],
    invariant: "O(1) amortized lookup/insert; iteration order is insertion order (3.7+).",
  },
  {
    id: "bloom-filters",
    title: "Bloom Filters",
    category: "Advanced",
    difficulty: "hard",
    prereqs: ["hashmaps"],
    invariant: "May have false positives, never false negatives.",
  },
  // Heaps
  {
    id: "heapq",
    title: "Heapq Patterns",
    category: "Heaps",
    difficulty: "medium",
    prereqs: ["arrays"],
    invariant: "Parent is always smaller (min-heap); root is minimum element.",
  },
  // Trees
  {
    id: "trees-binary",
    title: "Binary Trees",
    category: "Trees",
    difficulty: "medium",
    prereqs: ["arrays"],
    invariant: "Each node has at most two children; no implied ordering.",
  },
  {
    id: "trees-bst",
    title: "BST",
    category: "Trees",
    difficulty: "medium",
    prereqs: ["trees-binary"],
    invariant: "Left subtree < node ≤ right subtree; inorder gives sorted order.",
  },
  {
    id: "trees-segment",
    title: "Segment Trees",
    category: "Trees",
    difficulty: "hard",
    prereqs: ["trees-binary", "arrays"],
    invariant: "Each node stores aggregate of a segment; range query in O(log n).",
  },
  {
    id: "trees-fenwick",
    title: "Fenwick Trees",
    category: "Trees",
    difficulty: "hard",
    prereqs: ["arrays"],
    invariant: "Binary indexed tree; prefix sum in O(log n), point update in O(log n).",
  },
  {
    id: "trees-trie",
    title: "Tries",
    category: "Trees",
    difficulty: "medium",
    prereqs: ["trees-binary"],
    invariant: "Children represent next character; terminal nodes mark word boundaries.",
  },
  // Graphs
  {
    id: "graphs-bfs",
    title: "BFS",
    category: "Graphs",
    difficulty: "easy",
    prereqs: [],
    invariant: "Queue-based; explores nodes in increasing depth order.",
  },
  {
    id: "graphs-dfs",
    title: "DFS",
    category: "Graphs",
    difficulty: "easy",
    prereqs: ["graphs-bfs"],
    invariant: "Stack/recursion-based; explores as deep as possible before backtracking.",
  },
  {
    id: "graphs-dijkstra",
    title: "Dijkstra",
    category: "Graphs",
    difficulty: "hard",
    prereqs: ["graphs-bfs", "heapq"],
    invariant: "Relaxation property; once popped, distance is finalized.",
  },
  {
    id: "graphs-bellman-ford",
    title: "Bellman-Ford",
    category: "Graphs",
    difficulty: "hard",
    prereqs: ["graphs-dijkstra"],
    invariant: "V-1 relaxations guarantee shortest path even with negative edges.",
  },
  {
    id: "graphs-union-find",
    title: "Union-Find",
    category: "Graphs",
    difficulty: "medium",
    prereqs: [],
    invariant: "Two sets are disjoint unless unioned; path compression flattens trees.",
  },
  {
    id: "graphs-mst",
    title: "MST (Kruskal/Prim)",
    category: "Graphs",
    difficulty: "hard",
    prereqs: ["graphs-union-find", "heapq"],
    invariant: "Cuts property: the minimum edge crossing any cut is in some MST.",
  },
  // DP
  {
    id: "dp-1d",
    title: "DP — 1D",
    category: "DP",
    difficulty: "medium",
    prereqs: [],
    invariant: "Optimal substructure: best answer for state depends on best answers for sub-states.",
  },
  {
    id: "dp-2d",
    title: "DP — 2D",
    category: "DP",
    difficulty: "medium",
    prereqs: ["dp-1d"],
    invariant: "Grid DP: cell (i,j) depends on (i-1,j), (i,j-1), (i-1,j-1) or similar.",
  },
  {
    id: "dp-bitmask",
    title: "DP — Bitmask",
    category: "DP",
    difficulty: "hard",
    prereqs: ["dp-1d"],
    invariant: "Mask of visited nodes; transition adds one node at a time.",
  },
  // Strings
  {
    id: "strings-kmp",
    title: "KMP",
    category: "Strings",
    difficulty: "hard",
    prereqs: ["strings"],
    invariant: "LPS[i] = longest proper prefix which is also suffix in pattern[0..i].",
  },
  // Advanced
  {
    id: "advanced-consistent-hash",
    title: "Consistent Hashing",
    category: "Advanced",
    difficulty: "hard",
    prereqs: ["hashmaps"],
    invariant: "Adding/removing a node only moves O(1/n) of keys.",
  },
  {
    id: "advanced-lsm",
    title: "LSM Trees",
    category: "Advanced",
    difficulty: "hard",
    prereqs: ["trees-binary", "heapq"],
    invariant: "Write path appends to memtable; flush to SSTables in sorted runs.",
  },
];