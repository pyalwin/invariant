import type { LinearStudyPlan } from "@/content/linearStudyPlans";

export const treesStudyPlans: Record<string, LinearStudyPlan> = {
  "trees-binary": {
    id: "trees-binary",
    moduleLabel: "Trees",
    title: "Binary Trees",
    invariant:
      "Each node has at most two children. There is no ordering guarantee unless a stronger tree type adds one.",
    brief: {
      why: [
        "Reach for binary tree thinking when the problem is naturally recursive: subtrees, ancestry, depth, paths, lowest common ancestor, or divide-and-combine traversal.",
        "The core move is to define what each node returns to its parent. Many hard-looking tree problems become one postorder return value plus one global best.",
        "A binary tree is not automatically searchable. Without an ordering invariant, finding a value is still O(n).",
      ],
      costModel: [
        "Traversal is O(n) time because every node may need to be visited.",
        "Recursive DFS uses O(h) call stack space, where h is tree height. A skewed tree has h = n.",
        "BFS uses O(w) queue space, where w is the maximum level width.",
        "Python recursion can hit the recursion limit on deep trees. Use an explicit stack for untrusted or very deep inputs.",
      ],
      realWorld: [
        "Parsers build syntax trees so compilers and interpreters can analyze nested structure.",
        "Decision trees represent branching rules in ML and workflow systems.",
        "Filesystem and UI hierarchies are general trees; binary-tree techniques still teach traversal and aggregation.",
      ],
    },
    visualize: {
      title: "Postorder returns information upward",
      description:
        "Postorder visits children before the node, which is exactly what you need when a node's answer depends on subtree answers.",
      code: `def height(root):
    if root is None:
        return 0
    left = height(root.left)
    right = height(root.right)
    return 1 + max(left, right)`,
      steps: [
        {
          label: "Reach leaf",
          state: "height(None) -> 0",
          note: "The base case defines what an empty subtree contributes.",
        },
        {
          label: "Return leaf height",
          state: "leaf -> 1",
          note: "Both children returned 0, so the leaf contributes 1.",
        },
        {
          label: "Combine child answers",
          state: "node -> 1 + max(left, right)",
          note: "The parent does not inspect all descendants directly; it trusts subtree summaries.",
        },
        {
          label: "Root answer",
          state: "root height computed from children",
          note: "The same local rule composes across the whole tree.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Traversal", "Use when", "Space"],
      rows: [
        ["Preorder", "Node action before children, serialization, cloning", "O(h)"],
        ["Inorder", "Binary expression trees or BST sorted order", "O(h)"],
        ["Postorder", "Subtree aggregation, deletion, height, diameter", "O(h)"],
        ["BFS", "Level order, shortest edge depth, width", "O(w)"],
        ["Iterative DFS", "Deep trees or recursion limits", "O(h)"],
      ],
      notes: [
        "Always ask whether the tree has an ordering invariant. A plain binary tree does not.",
        "Name the recursive contract before coding: what does this function return for this subtree?",
        "For path problems, distinguish values returned upward from best answers updated globally.",
        "For deep inputs, avoid recursive Python unless the depth is known to be small.",
      ],
    },
    drill: [
      {
        prompt: "You need the maximum depth of a binary tree. Which traversal shape?",
        answer:
          "Postorder DFS. Each node returns 1 + max(left height, right height) to its parent.",
      },
      {
        prompt: "You need nodes by level from top to bottom. DFS or BFS?",
        answer: "BFS with a queue, because the queue naturally processes nodes in level order.",
      },
      {
        prompt:
          "You need to know if a plain binary tree contains value x. Can you binary search it?",
        answer: "No. Without a BST ordering invariant, you may need to scan every node.",
      },
      {
        prompt: "You need the diameter of a tree. What should each recursive call return?",
        answer:
          "Return height upward, while updating a separate best diameter using left height + right height at each node.",
      },
    ],
    implement: {
      prompt:
        "Write max_depth(root) for nodes with .left and .right attributes. Return 0 for an empty tree.",
      starterCode: `def max_depth(root):
    pass`,
      tests: [
        "empty tree -> 0",
        "single node -> 1",
        "root with two leaf children -> 2",
        "skewed chain of four nodes -> 4",
      ],
      notes: [
        "Use the empty subtree as the base case.",
        "The recursive contract returns the height of the subtree rooted at root.",
        "For production code with deep trees, translate the DFS to an explicit stack.",
      ],
    },
    scale: [
      {
        scale: "1K nodes",
        answer:
          "Recursive traversal is fine if the tree is balanced or depth is known to be small.",
      },
      {
        scale: "1M nodes",
        answer:
          "Use iterative traversal to avoid recursion limits. Memory depends on height for DFS and width for BFS.",
      },
      {
        scale: "1B nodes",
        answer:
          "The tree will be persisted or sharded. Traverse streams of node records and push aggregation close to storage.",
      },
      {
        scale: "Distributed",
        answer:
          "Partition by subtrees when possible. Compute subtree summaries locally, then reduce summaries at ancestors.",
      },
    ],
    patterns: {
      title: "Core binary tree patterns",
      code: `# Recursive DFS contract
def dfs(node):
    if node is None:
        return base_value
    left = dfs(node.left)
    right = dfs(node.right)
    return combine(node, left, right)

# Level order
from collections import deque
q = deque([root] if root else [])
while q:
    node = q.popleft()
    if node.left:
        q.append(node.left)
    if node.right:
        q.append(node.right)`,
    },
  },
  "trees-bst": {
    id: "trees-bst",
    moduleLabel: "Trees",
    title: "BST",
    invariant:
      "Every node is greater than all values in its left subtree and less than or equal to all values in its right subtree.",
    brief: {
      why: [
        "Reach for a BST when you need ordered lookup, predecessor/successor queries, or sorted traversal with dynamic inserts and deletes.",
        "The invariant is global, not just parent-child. Every node must fit within the min/max bounds inherited from all ancestors.",
        "Plain Python does not ship a balanced BST. For production, you usually use bisect over sorted arrays, a database index, or a third-party sorted container.",
      ],
      costModel: [
        "Search, insert, and delete are O(h), where h is tree height.",
        "Balanced BSTs keep h = O(log n). Skewed BSTs degrade to O(n).",
        "Inorder traversal of a valid BST yields sorted values in O(n).",
        "Python recursion risks remain on skewed trees; iterative bounds checks are often safer.",
      ],
      realWorld: [
        "Database B-trees generalize the ordered-search-tree idea to disk pages.",
        "In-memory indexes often use balanced trees for ordered scans and range queries.",
        "Compilers and runtimes use ordered maps when deterministic sorted iteration matters.",
      ],
    },
    visualize: {
      title: "Ancestor bounds validate the tree",
      description:
        "Checking only node.left < node < node.right misses deeper violations. Carry lower and upper bounds down the recursion.",
      code: `def is_valid_bst(node, low=float("-inf"), high=float("inf")):
    if node is None:
        return True
    if not (low < node.val <= high):
        return False
    return (
        is_valid_bst(node.left, low, node.val)
        and is_valid_bst(node.right, node.val, high)
    )`,
      steps: [
        {
          label: "Root",
          state: "(-inf, inf)",
          note: "The root can be any value within the initial bounds.",
        },
        {
          label: "Left child",
          state: "(-inf, root.val)",
          note: "Everything in the left subtree must stay below the root.",
        },
        {
          label: "Right child",
          state: "(root.val, inf)",
          note: "Everything in the right subtree must stay above the root.",
        },
        {
          label: "Deep node",
          state: "(ancestor low, ancestor high)",
          note: "A node must satisfy every ancestor constraint, not just its parent.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Structure", "Strength", "Weakness"],
      rows: [
        ["Unbalanced BST", "Simple ordered search", "Can degrade to O(n)"],
        ["Balanced BST", "O(log n) dynamic order ops", "More complex rotations/rebalancing"],
        ["Sorted list + bisect", "Compact and fast reads", "Middle insert/delete are O(n)"],
        ["Hash table", "O(1) average lookup", "No sorted order or range scan"],
        ["B-tree", "Disk/cache efficient range index", "Higher implementation complexity"],
      ],
      notes: [
        "Use inorder when you need sorted output.",
        "Use ancestor bounds when validating a BST.",
        "For kth-smallest, inorder traversal can stop after k nodes.",
        "If inserts are rare and reads dominate, a sorted list with bisect may beat a tree in Python.",
      ],
    },
    drill: [
      {
        prompt: "You need all values between L and R in sorted order. What does the BST buy you?",
        answer:
          "You can prune subtrees outside the range and inorder-traverse the rest, often much less than O(n).",
      },
      {
        prompt:
          "A tree has every node.left < node < node.right. Is that enough to prove it is a BST?",
        answer:
          "No. A deeper descendant can violate an ancestor bound. Validate with low/high bounds.",
      },
      {
        prompt: "You insert sorted values into a naive BST. What happens?",
        answer: "It becomes a linked-list-shaped tree, so search and insert degrade to O(n).",
      },
      {
        prompt: "You need exact key lookup only, with no order queries. BST or dict?",
        answer: "Use a dict. The BST's ordering is unnecessary, and dict lookup is O(1) amortized.",
      },
    ],
    implement: {
      prompt:
        "Write is_valid_bst(root) for nodes with .val, .left, and .right. Use the invariant left < node <= right.",
      starterCode: `def is_valid_bst(root):
    pass`,
      tests: [
        "empty tree -> True",
        "2 with children 1 and 3 -> True",
        "5 with left child 1 and right subtree 4,3,6 -> False",
        "2 with left child 2 -> False",
        "2 with right child 2 -> True",
      ],
      notes: [
        "Carry low and high bounds, not just parent comparisons.",
        "The left subtree upper bound is node.val.",
        "The right subtree lower bound is node.val because duplicates are allowed on the right.",
      ],
    },
    scale: [
      {
        scale: "1K nodes",
        answer: "Recursive validation or traversal is fine.",
      },
      {
        scale: "1M nodes",
        answer:
          "Use iterative traversal for skewed inputs. If the tree is mutable, require a balanced structure.",
      },
      {
        scale: "1B keys",
        answer:
          "Use B-trees or LSM-style storage indexes. Pointer-heavy in-memory BSTs are the wrong representation.",
      },
      {
        scale: "Distributed",
        answer:
          "Shard by key range for ordered scans, or by hash for lookup-only workloads. Range sharding preserves ordered queries.",
      },
    ],
    patterns: {
      title: "Core BST patterns",
      code: `# Validate with bounds
def valid(node, low, high):
    if node is None:
        return True
    if not (low < node.val <= high):
        return False
    return valid(node.left, low, node.val) and valid(node.right, node.val, high)

# Inorder traversal
def inorder(node):
    if node:
        yield from inorder(node.left)
        yield node.val
        yield from inorder(node.right)`,
    },
  },
  "trees-segment": {
    id: "trees-segment",
    moduleLabel: "Trees",
    title: "Segment Trees",
    invariant:
      "Each node stores an aggregate for a contiguous segment, and parent aggregates are computed from child aggregates.",
    brief: {
      why: [
        "Reach for a segment tree when you need repeated range queries and point or range updates over an array.",
        "The aggregate must be associative: sum, min, max, gcd, bitwise operations, or a custom combine that can be merged from two child segments.",
        "The key advantage is decomposing any query range into O(log n) canonical tree segments.",
      ],
      costModel: [
        "Build is O(n).",
        "Range query is O(log n) for standard associative aggregates.",
        "Point update is O(log n).",
        "A flat iterative implementation usually uses about 2n slots and avoids recursion overhead.",
      ],
      realWorld: [
        "Monitoring systems use tree-like rollups for range aggregates over time buckets.",
        "Databases and analytics engines store precomputed aggregates to answer range queries quickly.",
        "Game and geometry systems use segment/range trees for interval-style queries.",
      ],
    },
    visualize: {
      title: "Range queries split into canonical segments",
      description:
        "A query does not scan every element. It selects precomputed nodes whose segments exactly cover the requested range.",
      code: `# Iterative segment tree for sums
n = len(nums)
tree = [0] * (2 * n)
tree[n:] = nums
for i in range(n - 1, 0, -1):
    tree[i] = tree[2 * i] + tree[2 * i + 1]`,
      steps: [
        {
          label: "Leaves",
          state: "tree[n:2n] = nums",
          note: "Each leaf represents one array element.",
        },
        {
          label: "Parents",
          state: "tree[i] = left + right",
          note: "Every internal node stores the aggregate of its two children.",
        },
        {
          label: "Query",
          state: "cover [l, r) with disjoint nodes",
          note: "Move l and r upward, taking segments when they are right/left boundaries.",
        },
        {
          label: "Update",
          state: "change leaf, rebuild ancestors",
          note: "Only one root-to-leaf path changes.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Query", "Update"],
      rows: [
        ["Prefix sums", "O(1) range sum", "O(n) update"],
        ["Segment tree", "O(log n)", "O(log n)"],
        ["Fenwick tree", "O(log n) prefix/range sum", "O(log n), less general"],
        ["Sparse table", "O(1) idempotent queries", "Static only"],
        ["Naive scan", "O(n)", "O(1) point update"],
      ],
      notes: [
        "Use prefix sums for static range sums.",
        "Use Fenwick trees when the operation is prefix-friendly and you want simpler code.",
        "Use segment trees when you need min/max/gcd/custom aggregates or range-update variants.",
        "Lazy propagation is the extension for range updates plus range queries.",
      ],
    },
    drill: [
      {
        prompt: "You need many range sum queries and no updates. Segment tree or prefix sum?",
        answer: "Prefix sum. Static range sums are O(1) with much simpler code.",
      },
      {
        prompt: "You need range minimum queries with point updates. What structure?",
        answer: "Segment tree. Min is associative, and updates can rebuild one path in O(log n).",
      },
      {
        prompt: "You need to add x to every value in [l, r] and query range sums. What extension?",
        answer:
          "Lazy propagation. Store deferred updates at internal nodes instead of pushing changes to every leaf immediately.",
      },
      {
        prompt: "Why does the combine operation need to be associative?",
        answer:
          "Queries merge disjoint segments in different groupings. Associativity makes the merged result independent of grouping.",
      },
    ],
    implement: {
      prompt:
        "Write a SegmentTreeSum class with sum_range(left, right) over a half-open interval [left, right).",
      starterCode: `class SegmentTreeSum:
    def __init__(self, nums):
        pass

    def sum_range(self, left, right):
        pass`,
      tests: [
        "nums=[1, 3, 5], sum_range(0, 3) -> 9",
        "nums=[1, 3, 5], sum_range(1, 3) -> 8",
        "nums=[2, -1, 4, 7], sum_range(0, 2) -> 1",
        "nums=[2, -1, 4, 7], sum_range(2, 2) -> 0",
      ],
      notes: [
        "Store leaves at indexes n through 2n - 1.",
        "Build parents from n - 1 down to 1.",
        "For [l, r), shift both by n and move upward while l < r.",
      ],
    },
    scale: [
      {
        scale: "1K elements",
        answer: "A segment tree is fine, though prefix sums may be simpler for static data.",
      },
      {
        scale: "1M elements",
        answer:
          "Use an iterative flat-array tree to reduce Python recursion overhead and object allocation.",
      },
      {
        scale: "1B elements",
        answer:
          "Use chunked trees: local segment trees per shard plus a higher-level tree over shard aggregates.",
      },
      {
        scale: "Distributed",
        answer:
          "Push range fragments to owning shards, combine shard aggregates, and keep updates idempotent or versioned.",
      },
    ],
    patterns: {
      title: "Core segment tree pattern",
      code: `class SegmentTreeSum:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (2 * self.n)
        self.tree[self.n:] = nums
        for i in range(self.n - 1, 0, -1):
            self.tree[i] = self.tree[2*i] + self.tree[2*i + 1]

    def sum_range(self, left, right):
        left += self.n
        right += self.n
        total = 0
        while left < right:
            if left % 2:
                total += self.tree[left]
                left += 1
            if right % 2:
                right -= 1
                total += self.tree[right]
            left //= 2
            right //= 2
        return total`,
    },
  },
  "trees-fenwick": {
    id: "trees-fenwick",
    moduleLabel: "Trees",
    title: "Fenwick Trees",
    invariant:
      "Index i stores the aggregate for the range ending at i whose length is the value of i's lowest set bit.",
    brief: {
      why: [
        "Reach for a Fenwick tree when you need prefix sums or frequency prefix counts with point updates.",
        "It is less general than a segment tree, but smaller and easier once the bit trick clicks.",
        "Common uses include dynamic prefix sums, inversion counts, order statistics over compressed coordinates, and cumulative frequencies.",
      ],
      costModel: [
        "Point update is O(log n).",
        "Prefix query is O(log n).",
        "Range sum [l, r] is prefix(r) - prefix(l - 1).",
        "The implementation is 1-indexed; zero-indexed wrappers should convert carefully.",
      ],
      realWorld: [
        "Frequency tables use Fenwick trees to maintain cumulative counts under updates.",
        "Competitive ranking systems use compressed coordinates plus Fenwick trees for order statistics.",
        "Analytics workloads use the same prefix-aggregate idea for incremental counters.",
      ],
    },
    visualize: {
      title: "The lowest set bit chooses the covered range",
      description:
        "Updating one element touches the Fenwick nodes whose stored ranges include that element. Querying a prefix jumps backward through disjoint ranges.",
      code: `def add(i, delta):
    while i <= n:
        bit[i] += delta
        i += i & -i

def prefix_sum(i):
    total = 0
    while i > 0:
        total += bit[i]
        i -= i & -i
    return total`,
      steps: [
        {
          label: "Update index i",
          state: "i += i & -i",
          note: "Move to the next stored range that includes the updated point.",
        },
        {
          label: "Query prefix i",
          state: "i -= i & -i",
          note: "Collect disjoint ranges that exactly cover [1, i].",
        },
        {
          label: "Range sum",
          state: "prefix(r) - prefix(l - 1)",
          note: "Fenwick trees are naturally prefix structures.",
        },
        {
          label: "Coordinate compression",
          state: "value -> rank",
          note: "Use ranks when values are large but the number of distinct values is manageable.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Structure", "Best for", "Limit"],
      rows: [
        ["Prefix array", "Static prefix sums", "Updates cost O(n)"],
        ["Fenwick tree", "Dynamic prefix sums/counts", "Less general combine operations"],
        ["Segment tree", "General range queries", "More code and memory"],
        ["Sorted list", "Order with inserts", "Can be O(n) without specialized library"],
        ["Hash map counts", "Exact frequencies by key", "No prefix/rank query"],
      ],
      notes: [
        "Fenwick tree code is simplest when stored 1-indexed.",
        "Use coordinate compression for inversion count and rank queries.",
        "Fenwick trees work naturally for invertible prefix aggregates such as sums.",
        "If you need range min with arbitrary updates, use a segment tree instead.",
      ],
    },
    drill: [
      {
        prompt: "You need dynamic range sums with point updates. Fenwick or prefix array?",
        answer:
          "Fenwick tree. Prefix arrays answer queries fast but require O(n) work per point update.",
      },
      {
        prompt: "You need dynamic range minimum. Fenwick tree or segment tree?",
        answer:
          "Segment tree. Fenwick trees are not a clean fit for arbitrary range min with updates.",
      },
      {
        prompt: "You need to count inversions in an array of large integers. What extra step?",
        answer: "Coordinate-compress values to ranks, then use a Fenwick tree of counts.",
      },
      {
        prompt: "Why is Fenwick code usually 1-indexed?",
        answer:
          "The i & -i lowest-set-bit jump relies on positive indexes; index 0 would never advance.",
      },
    ],
    implement: {
      prompt:
        "Write a Fenwick class with add(index, delta) and prefix_sum(index). Use external 0-based indexes.",
      starterCode: `class Fenwick:
    def __init__(self, size):
        pass

    def add(self, index, delta):
        pass

    def prefix_sum(self, index):
        pass`,
      tests: [
        "size=5, add(0, 2), prefix_sum(0) -> 2",
        "add(3, 5), prefix_sum(3) -> 7",
        "add(1, -1), prefix_sum(1) -> 1",
        "prefix_sum(4) -> 6",
      ],
      notes: [
        "Convert index to index + 1 internally.",
        "Update while i <= n; query while i > 0.",
        "For range_sum(l, r), use prefix_sum(r) - prefix_sum(l - 1).",
      ],
    },
    scale: [
      {
        scale: "1K elements",
        answer: "Fenwick is compact and fast, but prefix sums may be enough for static data.",
      },
      {
        scale: "1M elements",
        answer:
          "A list-backed Fenwick tree is memory efficient. O(log n) is about 20 loop iterations.",
      },
      {
        scale: "1B elements",
        answer:
          "Use sparse Fenwick maps or shard by index ranges if updates only touch a small subset.",
      },
      {
        scale: "Distributed",
        answer:
          "Maintain local Fenwick trees per shard and a top-level Fenwick/segment tree over shard totals.",
      },
    ],
    patterns: {
      title: "Core Fenwick pattern",
      code: `class Fenwick:
    def __init__(self, size):
        self.n = size
        self.bit = [0] * (size + 1)

    def add(self, index, delta):
        i = index + 1
        while i <= self.n:
            self.bit[i] += delta
            i += i & -i

    def prefix_sum(self, index):
        i = index + 1
        total = 0
        while i > 0:
            total += self.bit[i]
            i -= i & -i
        return total`,
    },
  },
  "trees-trie": {
    id: "trees-trie",
    moduleLabel: "Trees",
    title: "Tries",
    invariant:
      "Each edge represents the next character or token, and terminal markers distinguish full keys from prefixes.",
    brief: {
      why: [
        "Reach for a trie when prefix queries are central: autocomplete, dictionary lookup, longest-prefix match, word search, or token routing.",
        "A trie trades memory for prefix speed. Lookup cost depends on key length, not the number of stored keys.",
        "The terminal marker matters: a path can be a prefix without being a complete stored word.",
      ],
      costModel: [
        "Insert and lookup are O(L), where L is key length.",
        "Prefix search is O(P + output), where P is prefix length.",
        "Memory can be high because each node stores child mappings.",
        "Python dict children are flexible but heavy; arrays or compressed tries reduce overhead for fixed alphabets.",
      ],
      realWorld: [
        "Autocomplete systems use tries or trie-like finite-state structures for prefix retrieval.",
        "Routers use prefix trees for longest-prefix IP matching.",
        "Search indexes and spellcheckers use trie variants such as radix trees and DAWGs.",
      ],
    },
    visualize: {
      title: "Shared prefixes become shared paths",
      description:
        "Words that begin the same way reuse nodes. Terminal flags say which prefixes are complete words.",
      code: `root = {}
END = "#"

def insert(word):
    node = root
    for ch in word:
        node = node.setdefault(ch, {})
    node[END] = True`,
      steps: [
        {
          label: "Insert cat",
          state: "c -> a -> t -> END",
          note: "Every character advances one edge.",
        },
        {
          label: "Insert car",
          state: "c -> a -> r -> END",
          note: "The prefix c -> a is shared.",
        },
        {
          label: "Search ca",
          state: "path exists, no END",
          note: "ca is a prefix, but not a stored word.",
        },
        {
          label: "Prefix ca",
          state: "collect below node ca",
          note: "Autocomplete starts from the prefix node and explores descendants.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Structure", "Strength", "Weakness"],
      rows: [
        ["Trie", "Fast prefix queries", "High memory overhead"],
        ["Hash set", "Fast exact lookup", "No prefix traversal"],
        ["Sorted list", "Prefix range via binary search", "Insertions are expensive"],
        ["Radix tree", "Compressed trie memory", "More complex edges"],
        ["Suffix array/tree", "Substring search", "More complex build/query model"],
      ],
      notes: [
        "Use a terminal marker; otherwise prefixes and complete words are ambiguous.",
        "For fixed lowercase alphabets, child arrays can reduce overhead but make code less flexible.",
        "For many static words, a sorted list plus bisect prefix range may be simpler in Python.",
        "Use compressed tries or DAWGs when memory dominates.",
      ],
    },
    drill: [
      {
        prompt: "You need exact membership for words only. Trie or set?",
        answer: "A set is simpler and usually faster. Use a trie when prefix queries matter.",
      },
      {
        prompt: "You insert 'car' and 'cart'. How do you distinguish them?",
        answer: "Mark terminal nodes. The node for r ends 'car'; the child path t ends 'cart'.",
      },
      {
        prompt: "You need autocomplete for prefix 'pre'. What is the query shape?",
        answer: "Walk the prefix in O(P), then DFS/BFS below that node to collect completions.",
      },
      {
        prompt: "Memory is too high for millions of static words. What alternatives?",
        answer:
          "Use a compressed radix tree, DAWG/FST, or sorted array with prefix-range binary search.",
      },
    ],
    implement: {
      prompt: "Write a Trie with insert(word), search(word), and starts_with(prefix).",
      starterCode: `class Trie:
    def __init__(self):
        pass

    def insert(self, word):
        pass

    def search(self, word):
        pass

    def starts_with(self, prefix):
        pass`,
      tests: [
        "insert('cat'), search('cat') -> True",
        "search('ca') -> False",
        "starts_with('ca') -> True",
        "insert('car'), search('car') -> True",
        "starts_with('dog') -> False",
      ],
      notes: [
        "Each node can be a dict with a special terminal key.",
        "insert creates missing child nodes as it walks.",
        "search requires both path existence and terminal marker.",
      ],
    },
    scale: [
      {
        scale: "1K words",
        answer: "A dict-of-dicts trie is easy and fine.",
      },
      {
        scale: "1M words",
        answer:
          "Memory becomes visible. Consider arrays for fixed alphabets, compressed edges, or sorted-list prefix ranges.",
      },
      {
        scale: "1B tokens",
        answer:
          "Use disk-backed finite-state transducers, sharded prefix indexes, or search-engine infrastructure.",
      },
      {
        scale: "Distributed",
        answer:
          "Shard by leading prefix or hash depending on query pattern. Prefix sharding keeps autocomplete local.",
      },
    ],
    patterns: {
      title: "Core trie pattern",
      code: `class Trie:
    END = "#"

    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node[self.END] = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node:
                return False
            node = node[ch]
        return self.END in node`,
    },
  },
};
