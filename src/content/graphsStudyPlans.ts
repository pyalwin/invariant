import type { LinearStudyPlan } from "@/content/linearStudyPlans";

export const graphsStudyPlans: Record<string, LinearStudyPlan> = {
  "graphs-bfs": {
    id: "graphs-bfs",
    moduleLabel: "Graphs",
    title: "BFS",
    invariant:
      "A queue explores nodes in increasing edge distance from the source in an unweighted graph.",
    brief: {
      why: [
        "Reach for BFS when you need shortest paths by number of edges, level order traversal, connected components, or minimum moves in an unweighted state space.",
        "The queue is the proof. Nodes discovered first at distance d are processed before nodes at distance d + 1.",
        "The most common bug is marking visited too late. Mark when enqueuing so the same node is not queued many times.",
      ],
      costModel: [
        "Adjacency-list BFS is O(V + E) time because each node and edge is inspected at most a constant number of times.",
        "Space is O(V) for the queue, visited set, and optional distance/parent maps.",
        "collections.deque is the right Python queue. list.pop(0) is O(n).",
        "For grids, encode coordinates as tuples or integer ids; bounds checks replace adjacency lists.",
      ],
      realWorld: [
        "Network crawlers and dependency walkers use BFS to expand frontiers fairly.",
        "Game pathfinding uses BFS for unweighted maps and Dijkstra/A* when costs differ.",
        "Social graph features use BFS-style frontiers for degrees of separation.",
      ],
    },
    visualize: {
      title: "The frontier moves one layer at a time",
      description:
        "Every item in the queue has a known distance. New neighbors get distance + 1 and go to the back.",
      code: `from collections import deque

def bfs(graph, source):
    q = deque([source])
    dist = {source: 0}
    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in dist:
                dist[nxt] = dist[node] + 1
                q.append(nxt)
    return dist`,
      steps: [
        {
          label: "Seed",
          state: "queue=[A], dist[A]=0",
          note: "The source is the only distance-0 node.",
        },
        {
          label: "Expand A",
          state: "queue=[B, C], dist[B]=dist[C]=1",
          note: "All newly discovered neighbors are one edge away.",
        },
        {
          label: "Expand B",
          state: "queue=[C, D]",
          note: "D is distance 2, queued after the remaining distance-1 node.",
        },
        {
          label: "Finish",
          state: "dist has shortest edge counts",
          note: "First discovery is shortest discovery in an unweighted graph.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Use when", "Limit"],
      rows: [
        ["BFS", "Unweighted shortest path, levels", "Memory can grow with frontier width"],
        ["DFS", "Reachability, backtracking, components", "Does not guarantee shortest path"],
        ["Dijkstra", "Non-negative weighted shortest path", "More overhead than BFS"],
        ["A*", "Known target with useful heuristic", "Heuristic must be admissible for optimality"],
        [
          "Bidirectional BFS",
          "Single source-target shortest path",
          "Needs reverse expansion and set intersection",
        ],
      ],
      notes: [
        "Use BFS for shortest path only when all edges have equal cost.",
        "Track parents if you need to reconstruct the actual path, not just distance.",
        "In Python, use deque and mark visited on enqueue.",
        "For very large frontiers, bidirectional BFS can reduce search depth dramatically.",
      ],
    },
    drill: [
      {
        prompt: "You need minimum knight moves on a chessboard. Which graph algorithm?",
        answer: "BFS, because every legal move has the same cost.",
      },
      {
        prompt: "A maze has terrain costs of 1, 5, and 10. Is BFS still enough?",
        answer: "No. Edge costs differ, so use Dijkstra or A* with an admissible heuristic.",
      },
      {
        prompt: "When should you mark a node visited in BFS?",
        answer: "When enqueuing it. Marking on pop can enqueue the same node many times.",
      },
      {
        prompt: "You need the path, not just distance. What extra state?",
        answer: "Store parent[nxt] = node when discovering nxt, then backtrack from target.",
      },
    ],
    implement: {
      prompt:
        "Write shortest_path_length(graph, source, target) for an unweighted graph adjacency dict. Return -1 if unreachable.",
      starterCode: `def shortest_path_length(graph, source, target):
    pass`,
      tests: [
        "A-B-C, source=A, target=C -> 2",
        "source equals target -> 0",
        "disconnected target -> -1",
        "diamond A->B,C; B,C->D, source=A, target=D -> 2",
      ],
      notes: [
        "Use deque for the queue.",
        "Store distance in a dict or queue pairs of (node, distance).",
        "Return as soon as target is discovered or popped.",
      ],
    },
    scale: [
      {
        scale: "1K nodes",
        answer: "Plain adjacency-list BFS is simple and fast.",
      },
      {
        scale: "1M nodes",
        answer:
          "Memory for visited and frontier dominates. Use compact ids, arrays/bitsets, and stream adjacency when possible.",
      },
      {
        scale: "1B nodes",
        answer:
          "Use frontier-based distributed traversal. Store visited compactly and partition nodes so adjacency fetches are local.",
      },
      {
        scale: "Distributed",
        answer:
          "Use bulk-synchronous frontiers: each worker expands local frontier, shuffles remote discoveries, then synchronizes levels.",
      },
    ],
    patterns: {
      title: "Core BFS pattern",
      code: `from collections import deque

q = deque([source])
dist = {source: 0}
parent = {source: None}
while q:
    node = q.popleft()
    for nxt in graph[node]:
        if nxt not in dist:
            dist[nxt] = dist[node] + 1
            parent[nxt] = node
            q.append(nxt)`,
    },
  },
  "graphs-dfs": {
    id: "graphs-dfs",
    moduleLabel: "Graphs",
    title: "DFS",
    invariant:
      "DFS follows one path as deep as possible before backtracking to the most recent unfinished node.",
    brief: {
      why: [
        "Reach for DFS when you need reachability, components, cycle detection, topological ordering, backtracking, or subtree-style graph exploration.",
        "DFS is about state transitions: unvisited, visiting, and visited. Those states let you reason about cycles and dependency order.",
        "Recursive DFS is concise, but Python recursion limits make iterative DFS safer for large or adversarial graphs.",
      ],
      costModel: [
        "Adjacency-list DFS is O(V + E) time.",
        "Space is O(V) for visited plus O(h) recursion/stack depth, worst-case O(V).",
        "Recursive DFS can raise RecursionError on deep graphs.",
        "Cycle detection in directed graphs needs a visiting state, not just a visited set.",
      ],
      realWorld: [
        "Build systems use DFS/topological ordering over dependency graphs.",
        "Compilers use DFS variants for control-flow and call-graph analysis.",
        "Web crawlers and search tools use DFS when depth-first exploration or backtracking is natural.",
      ],
    },
    visualize: {
      title: "DFS keeps an unfinished path on the stack",
      description:
        "The stack, explicit or recursive, stores the path of nodes whose remaining neighbors still need exploration.",
      code: `def dfs(graph, source):
    seen = set()
    stack = [source]
    while stack:
        node = stack.pop()
        if node in seen:
            continue
        seen.add(node)
        for nxt in graph[node]:
            stack.append(nxt)
    return seen`,
      steps: [
        {
          label: "Push source",
          state: "stack=[A]",
          note: "The top of the stack is the next node to explore.",
        },
        {
          label: "Pop A",
          state: "seen={A}, stack=[B, C]",
          note: "Neighbors are scheduled for later exploration.",
        },
        {
          label: "Pop C",
          state: "follow C before B",
          note: "LIFO order drives depth-first behavior.",
        },
        {
          label: "Backtrack",
          state: "return to previous unfinished nodes",
          note: "When a path ends, the stack resumes an older branch.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Best for", "Watch out"],
      rows: [
        ["Recursive DFS", "Small/depth-bounded graphs", "Recursion limits"],
        ["Iterative DFS", "Large graphs", "Manual stack details"],
        ["BFS", "Shortest unweighted paths", "Larger frontier memory"],
        ["Topological DFS", "DAG dependency order", "Cycle handling required"],
        ["Union-Find", "Undirected connectivity under edge additions", "No path/order info"],
      ],
      notes: [
        "Use color states for directed cycle detection: unvisited, visiting, done.",
        "Use postorder for topological sort: append after exploring children, then reverse.",
        "For connected components, start DFS from every unvisited node.",
        "Do not use DFS when shortest path by edges is required.",
      ],
    },
    drill: [
      {
        prompt: "You need to know if a directed dependency graph has a cycle. What state matters?",
        answer: "A visiting state. Seeing an edge to a currently visiting node means a cycle.",
      },
      {
        prompt: "You need shortest path in an unweighted graph. DFS or BFS?",
        answer: "BFS. DFS can find a path, but not necessarily the shortest one.",
      },
      {
        prompt: "You need connected components in an undirected graph. What loop surrounds DFS?",
        answer: "Iterate over every node, starting DFS only from nodes not already visited.",
      },
      {
        prompt: "A graph can be a chain of 500k nodes. Recursive DFS in Python?",
        answer: "Avoid it. Use an explicit stack to prevent RecursionError.",
      },
    ],
    implement: {
      prompt: "Write count_components(n, edges) for an undirected graph with nodes 0..n-1.",
      starterCode: `def count_components(n, edges):
    pass`,
      tests: [
        "n=5, edges=[(0,1),(1,2),(3,4)] -> 2",
        "n=3, edges=[] -> 3",
        "n=1, edges=[] -> 1",
        "n=4, edges=[(0,1),(1,2),(2,3)] -> 1",
      ],
      notes: [
        "Build an adjacency list.",
        "Start DFS from each unvisited node and increment the component count.",
        "Use an explicit stack for robustness.",
      ],
    },
    scale: [
      {
        scale: "1K nodes",
        answer: "Recursive or iterative DFS is fine.",
      },
      {
        scale: "1M nodes",
        answer:
          "Use iterative DFS and compact adjacency storage. Recursion depth and object overhead become real issues.",
      },
      {
        scale: "1B nodes",
        answer:
          "Single-machine DFS is usually impractical. Use graph processing systems or partitioned component algorithms.",
      },
      {
        scale: "Distributed",
        answer:
          "DFS is hard to distribute due to sequential stack dependence. Prefer BFS/frontier or union-find-style component algorithms.",
      },
    ],
    patterns: {
      title: "Core DFS patterns",
      code: `# Iterative DFS
stack = [source]
seen = set()
while stack:
    node = stack.pop()
    if node in seen:
        continue
    seen.add(node)
    stack.extend(graph[node])

# Directed cycle states
UNVISITED, VISITING, DONE = 0, 1, 2`,
    },
  },
  "graphs-dijkstra": {
    id: "graphs-dijkstra",
    moduleLabel: "Graphs",
    title: "Dijkstra",
    invariant:
      "With non-negative edge weights, once a node is popped with the smallest tentative distance, that distance is final.",
    brief: {
      why: [
        "Reach for Dijkstra when you need shortest paths in a weighted graph and all edge weights are non-negative.",
        "The heap always chooses the closest not-yet-finalized candidate. Non-negative weights guarantee no future path can make a popped node cheaper.",
        "In Python, use heapq with lazy deletion: push improved distances and skip stale entries when popped.",
      ],
      costModel: [
        "Binary-heap Dijkstra is O((V + E) log V) with adjacency lists.",
        "Space is O(V + E) for the graph plus O(V) distances; the heap may hold stale entries.",
        "Array-scan Dijkstra is O(V^2), sometimes competitive for dense graphs.",
        "Negative edges break the finalized-distance invariant; use Bellman-Ford or another algorithm.",
      ],
      realWorld: [
        "Routing and map systems use Dijkstra variants, usually with heuristics or precomputed indexes.",
        "Network control planes compute shortest paths over weighted topology graphs.",
        "Schedulers use similar best-first expansion when costs are non-negative and cumulative.",
      ],
    },
    visualize: {
      title: "Relaxation improves tentative distances",
      description:
        "Popping from the heap finalizes one node. Relaxing its outgoing edges may push better candidates for neighbors.",
      code: `import heapq

def dijkstra(graph, source):
    dist = {source: 0}
    heap = [(0, source)]
    while heap:
        d, node = heapq.heappop(heap)
        if d != dist.get(node):
            continue
        for nxt, w in graph[node]:
            nd = d + w
            if nd < dist.get(nxt, float("inf")):
                dist[nxt] = nd
                heapq.heappush(heap, (nd, nxt))
    return dist`,
      steps: [
        {
          label: "Seed",
          state: "heap=[(0, A)], dist[A]=0",
          note: "The source starts with distance 0.",
        },
        {
          label: "Pop closest",
          state: "A finalized",
          note: "No unprocessed path can beat A because weights are non-negative.",
        },
        {
          label: "Relax edges",
          state: "dist[B]=4, dist[C]=2",
          note: "Better tentative paths get pushed into the heap.",
        },
        {
          label: "Skip stale",
          state: "old heap entries ignored",
          note: "Lazy deletion avoids a decrease-key operation.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Algorithm", "Use when", "Limit"],
      rows: [
        ["BFS", "All edge weights equal", "Cannot handle varied weights"],
        ["Dijkstra", "Non-negative weights", "Fails with negative edges"],
        ["Bellman-Ford", "Negative edges or cycle detection", "O(VE)"],
        ["A*", "Known target with heuristic", "Heuristic quality matters"],
        ["Floyd-Warshall", "All-pairs on small dense graphs", "O(V^3)"],
      ],
      notes: [
        "The non-negative weight condition is not optional.",
        "Use heapq and skip stale entries with if d != dist[node].",
        "Stop early when the target node is popped, not merely discovered.",
        "For dense graphs, O(V^2) array-scan Dijkstra may be simpler and faster.",
      ],
    },
    drill: [
      {
        prompt: "The graph has weights 1, 2, and 10. BFS or Dijkstra?",
        answer: "Dijkstra. BFS only works when every edge has the same cost.",
      },
      {
        prompt: "The graph has one edge with weight -3. Can Dijkstra be used safely?",
        answer: "No. Negative edges break the finalized-distance invariant.",
      },
      {
        prompt: "When can you stop early for a single target?",
        answer: "When the target is popped from the heap with its current best distance.",
      },
      {
        prompt: "Why do Python implementations push duplicate entries instead of decrease-key?",
        answer:
          "heapq has no efficient decrease-key. Lazy deletion is simpler and keeps the same asymptotic behavior.",
      },
    ],
    implement: {
      prompt:
        "Write shortest_weighted_path(graph, source, target), returning float('inf') if unreachable. graph maps node to (neighbor, weight) pairs.",
      starterCode: `def shortest_weighted_path(graph, source, target):
    pass`,
      tests: [
        "A->B(4), A->C(1), C->B(2), source=A,target=B -> 3",
        "source equals target -> 0",
        "unreachable target -> float('inf')",
        "A->B(5), A->C(2), C->D(1), D->B(1) -> 4",
      ],
      notes: [
        "Use heapq with (distance, node) tuples.",
        "Skip stale heap entries.",
        "Return as soon as target is popped.",
      ],
    },
    scale: [
      {
        scale: "1K nodes",
        answer: "Standard heap-based Dijkstra is straightforward.",
      },
      {
        scale: "1M nodes",
        answer:
          "Use compact adjacency, early exit for single target, and avoid storing paths for every node unless needed.",
      },
      {
        scale: "1B nodes",
        answer:
          "Precompute indexes, landmarks, contractions, or partitions. Plain online Dijkstra is too slow for low-latency routing.",
      },
      {
        scale: "Distributed",
        answer:
          "Use graph-processing frameworks or routing-specific preprocessing. Cross-partition priority queues are expensive.",
      },
    ],
    patterns: {
      title: "Core Dijkstra pattern",
      code: `import heapq

dist = {source: 0}
heap = [(0, source)]
while heap:
    d, node = heapq.heappop(heap)
    if d != dist.get(node):
        continue
    for nxt, weight in graph[node]:
        nd = d + weight
        if nd < dist.get(nxt, float("inf")):
            dist[nxt] = nd
            heapq.heappush(heap, (nd, nxt))`,
    },
  },
  "graphs-bellman-ford": {
    id: "graphs-bellman-ford",
    moduleLabel: "Graphs",
    title: "Bellman-Ford",
    invariant:
      "After i full relaxation passes, all shortest paths using at most i edges have been found.",
    brief: {
      why: [
        "Reach for Bellman-Ford when edge weights can be negative or when you need to detect negative cycles reachable from the source.",
        "It is slower than Dijkstra but more general: repeated relaxation propagates improvements one edge farther per pass.",
        "The extra Vth pass is the negative-cycle test. If anything can still improve, a reachable negative cycle exists.",
      ],
      costModel: [
        "Time is O(VE) for V - 1 relaxation passes over all edges.",
        "Space is O(V) for the distance map.",
        "Early exit is possible when a full pass makes no changes.",
        "It handles negative edges, not shortest paths with reachable negative cycles.",
      ],
      realWorld: [
        "Distance-vector routing protocols use Bellman-Ford-like relaxation.",
        "Financial arbitrage detection transforms exchange rates into negative-cycle detection.",
        "Constraint systems use relaxation to detect impossible inequalities.",
      ],
    },
    visualize: {
      title: "Each pass allows one more edge",
      description:
        "A shortest path without cycles has at most V - 1 edges. Repeating relaxation V - 1 times is enough unless a negative cycle keeps improving.",
      code: `def bellman_ford(n, edges, source):
    dist = [float("inf")] * n
    dist[source] = 0
    for _ in range(n - 1):
        changed = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break
    return dist`,
      steps: [
        {
          label: "Pass 0",
          state: "dist[source]=0",
          note: "Only zero-edge paths are known.",
        },
        {
          label: "Pass 1",
          state: "best paths with <= 1 edge",
          note: "Every outgoing edge from the source can improve a neighbor.",
        },
        {
          label: "Pass k",
          state: "best paths with <= k edges",
          note: "Improvements propagate one edge farther per pass.",
        },
        {
          label: "Cycle check",
          state: "one more pass improves?",
          note: "Any improvement after V - 1 passes means a reachable negative cycle.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Algorithm", "Strength", "Cost"],
      rows: [
        ["Dijkstra", "Fast with non-negative weights", "Cannot handle negative edges"],
        ["Bellman-Ford", "Negative edges and cycle detection", "O(VE)"],
        ["SPFA", "Often faster in practice", "Bad worst-case"],
        ["Floyd-Warshall", "All-pairs and negative cycle signal", "O(V^3)"],
        ["Topological shortest path", "Fast on DAGs with negative edges", "Requires DAG"],
      ],
      notes: [
        "Use Bellman-Ford for correctness with negative edges.",
        "Use early exit when a pass makes no changes.",
        "Report negative cycles separately; shortest path is undefined if one is reachable on a path to the target.",
        "On a DAG, topological relaxation is faster than Bellman-Ford.",
      ],
    },
    drill: [
      {
        prompt: "A graph has negative edges but no negative cycles. Which shortest-path algorithm?",
        answer: "Bellman-Ford, or DAG shortest path if the graph is acyclic.",
      },
      {
        prompt: "What does an improvement on the Vth pass mean?",
        answer: "A reachable negative cycle exists.",
      },
      {
        prompt: "Why are V - 1 passes enough without negative cycles?",
        answer: "A simple shortest path has at most V - 1 edges.",
      },
      {
        prompt: "When can Bellman-Ford stop early?",
        answer: "When a full pass over all edges makes no distance changes.",
      },
    ],
    implement: {
      prompt:
        "Write bellman_ford(n, edges, source), returning (dist, has_negative_cycle). edges are (u, v, w).",
      starterCode: `def bellman_ford(n, edges, source):
    pass`,
      tests: [
        "n=3, edges=[(0,1,5),(1,2,-2)], source=0 -> dist[2]=3, cycle=False",
        "unreachable nodes stay float('inf')",
        "edges=[(0,1,1),(1,2,-3),(2,1,1)] -> cycle=True",
        "n=1, edges=[] -> dist=[0], cycle=False",
      ],
      notes: [
        "Initialize dist[source] = 0 and others to infinity.",
        "Skip relaxations from infinity.",
        "After V - 1 passes, run one more pass to detect negative cycles.",
      ],
    },
    scale: [
      {
        scale: "1K nodes",
        answer:
          "Fine for moderate edge counts, especially when correctness with negative edges matters.",
      },
      {
        scale: "1M edges",
        answer:
          "O(VE) can become too slow. Use early exit, DAG-specific relaxation, or re-evaluate whether negative edges are real.",
      },
      {
        scale: "1B edges",
        answer:
          "Use distributed relaxation only when necessary; otherwise transform the problem or precompute constraints.",
      },
      {
        scale: "Distributed",
        answer:
          "Distance-vector style relaxation is naturally distributed but can converge slowly and needs cycle/instability handling.",
      },
    ],
    patterns: {
      title: "Core Bellman-Ford pattern",
      code: `dist = [float("inf")] * n
dist[source] = 0
for _ in range(n - 1):
    changed = False
    for u, v, w in edges:
        if dist[u] != float("inf") and dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            changed = True
    if not changed:
        break

has_cycle = any(
    dist[u] != float("inf") and dist[u] + w < dist[v]
    for u, v, w in edges
)`,
    },
  },
  "graphs-union-find": {
    id: "graphs-union-find",
    moduleLabel: "Graphs",
    title: "Union-Find",
    invariant:
      "Each element points to a representative root; two elements are connected exactly when their roots match.",
    brief: {
      why: [
        "Reach for Union-Find when connectivity changes only by adding undirected edges and you need fast connected-component queries.",
        "It does not store paths or graph structure. It answers whether two nodes are in the same set.",
        "Path compression and union by size/rank make operations effectively constant time for practical input sizes.",
      ],
      costModel: [
        "find and union are amortized almost O(1), formally O(alpha(n)).",
        "Space is O(n) for parent and size/rank arrays.",
        "It supports edge additions, not arbitrary deletions.",
        "For dynamic deletions, use offline processing, rollback DSU, or more advanced dynamic connectivity structures.",
      ],
      realWorld: [
        "Kruskal's MST uses Union-Find to avoid cycles while adding edges.",
        "Image processing uses connected-component labeling.",
        "Network and account-merging systems use DSU-style grouping when links only accumulate.",
      ],
    },
    visualize: {
      title: "Compression flattens the trees",
      description:
        "find walks to the representative root. Path compression rewires traversed nodes directly to that root.",
      code: `def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return False
    if size[ra] < size[rb]:
        ra, rb = rb, ra
    parent[rb] = ra
    size[ra] += size[rb]
    return True`,
      steps: [
        {
          label: "Initial",
          state: "parent[x]=x for every x",
          note: "Every node starts as its own component.",
        },
        {
          label: "Union",
          state: "attach smaller root to larger root",
          note: "Union by size keeps trees shallow.",
        },
        {
          label: "Find",
          state: "walk parent pointers to root",
          note: "The root is the component representative.",
        },
        {
          label: "Compress",
          state: "parent[x]=root",
          note: "Future finds become faster.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Best for", "Limit"],
      rows: [
        ["Union-Find", "Incremental undirected connectivity", "No deletions or paths"],
        ["DFS/BFS", "One-off connectivity/path", "Repeated queries can be expensive"],
        ["Dynamic connectivity", "Adds and deletes", "Much more complex"],
        ["Transitive closure", "O(1) query", "O(V^2) space"],
        ["Graph database", "Persistent relationship queries", "Operational complexity"],
      ],
      notes: [
        "Use DSU when edges only get added.",
        "Use DFS/BFS when you need actual paths or traversal order.",
        "Union returns False when an edge connects nodes already in the same component; that is cycle detection for undirected graphs.",
        "Store component size at roots if you need largest component or group sizes.",
      ],
    },
    drill: [
      {
        prompt:
          "You process friendships and repeatedly ask if two users are connected. What structure?",
        answer: "Union-Find, if friendships are only added and exact paths are not required.",
      },
      {
        prompt:
          "You need to remove edges and keep connectivity online. Is basic Union-Find enough?",
        answer: "No. Basic DSU does not support deletions.",
      },
      {
        prompt: "How does DSU detect a cycle in an undirected graph?",
        answer:
          "If union(u, v) finds the same root for u and v, adding that edge would create a cycle.",
      },
      {
        prompt: "Why use union by size or rank?",
        answer: "It keeps trees shallow, making future find operations faster.",
      },
    ],
    implement: {
      prompt:
        "Write count_components(n, edges) using Union-Find for an undirected graph with nodes 0..n-1.",
      starterCode: `def count_components(n, edges):
    pass`,
      tests: [
        "n=5, edges=[(0,1),(1,2),(3,4)] -> 2",
        "n=3, edges=[] -> 3",
        "n=4, edges=[(0,1),(2,3),(1,3)] -> 1",
        "n=1, edges=[] -> 1",
      ],
      notes: [
        "Initialize components = n.",
        "When union connects two different roots, decrement components.",
        "Use path compression in find.",
      ],
    },
    scale: [
      {
        scale: "1K nodes",
        answer: "Any correct DSU implementation is fine.",
      },
      {
        scale: "1M nodes",
        answer: "Use lists of ints for parent and size. Avoid object-heavy node wrappers.",
      },
      {
        scale: "1B nodes",
        answer:
          "Use sparse maps for active nodes or partition by id ranges; memory for dense arrays can dominate.",
      },
      {
        scale: "Distributed",
        answer:
          "Compute local components, emit cross-partition edges, then iteratively merge component ids until convergence.",
      },
    ],
    patterns: {
      title: "Core Union-Find pattern",
      code: `parent = list(range(n))
size = [1] * n

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return False
    if size[ra] < size[rb]:
        ra, rb = rb, ra
    parent[rb] = ra
    size[ra] += size[rb]
    return True`,
    },
  },
  "graphs-mst": {
    id: "graphs-mst",
    moduleLabel: "Graphs",
    title: "MST (Kruskal/Prim)",
    invariant:
      "For any cut, the minimum-weight edge crossing that cut is safe to add to some minimum spanning tree.",
    brief: {
      why: [
        "Reach for an MST when you need to connect all nodes with minimum total edge cost in an undirected weighted graph.",
        "Kruskal sorts edges globally and uses Union-Find to skip cycles. Prim grows one connected tree using a heap of boundary edges.",
        "MST is not shortest path. It minimizes total network cost, not distance between any particular pair of nodes.",
      ],
      costModel: [
        "Kruskal is O(E log E) for sorting plus near-constant DSU operations.",
        "Prim with a heap is O(E log V) on adjacency lists.",
        "Space is O(V + E) for graph storage plus helper structures.",
        "MST requires an undirected graph; disconnected graphs produce a minimum spanning forest.",
      ],
      realWorld: [
        "Network design uses MST-like reasoning for minimum-cost connectivity baselines.",
        "Clustering algorithms use MSTs to expose natural separations by removing expensive edges.",
        "Approximation algorithms use MSTs as building blocks for routing and connection problems.",
      ],
    },
    visualize: {
      title: "Kruskal adds safe edges in sorted order",
      description:
        "Each accepted edge connects two previously separate components. Rejected edges would form cycles.",
      code: `def kruskal(n, edges):
    total = 0
    edges_used = 0
    for w, u, v in sorted(edges):
        if union(u, v):
            total += w
            edges_used += 1
    return total if edges_used == n - 1 else None`,
      steps: [
        {
          label: "Sort edges",
          state: "lowest weights first",
          note: "The cut property makes the lightest safe crossing edge valid.",
        },
        {
          label: "Accept edge",
          state: "union(u, v) succeeds",
          note: "The edge connects two different components.",
        },
        {
          label: "Reject edge",
          state: "union(u, v) fails",
          note: "The edge would create a cycle inside one component.",
        },
        {
          label: "Stop",
          state: "edges_used = n - 1",
          note: "A spanning tree over n nodes has exactly n - 1 edges.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Algorithm", "Best for", "Core helper"],
      rows: [
        ["Kruskal", "Edge list, sparse graphs", "Sort + Union-Find"],
        ["Prim", "Adjacency list, connected growth", "Heap"],
        ["Boruvka", "Parallel/distributed MST", "Component minimum outgoing edges"],
        ["Dijkstra", "Shortest paths from source", "Not MST"],
        ["BFS", "Unweighted shortest paths", "Not weighted total cost"],
      ],
      notes: [
        "Use Kruskal when edges are already available as a list.",
        "Use Prim when you have adjacency lists and want to grow from a start node.",
        "If the graph is disconnected, return a forest or report that no spanning tree exists.",
        "MST optimizes total connection cost, not source-to-target latency.",
      ],
    },
    drill: [
      {
        prompt: "You need cheapest cabling to connect all offices. MST or shortest paths?",
        answer: "MST. The goal is minimum total connection cost.",
      },
      {
        prompt: "You need fastest route from office A to office B. MST?",
        answer: "No. Use shortest path. An MST path between two nodes can be far from shortest.",
      },
      {
        prompt: "Your input is just an edge list. Kruskal or Prim?",
        answer: "Kruskal is natural: sort edges and use Union-Find.",
      },
      {
        prompt: "Kruskal sees an edge whose endpoints are already connected. What happens?",
        answer: "Reject it, because it would create a cycle.",
      },
    ],
    implement: {
      prompt:
        "Write mst_cost(n, edges) using Kruskal. edges are (u, v, weight). Return None if the graph is disconnected.",
      starterCode: `def mst_cost(n, edges):
    pass`,
      tests: [
        "n=3, edges=[(0,1,1),(1,2,2),(0,2,5)] -> 3",
        "n=4, disconnected edges=[(0,1,1),(2,3,1)] -> None",
        "n=1, edges=[] -> 0",
        "cycle with weights 1,2,3 chooses 1 and 2",
      ],
      notes: [
        "Sort by weight.",
        "Use Union-Find to accept only edges connecting different components.",
        "Stop when you have n - 1 accepted edges.",
      ],
    },
    scale: [
      {
        scale: "1K edges",
        answer: "Kruskal or Prim is fine. Pick based on input shape.",
      },
      {
        scale: "1M edges",
        answer: "Sorting dominates Kruskal. Use efficient tuple sorting and compact DSU arrays.",
      },
      {
        scale: "1B edges",
        answer:
          "External sorting or distributed MST algorithms become necessary. Filter obvious heavy edges when possible.",
      },
      {
        scale: "Distributed",
        answer:
          "Use Boruvka-style phases: each component picks cheapest outgoing edges, merge components, repeat.",
      },
    ],
    patterns: {
      title: "Core Kruskal pattern",
      code: `def mst_cost(n, edges):
    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        size[ra] += size[rb]
        return True

    total = used = 0
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        if union(u, v):
            total += w
            used += 1
    return total if used == n - 1 else None`,
    },
  },
};
