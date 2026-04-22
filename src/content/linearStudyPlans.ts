export type StudyStepKey = "brief" | "visualize" | "tradeoffs" | "drill" | "implement" | "scale";

export interface LinearStudyPlan {
  id: string;
  moduleLabel?: string;
  title: string;
  invariant: string;
  brief: {
    why: string[];
    costModel: string[];
    realWorld: string[];
  };
  visualize: {
    title: string;
    description: string;
    code: string;
    steps: Array<{
      label: string;
      state: string;
      note: string;
    }>;
  };
  tradeoffs: {
    columns: string[];
    rows: string[][];
    notes: string[];
  };
  drill: Array<{
    prompt: string;
    answer: string;
  }>;
  implement: {
    prompt: string;
    starterCode: string;
    tests: string[];
    notes: string[];
  };
  scale: Array<{
    scale: string;
    answer: string;
  }>;
  patterns: {
    title: string;
    code: string;
  };
}

export const linearStudyPlans: Record<string, LinearStudyPlan> = {
  arrays: {
    id: "arrays",
    title: "Arrays & Lists",
    invariant:
      "Index i is i slots from the start. Python lists keep random access fast by storing references in a contiguous backing array.",
    brief: {
      why: [
        "Use a Python list when you need ordered dense storage, direct indexing, appending at the end, sorting, binary search, or two-pointer scans.",
        "Most array interview problems are not about the container itself. They are about preserving a loop invariant over indexes: left/right bounds, a write pointer, a running window, or a partition boundary.",
        "The list is excellent when the shape is stable or grows at the right edge. It is the wrong structure when the hot operation mutates the front or middle.",
      ],
      costModel: [
        "arr[i] is O(1). Python can jump directly to the reference at offset i.",
        "append and pop at the right end are O(1) amortized. Occasional resize copies the backing array, but the average cost remains constant.",
        "insert(0, x), pop(0), and middle insert/delete are O(n), because later elements shift.",
        "arr[l:r] copies r - l elements. In a hot loop, this can silently turn a linear algorithm into a quadratic one.",
      ],
      realWorld: [
        "Columnar databases keep dense arrays because scans and vectorized operations love memory locality.",
        "Python uses array-backed stacks internally for many interpreter operations.",
        "Analytics pipelines often prefer compact arrays over pointer-heavy structures because cache behavior dominates.",
      ],
    },
    visualize: {
      title: "Front insert shifts the invariant",
      description:
        "Random access is cheap because every element has a stable offset. The cost appears when you need to create a hole before existing elements.",
      code: `arr = [10, 20, 30, 40]
arr.insert(0, 5)      # shifts 4 references
arr.append(50)        # writes at the right edge
third = arr[2]        # direct offset lookup
window = arr[1:4]     # copies 3 references`,
      steps: [
        {
          label: "Start",
          state: "[10, 20, 30, 40]",
          note: "Four references occupy contiguous slots.",
        },
        {
          label: "Open slot 0",
          state: "[_, 10, 20, 30, 40]",
          note: "Every existing reference shifts one position right.",
        },
        {
          label: "Write value",
          state: "[5, 10, 20, 30, 40]",
          note: "The write is cheap; the shift was the work.",
        },
        {
          label: "Append",
          state: "[5, 10, 20, 30, 40, 50]",
          note: "Right-edge growth usually touches only the new slot.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Operation", "list", "deque", "linked list"],
      rows: [
        ["Index lookup", "O(1)", "O(n)", "O(n)"],
        ["Append right", "Amortized O(1)", "O(1)", "O(1) with tail"],
        ["Pop right", "O(1)", "O(1)", "O(n) without previous pointer"],
        ["Insert/pop left", "O(n)", "O(1)", "O(1) with head"],
        ["Memory locality", "Excellent", "Good chunk locality", "Poor"],
      ],
      notes: [
        "Use list for dense order, random access, sorting, binary search, and two-pointer scans.",
        "Use deque for queues or windows that mutate at both ends.",
        "Build a set before repeated membership checks against the same list.",
        "Track indexes instead of slicing when the window is part of the invariant.",
      ],
    },
    drill: [
      {
        prompt:
          "You receive 100k events and remove them from the front in arrival order. Which container?",
        answer:
          "collections.deque. Repeated list.pop(0) shifts the remaining list every time, which becomes O(n^2) total work.",
      },
      {
        prompt:
          "You need random access into a leaderboard snapshot by rank, and updates are rare. Which structure?",
        answer:
          "A list. Random access is O(1), memory locality is good, and rare rebuilds are acceptable.",
      },
      {
        prompt:
          "You test whether each of 1M incoming IDs appears in a 50k-element allowlist. What changes first?",
        answer:
          "Convert the allowlist to a set once. Scanning the list per event is O(50k); set lookup is O(1) amortized.",
      },
      {
        prompt:
          "You need every contiguous subarray sum of length k. Should you slice each window and call sum?",
        answer:
          "No. Maintain a rolling sum. Slicing plus sum is O(k) per window; the rolling invariant is O(1) per step.",
      },
    ],
    implement: {
      prompt:
        "Write max_window_sum(nums, k), returning the maximum sum of any contiguous window of size k.",
      starterCode: `def max_window_sum(nums, k):
    # assume 1 <= k <= len(nums)
    pass`,
      tests: [
        "nums=[1, 3, -1, 5, 2], k=3 -> 7",
        "nums=[5, 4, 3], k=1 -> 5",
        "nums=[2, 2, 2], k=3 -> 6",
        "nums=[-5, -2, -7], k=2 -> -7",
      ],
      notes: [
        "Initialize with sum(nums[:k]).",
        "For each next index i, add nums[i] and subtract nums[i - k].",
        "Initialize best to the first window, not 0, so all-negative inputs work.",
      ],
    },
    scale: [
      {
        scale: "1K elements",
        answer: "Any clear O(n) list solution is fine. Focus on a correct invariant.",
      },
      {
        scale: "1M elements",
        answer:
          "One pass and O(1) extra state matter. Avoid repeated slices, front pops, and nested membership scans.",
      },
      {
        scale: "1B elements",
        answer:
          "The data may not fit in one process. Stream chunks and carry boundary state, such as the last k - 1 values.",
      },
      {
        scale: "Distributed",
        answer:
          "Partition by index ranges. Workers emit local answers plus prefix/suffix summaries; reducers combine cross-boundary cases.",
      },
    ],
    patterns: {
      title: "Core list patterns",
      code: `# Rolling window
current = sum(nums[:k])
best = current
for i in range(k, len(nums)):
    current += nums[i] - nums[i - k]
    best = max(best, current)

# Two pointers
left = 0
for right, value in enumerate(nums):
    while violates_invariant(left, right):
        left += 1`,
    },
  },
  strings: {
    id: "strings",
    title: "Strings",
    invariant:
      "A Python string is immutable. Every operation that appears to edit it creates a new string.",
    brief: {
      why: [
        "Use strings for textual sequences where order and exact characters matter: parsing, matching, normalization, tokenization, and encoding boundaries.",
        "String problems reuse array techniques, but the mutation model changes the cost. You scan with indexes and build output separately.",
        "The best string solution usually names the preserved state: current window counts, prefix match length, parser mode, or output run.",
      ],
      costModel: [
        "s[i] and len(s) are O(1).",
        "s[l:r] allocates a new string of length r - l.",
        "s += part inside a loop can become O(n^2), because every append copies the old content.",
        "Use a list of pieces plus ''.join(parts) for incremental construction.",
      ],
      realWorld: [
        "Text editors avoid recopying whole documents by using gap buffers, ropes, or piece tables.",
        "Search engines avoid repeated full scans by building inverted indexes and prefix structures.",
        "Log pipelines stream lines and tokens so they do not load unbounded text into memory.",
      ],
    },
    visualize: {
      title: "Repeated concatenation recopies history",
      description:
        "Each new string must contain all previous characters. The output is correct, but the construction cost accumulates.",
      code: `parts = []
for ch in chars:
    parts.append(ch)       # amortized O(1)
result = "".join(parts)    # one O(n) pass`,
      steps: [
        { label: "Add a", state: "'a'", note: "One character is copied." },
        { label: "Add b", state: "'ab'", note: "The old 'a' is copied again, then 'b'." },
        { label: "Add c", state: "'abc'", note: "The old prefix is copied again." },
        {
          label: "Join pieces",
          state: "['a', 'b', 'c'] -> 'abc'",
          note: "Pieces are copied once into the final string.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Task", "Good choice", "Avoid"],
      rows: [
        ["Incremental construction", "list append + join", "s += part in a loop"],
        ["Character counts", "Counter or dict", "Nested scans"],
        ["Sliding substring", "Indexes plus counts", "Storing every substring"],
        ["Prefix matching", "KMP, trie, or sorted range", "Checking every candidate every time"],
        ["Structured text", "Parser or csv/json module", "Ad hoc chained replace calls"],
      ],
      notes: [
        "len(s) counts code points, not displayed glyphs.",
        "casefold is usually better than lower for case-insensitive Unicode matching.",
        "When processing files, prefer streaming lines or chunks over loading the whole file.",
        "For ASCII-only fixed alphabets, arrays of counts are faster; for general text, dicts are clearer.",
      ],
    },
    drill: [
      {
        prompt: "You build a CSV line from 10k fields. What is the safe pattern?",
        answer:
          "Use csv.writer or collect escaped fields and join once. Repeated string concatenation copies too much.",
      },
      {
        prompt:
          "You need the longest substring without repeating characters. Should you store every substring?",
        answer:
          "No. Use a sliding window and a map from character to last seen index. Substring storage creates copies.",
      },
      {
        prompt: "You search a 2GB log file for a pattern. What should change?",
        answer:
          "Stream the file and keep matcher state. Loading or slicing the entire file is the bottleneck.",
      },
      {
        prompt: "You compare usernames case-insensitively across languages. Is lower enough?",
        answer:
          "Usually no. casefold handles more Unicode case mappings, then apply product-specific normalization.",
      },
    ],
    implement: {
      prompt:
        "Write compress_runs(s). Consecutive equal characters become the character followed by the count. Return the compressed string only if shorter.",
      starterCode: `def compress_runs(s):
    pass`,
      tests: [
        "'aaabbc' -> 'a3b2c1'",
        "'abc' -> 'abc'",
        "'' -> ''",
        "'aaaaaaaaaaa' -> 'a11'",
        "'aabcccccaaa' -> 'a2b1c5a3'",
      ],
      notes: [
        "Track current character and count.",
        "Append each completed run into a list.",
        "Join once, then compare compressed length to original length.",
      ],
    },
    scale: [
      { scale: "1K characters", answer: "Clear list-building code is enough." },
      {
        scale: "1M characters",
        answer: "Avoid substring-heavy logic. Keep indexes, counters, and one output list.",
      },
      {
        scale: "1B characters",
        answer:
          "Stream chunks. Carry boundary state, such as previous character and current run length.",
      },
      {
        scale: "Distributed",
        answer:
          "Split on safe encoding boundaries. Reducers merge adjacent runs or parser states across partitions.",
      },
    ],
    patterns: {
      title: "Core string patterns",
      code: `# Build output safely
parts = []
for token in tokens:
    parts.append(transform(token))
result = "".join(parts)

# Sliding window over characters
left = 0
last = {}
for right, ch in enumerate(s):
    if ch in last and last[ch] >= left:
        left = last[ch] + 1
    last[ch] = right`,
    },
  },
  "linked-lists": {
    id: "linked-lists",
    title: "Linked Lists",
    invariant:
      "Order is represented by pointers. To reach a node, you follow links from a known node.",
    brief: {
      why: [
        "Use a linked list when you already have a pointer to the edit location and need O(1) insertion or deletion there.",
        "Do not choose it for random access. In Python, a hand-built linked list is usually for interviews or for teaching pointer invariants.",
        "Most linked-list bugs happen because code rewires cur.next before preserving the original next node.",
      ],
      costModel: [
        "Access by index is O(n).",
        "Insert after a known node is O(1).",
        "Delete a known node is O(1) if you also have the previous pointer, or if it is a doubly linked list.",
        "Each Python node is an object, so memory overhead and cache behavior are much worse than a list.",
      ],
      realWorld: [
        "LRU caches combine a dict with a doubly linked list for O(1) lookup, move-to-front, and eviction.",
        "Memory allocators often keep free lists.",
        "Operating systems use linked queues where stable node references matter.",
      ],
    },
    visualize: {
      title: "Reverse by preserving next before rewiring",
      description:
        "The loop invariant is that prev is the reversed prefix and cur is the first node not yet reversed.",
      code: `prev = None
cur = head
while cur:
    nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt
return prev`,
      steps: [
        {
          label: "Start",
          state: "prev=None, cur=1, list=1 -> 2 -> 3",
          note: "Nothing has been reversed yet.",
        },
        {
          label: "Save next",
          state: "nxt=2",
          note: "Preserve the rest of the list before changing cur.next.",
        },
        {
          label: "Rewire 1",
          state: "1 -> None, cur=2",
          note: "The reversed prefix now has one node.",
        },
        {
          label: "Rewire 2",
          state: "2 -> 1 -> None, cur=3",
          note: "The prefix grows one node at a time.",
        },
        { label: "Done", state: "3 -> 2 -> 1 -> None", note: "prev is the new head." },
      ],
    },
    tradeoffs: {
      columns: ["Need", "Linked list", "list", "deque"],
      rows: [
        ["Random index access", "O(n)", "O(1)", "O(n)"],
        ["Insert after known node", "O(1)", "O(n)", "Not exposed"],
        ["Delete with previous pointer", "O(1)", "O(n)", "Not exposed"],
        ["Memory locality", "Poor", "Excellent", "Good chunks"],
        ["Production Python default", "Rare", "Common", "Common for queues"],
      ],
      notes: [
        "Use a dummy head for deletion and merge problems.",
        "Use slow and fast pointers for midpoint and cycle detection.",
        "Prefer iterative algorithms over recursion for long lists in Python.",
        "Use OrderedDict or dict plus linked list for LRU behavior.",
      ],
    },
    drill: [
      {
        prompt: "You repeatedly access the 500th item. Is a linked list a good fit?",
        answer: "No. That access is O(n) each time. Use a list if indexing matters.",
      },
      {
        prompt:
          "You are given a pointer to a node and need to insert immediately after it. Which structure wins?",
        answer: "A linked list. The operation rewires two pointers and is O(1).",
      },
      {
        prompt: "How do you detect a cycle without extra memory?",
        answer: "Use Floyd's slow and fast pointers. In a cycle, fast eventually meets slow.",
      },
      {
        prompt: "You need an LRU cache with O(1) get and put. What structures combine?",
        answer:
          "A dict maps keys to nodes; a doubly linked list keeps recency order for move-to-front and eviction.",
      },
    ],
    implement: {
      prompt:
        "Write has_cycle(head) for nodes with a .next attribute. Return True if the list contains a cycle.",
      starterCode: `def has_cycle(head):
    pass`,
      tests: [
        "empty list -> False",
        "1 -> 2 -> 3 -> None -> False",
        "1 -> 2 -> 3, with 3.next pointing to 2 -> True",
        "single node pointing to itself -> True",
      ],
      notes: [
        "Initialize slow and fast to head.",
        "Advance slow by one and fast by two.",
        "If they meet, there is a cycle. If fast reaches None, there is no cycle.",
      ],
    },
    scale: [
      { scale: "1K nodes", answer: "Pointer algorithms are fine. Draw references before coding." },
      {
        scale: "1M nodes",
        answer: "Avoid recursion. Python recursion limits and object overhead become visible.",
      },
      {
        scale: "1B nodes",
        answer:
          "A Python object per node is too expensive. Store arrays of values and next indexes or use a lower-level representation.",
      },
      {
        scale: "Distributed",
        answer:
          "Linked lists are usually a poor distributed shape because every hop is a remote dependency. Prefer chunked arrays, logs, or trees.",
      },
    ],
    patterns: {
      title: "Core linked-list patterns",
      code: `# Dummy head deletion
dummy = Node(0, head)
prev = dummy
cur = head
while cur:
    if should_delete(cur):
        prev.next = cur.next
    else:
        prev = cur
    cur = cur.next
head = dummy.next

# Slow and fast pointers
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next`,
    },
  },
  "stacks-queues": {
    id: "stacks-queues",
    title: "Stacks & Queues",
    invariant: "A stack returns the newest item first. A queue returns the oldest item first.",
    brief: {
      why: [
        "Use a stack when the most recent unfinished item should resume next: DFS, parsing brackets, undo, backtracking, monotonic stack problems.",
        "Use a queue when arrival order or increasing distance order matters: BFS, task dispatch, producer-consumer pipelines, and rate-limited work.",
        "The container choice is a proof. A BFS queue proves increasing hop count. A parser stack proves the next close token matches the most recent open token.",
      ],
      costModel: [
        "Python list is a good stack: append and pop from the right end are O(1).",
        "collections.deque is the standard queue: append and popleft are O(1).",
        "list.pop(0) is O(n), because all remaining elements shift left.",
        "queue.Queue adds locks and blocking behavior for threads; it is not needed for single-threaded algorithms.",
      ],
      realWorld: [
        "Compilers use stacks for parsing and evaluation.",
        "Graph systems use queues for breadth-first traversal and frontier expansion.",
        "Distributed job systems add durability, acknowledgement, retry, and dead-letter behavior on top of queue semantics.",
      ],
    },
    visualize: {
      title: "BFS queue preserves increasing distance",
      description:
        "Nodes are popped in the order they are discovered, so all distance d nodes leave the queue before distance d + 1 nodes.",
      code: `from collections import deque

q = deque(["A"])
seen = {"A"}
while q:
    node = q.popleft()
    for nxt in graph[node]:
        if nxt not in seen:
            seen.add(nxt)
            q.append(nxt)`,
      steps: [
        { label: "Seed", state: "queue=[A], seen={A}", note: "The source is distance 0." },
        {
          label: "Pop A",
          state: "queue=[B, C], seen={A, B, C}",
          note: "Neighbors are distance 1.",
        },
        {
          label: "Pop B",
          state: "queue=[C, D]",
          note: "D is discovered after all earlier distance 1 work.",
        },
        { label: "Pop C", state: "queue=[D]", note: "Already-seen nodes are skipped." },
        { label: "Pop D", state: "queue=[]", note: "Traversal is complete." },
      ],
    },
    tradeoffs: {
      columns: ["Pattern", "Best Python structure", "Reason"],
      rows: [
        ["Stack", "list", "append/pop right are O(1) and compact"],
        ["FIFO queue", "deque", "append/popleft are O(1)"],
        ["Fixed recent window", "deque(maxlen=k)", "Automatic left eviction"],
        ["Thread-safe queue", "queue.Queue", "Locks and blocking operations"],
        ["Priority work", "heapq", "FIFO is the wrong invariant"],
      ],
      notes: [
        "Mark BFS nodes as seen when enqueuing, not when popping, to avoid duplicate queue entries.",
        "A monotonic stack or deque stores candidates, not every historical element.",
        "Use list for stack unless you also need left-end operations.",
        "Use heapq when priority beats arrival order.",
      ],
    },
    drill: [
      {
        prompt: "You need the shortest number of moves in an unweighted maze. Stack or queue?",
        answer:
          "Queue. BFS explores by increasing distance, so the first time you reach the goal is shortest.",
      },
      {
        prompt: "You validate nested brackets like {[()]}. Stack or queue?",
        answer:
          "Stack. The next closing bracket must match the most recent unmatched opening bracket.",
      },
      {
        prompt: "You need the maximum value in every sliding window. Which pattern?",
        answer:
          "A monotonic deque. It keeps candidate indexes in decreasing value order and evicts indexes that leave the window.",
      },
      {
        prompt: "Tasks have priorities and arrive continuously. Is FIFO enough?",
        answer:
          "No. Use a priority queue, usually heapq, because oldest-first is not the required invariant.",
      },
    ],
    implement: {
      prompt:
        "Write is_valid_brackets(s) for (), [], and {}. Any non-bracket character should make the string invalid.",
      starterCode: `def is_valid_brackets(s):
    pass`,
      tests: [
        "'()[]{}' -> True",
        "'([{}])' -> True",
        "'(]' -> False",
        "'([)]' -> False",
        "'(' -> False",
        "'abc' -> False",
      ],
      notes: [
        "Push opening brackets.",
        "On a closing bracket, the stack must be non-empty and match the expected opener.",
        "At the end, the stack must be empty.",
      ],
    },
    scale: [
      { scale: "1K items", answer: "A list stack or deque queue is straightforward." },
      {
        scale: "1M items",
        answer: "Watch memory. For BFS, mark seen on enqueue to prevent duplicate queue growth.",
      },
      {
        scale: "1B items",
        answer:
          "Use streaming, disk-backed queues, or external systems. Do not assume memory holds the whole frontier.",
      },
      {
        scale: "Distributed",
        answer:
          "Use Kafka, SQS, Redis Streams, or a durable queue. Add acknowledgement, retries, dead-letter queues, and idempotent workers.",
      },
    ],
    patterns: {
      title: "Core stack and queue patterns",
      code: `from collections import deque

# Stack
stack = []
stack.append(item)
item = stack.pop()

# Queue
q = deque()
q.append(item)
item = q.popleft()

# Monotonic decreasing deque of indexes
dq = deque()
for i, x in enumerate(nums):
    while dq and nums[dq[-1]] <= x:
        dq.pop()
    dq.append(i)`,
    },
  },
};
