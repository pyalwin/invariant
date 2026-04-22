import type { LinearStudyPlan } from "@/content/linearStudyPlans";

export const heapsStudyPlans: Record<string, LinearStudyPlan> = {
  heapq: {
    id: "heapq",
    moduleLabel: "Heaps",
    title: "Heapq Patterns",
    invariant:
      "In a min-heap, every parent is less than or equal to its children. The root is always the current minimum.",
    brief: {
      why: [
        "Reach for a heap when you repeatedly need the next smallest or largest item from a changing collection without paying to keep the whole collection sorted.",
        "The important tradeoff is partial order. A heap does not make iteration sorted; it only guarantees that the root is the next item to pop.",
        "Classic heap patterns include top-k, k-way merge, Dijkstra, event simulation, interval scheduling, and priority queues with lazy deletion.",
      ],
      costModel: [
        "heapq.heappush(heap, item) is O(log n).",
        "heapq.heappop(heap) is O(log n), and heap[0] peeks at the minimum in O(1).",
        "heapq.heapify(items) builds a heap in O(n), not O(n log n).",
        "Python heapq is min-heap only. Simulate max-heap behavior by negating numeric priorities or reversing the comparison key.",
      ],
      realWorld: [
        "Task schedulers and event loops use priority queues to run the earliest deadline or next timer.",
        "Search and graph systems use heaps for best-first expansion, including Dijkstra and A*.",
        "Log processing systems use heap-based k-way merge to combine sorted runs without loading everything at once.",
      ],
    },
    visualize: {
      title: "A heap keeps only the next minimum obvious",
      description:
        "The array representation stores a tree by index: children of i live at 2*i + 1 and 2*i + 2. Push and pop repair the parent-child invariant along one path.",
      code: `import heapq

heap = [4, 8, 6, 10]
heapq.heapify(heap)

heapq.heappush(heap, 3)
smallest = heapq.heappop(heap)`,
      steps: [
        {
          label: "Heapify",
          state: "[4, 8, 6, 10]",
          note: "The root is the minimum. Sibling order and full sorted order are not guaranteed.",
        },
        {
          label: "Push 3",
          state: "[3, 4, 6, 10, 8]",
          note: "The new item bubbles up until its parent is no larger.",
        },
        {
          label: "Pop root",
          state: "pop 3, move last item to root",
          note: "The last item temporarily violates the invariant at the root.",
        },
        {
          label: "Sift down",
          state: "[4, 8, 6, 10]",
          note: "Swap down with the smaller child until the invariant is restored.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Need", "Best choice", "Why"],
      rows: [
        ["Repeated min/max", "heapq", "O(log n) update and pop, O(1) peek"],
        ["One-time full sort", "sorted", "O(n log n), simpler when all output must be sorted"],
        ["Small top-k from large stream", "bounded heap", "O(n log k) and O(k) memory"],
        [
          "Fast membership plus priority",
          "dict + heap",
          "Heap finds priority; dict tracks liveness or latest score",
        ],
        [
          "Sorted insert and range queries",
          "sortedcontainers or tree",
          "Heap cannot answer arbitrary range/order queries",
        ],
      ],
      notes: [
        "Do not iterate a heap expecting sorted order. Pop repeatedly or use sorted(heap).",
        "For max-heaps of numbers, push negative values. For records, push tuples like (priority, tie_breaker, item).",
        "When priorities change, push a new tuple and lazily skip stale entries on pop.",
        "Use heapq.nlargest or heapq.nsmallest for simple top-k; use a manual bounded heap when you need custom streaming behavior.",
      ],
    },
    drill: [
      {
        prompt: "You need the ten largest values from a billion-value stream. What heap shape?",
        answer:
          "Maintain a min-heap of size 10. The root is the current 10th largest; replace it only when a new value is larger.",
      },
      {
        prompt: "You need to merge 1000 already-sorted log files. What goes in the heap?",
        answer:
          "One current row per file, usually (timestamp, file_index, row). Pop the smallest row, then push the next row from that same file.",
      },
      {
        prompt: "Dijkstra with a binary heap beats array-scan Dijkstra in which graph shape?",
        answer:
          "Sparse graphs. Binary heap Dijkstra is O((V + E) log V); dense graphs can make the O(V^2) scan competitive or better.",
      },
      {
        prompt:
          "You need to delete arbitrary tasks from a priority queue by ID. Can heapq remove them in O(log n)?",
        answer:
          "Not directly. Track active task IDs in a dict or set, mark deletes there, and lazily skip stale heap entries when popped.",
      },
      {
        prompt: "You need sorted iteration and frequent range queries. Is heapq enough?",
        answer:
          "No. A heap only exposes the root. Use a sorted list/tree structure or database index for range-order queries.",
      },
    ],
    implement: {
      prompt:
        "Write k_smallest(numbers, k), returning the k smallest elements in sorted order. You may use heapq.",
      starterCode: `def k_smallest(numbers, k):
    pass`,
      tests: [
        "[3, 1, 4, 1, 5, 9, 2, 6], k=3 -> [1, 1, 2]",
        "[1, 2, 3, 4, 5], k=5 -> [1, 2, 3, 4, 5]",
        "[5, 4, 3, 2, 1], k=2 -> [1, 2]",
        "[1], k=1 -> [1]",
        "[], k=0 -> []",
      ],
      notes: [
        "heapq.nsmallest(k, numbers) is acceptable and clear.",
        "If implementing manually, heapify a copy before popping so you do not mutate the caller's list unexpectedly.",
        "Return sorted output; repeated heappop naturally produces ascending order from a min-heap.",
      ],
    },
    scale: [
      {
        scale: "1K elements",
        answer:
          "heapify plus k pops is simple and fast. Full sorting is also fine if k is close to n.",
      },
      {
        scale: "1M elements",
        answer:
          "For small k, use a bounded heap or heapq.nsmallest. Avoid sorting all data when you only need a tiny prefix.",
      },
      {
        scale: "1B elements",
        answer:
          "Stream partitions independently, keep local top-k heaps, then merge local candidates into a coordinator heap.",
      },
      {
        scale: "Distributed",
        answer:
          "Use tree reduction for exact top-k: each worker emits k candidates, reducers merge and trim. Approximate heavy hitters can use Count-Min Sketch plus heap candidates.",
      },
    ],
    patterns: {
      title: "Core heapq patterns",
      code: `import heapq
from itertools import count

# Min-heap
heap = []
heapq.heappush(heap, value)
value = heapq.heappop(heap)

# Max-heap for numbers
heapq.heappush(heap, -value)
value = -heapq.heappop(heap)

# Stable priority queue
counter = count()
heapq.heappush(heap, (priority, next(counter), item))

# Lazy deletion
active = {}
heapq.heappush(heap, (priority, task_id))
active[task_id] = priority
while heap:
    priority, task_id = heapq.heappop(heap)
    if active.get(task_id) == priority:
        break`,
    },
  },
};
