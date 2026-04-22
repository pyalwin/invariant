import type { LinearStudyPlan } from "@/content/linearStudyPlans";

export const dpStudyPlans: Record<string, LinearStudyPlan> = {
  "dp-1d": {
    id: "dp-1d",
    moduleLabel: "Dynamic Programming",
    title: "DP - 1D",
    invariant:
      "Each state stores the best answer for a prefix, suffix, index, amount, or remaining capacity, and transitions reuse previously solved states.",
    brief: {
      why: [
        "Reach for 1D DP when a brute-force recursion repeats the same subproblem over one changing parameter: index, amount, length, or capacity.",
        "The design move is to name the state precisely. If dp[i] means the best answer up to i, every transition must preserve that meaning.",
        "Most 1D DP problems are either take/skip, previous-few-states, unbounded choices, or prefix/suffix accumulation.",
      ],
      costModel: [
        "Top-down memoization and bottom-up tabulation usually have the same state count and transition count.",
        "Time is number_of_states times transition_cost.",
        "Space is O(number_of_states), often reducible to O(1) when each state only depends on a fixed number of previous states.",
        "Python recursion plus @lru_cache is clear but carries recursion-depth and function-call overhead.",
      ],
      realWorld: [
        "Capacity planning uses knapsack-like choices under constraints.",
        "Compilers and parsers use DP when local choices combine into global optimal answers.",
        "Pricing, allocation, and scheduling systems often use DP when greedy choices are not safe.",
      ],
    },
    visualize: {
      title: "State meaning drives the transition",
      description:
        "For house robber, dp[i] means the best value using houses through index i. The transition decides whether house i is taken.",
      code: `def rob(nums):
    prev2 = 0
    prev1 = 0
    for value in nums:
        best = max(prev1, prev2 + value)
        prev2 = prev1
        prev1 = best
    return prev1`,
      steps: [
        {
          label: "Base",
          state: "prev2=0, prev1=0",
          note: "Before any house, the best value is zero.",
        },
        {
          label: "Take current",
          state: "prev2 + value",
          note: "If you rob this house, the previous house cannot be used.",
        },
        {
          label: "Skip current",
          state: "prev1",
          note: "If you skip it, keep the best answer so far.",
        },
        {
          label: "Roll state",
          state: "prev2 <- prev1, prev1 <- best",
          note: "Only the last two states are needed.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Best for", "Limit"],
      rows: [
        ["Brute force recursion", "Deriving choices", "Repeats subproblems exponentially"],
        ["Top-down memo", "Natural recursive state", "Call overhead and recursion depth"],
        ["Bottom-up table", "Clear dependency order", "Can allocate more than needed"],
        ["Rolling variables", "Fixed-width dependencies", "Harder to debug state meaning"],
        ["Greedy", "When local choice is provably safe", "Often wrong without proof"],
      ],
      notes: [
        "Write the brute-force recurrence first, then memoize repeated states.",
        "Define state in a sentence before writing code.",
        "Choose iteration order so dependencies are already computed.",
        "Only compress space after the table version is correct.",
      ],
    },
    drill: [
      {
        prompt:
          "A recursion branches take/skip at each index and repeats the same index many times. What technique?",
        answer: "1D DP with state by index, either top-down memoization or bottom-up tabulation.",
      },
      {
        prompt: "dp[i] depends only on dp[i-1] and dp[i-2]. What space optimization is safe?",
        answer:
          "Use two rolling variables, as long as you update them after computing the new state.",
      },
      {
        prompt: "Coin change asks minimum coins for amount x. What is a natural state?",
        answer:
          "dp[amount] = minimum coins needed to form that amount, with transitions from amount - coin.",
      },
      {
        prompt: "When is greedy acceptable instead of DP?",
        answer:
          "Only when you can prove local choices compose into a global optimum, such as with a valid exchange argument.",
      },
    ],
    implement: {
      prompt:
        "Write min_coins(coins, amount), returning the minimum number of coins needed or -1 if impossible. Coins may be reused.",
      starterCode: `def min_coins(coins, amount):
    pass`,
      tests: [
        "coins=[1,2,5], amount=11 -> 3",
        "coins=[2], amount=3 -> -1",
        "coins=[1], amount=0 -> 0",
        "coins=[2,5,10], amount=6 -> 3",
      ],
      notes: [
        "Use dp[a] as the minimum coins for amount a.",
        "Initialize dp[0] = 0 and all others to infinity.",
        "For each amount, try every coin that does not overshoot.",
      ],
    },
    scale: [
      {
        scale: "1K states",
        answer: "Plain table DP is easy to reason about and fast.",
      },
      {
        scale: "1M states",
        answer:
          "State count and transition cost dominate. Use arrays, rolling state, and avoid recursive overhead.",
      },
      {
        scale: "1B states",
        answer:
          "The state space is likely too large. Look for monotonic queues, matrix exponentiation, closed forms, pruning, or approximation.",
      },
      {
        scale: "Distributed",
        answer:
          "DP is hard to distribute when states depend sequentially. Partition only when dependency boundaries are clear.",
      },
    ],
    patterns: {
      title: "Core 1D DP pattern",
      code: `# Bottom-up table
dp = [float("inf")] * (amount + 1)
dp[0] = 0
for a in range(1, amount + 1):
    for coin in coins:
        if a >= coin:
            dp[a] = min(dp[a], dp[a - coin] + 1)

# Top-down memo
from functools import lru_cache

@lru_cache(None)
def solve(i):
    ...`,
    },
  },
  "dp-2d": {
    id: "dp-2d",
    moduleLabel: "Dynamic Programming",
    title: "DP - 2D",
    invariant:
      "Each cell dp[i][j] stores the answer for a subproblem defined by two coordinates, prefixes, or capacities.",
    brief: {
      why: [
        "Reach for 2D DP when one state parameter is not enough: two strings, grid coordinates, item index plus capacity, or interval endpoints.",
        "The table is a dependency graph. You must fill cells in an order where each cell's prerequisites are already known.",
        "Common families include grid paths, edit distance, longest common subsequence, 0/1 knapsack, and interval DP.",
      ],
      costModel: [
        "Time is rows times columns times transition_cost.",
        "Space is O(rows * columns), often reducible to one or two rows when dependencies are local.",
        "Nested Python lists can be memory-heavy at large dimensions.",
        "Avoid [[0] * cols] * rows because it aliases the same row object.",
      ],
      realWorld: [
        "Diff tools use edit-distance/LCS-style DP to compare sequences.",
        "Bioinformatics uses sequence alignment DP over two strings.",
        "Routing and planning systems use grid DP when movement constraints are local.",
      ],
    },
    visualize: {
      title: "Grid cells depend on earlier neighbors",
      description:
        "For unique paths, dp[r][c] is the number of ways to reach that cell from the top-left. It comes from top plus left.",
      code: `def unique_paths(rows, cols):
    dp = [[1] * cols for _ in range(rows)]
    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[-1][-1]`,
      steps: [
        {
          label: "Base row/col",
          state: "first row and first col are 1",
          note: "There is only one way to move straight right or straight down.",
        },
        {
          label: "Interior cell",
          state: "dp[r][c] = top + left",
          note: "The last move came from exactly one of those two cells.",
        },
        {
          label: "Fill order",
          state: "row-major",
          note: "Top and left are already computed before the current cell.",
        },
        {
          label: "Answer",
          state: "dp[rows-1][cols-1]",
          note: "The target cell stores the full-grid answer.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Pattern", "State", "Space note"],
      rows: [
        ["Grid paths", "dp[row][col]", "Often compress to one row"],
        ["LCS/edit distance", "dp[i][j] for prefixes", "Two rows if only length is needed"],
        ["0/1 knapsack", "dp[item][capacity]", "One row backward over capacity"],
        ["Interval DP", "dp[left][right]", "Fill by increasing interval length"],
        ["Graph shortest path", "Usually not DP table", "Use BFS/Dijkstra unless DAG/order exists"],
      ],
      notes: [
        "Make base cases explicit before filling transitions.",
        "Use row compression only when the previous row is enough.",
        "For 0/1 knapsack one-row DP, iterate capacity backward to avoid reusing the same item.",
        "For unbounded knapsack, iterate capacity forward when reuse is allowed.",
      ],
    },
    drill: [
      {
        prompt: "Two strings and operations insert/delete/replace. What DP shape?",
        answer:
          "2D DP over prefixes: dp[i][j] is the best answer for first i chars of one string and first j chars of the other.",
      },
      {
        prompt: "A grid cell depends on top and left. What fill order works?",
        answer:
          "Row-major or column-major, as long as top and left are computed before the current cell.",
      },
      {
        prompt: "0/1 knapsack with one-row compression. Iterate capacity forward or backward?",
        answer: "Backward, so the same item is not reused during its own update pass.",
      },
      {
        prompt: "Why is [[0] * cols] * rows dangerous?",
        answer:
          "It creates multiple references to the same row. Updating one row updates all aliased rows.",
      },
    ],
    implement: {
      prompt:
        "Write unique_paths_with_obstacles(grid), where 1 means blocked and 0 means open. Move only right or down.",
      starterCode: `def unique_paths_with_obstacles(grid):
    pass`,
      tests: ["[[0,0,0],[0,1,0],[0,0,0]] -> 2", "[[1]] -> 0", "[[0]] -> 1", "[[0,1],[0,0]] -> 1"],
      notes: [
        "If the start is blocked, return 0.",
        "Use a 1D row array if you want space O(cols).",
        "When a cell is blocked, set ways for that cell to 0.",
      ],
    },
    scale: [
      {
        scale: "1K cells",
        answer: "A full 2D table is fine and easiest to debug.",
      },
      {
        scale: "1M cells",
        answer:
          "Compress rows when dependencies allow it. Use numeric arrays if memory gets tight.",
      },
      {
        scale: "1B cells",
        answer:
          "A dense table is infeasible. Look for sparse obstacles, mathematical formulas, graph search, or divide-and-conquer optimization.",
      },
      {
        scale: "Distributed",
        answer:
          "Wavefront-style dependencies can be tiled, but synchronization happens along diagonals or tile boundaries.",
      },
    ],
    patterns: {
      title: "Core 2D DP patterns",
      code: `# Safe table construction
dp = [[0] * cols for _ in range(rows)]

# Row-compressed grid DP
ways = [0] * cols
ways[0] = 1
for r in range(rows):
    for c in range(cols):
        if blocked(r, c):
            ways[c] = 0
        elif c > 0:
            ways[c] += ways[c - 1]

# Fill intervals by length
for length in range(1, n + 1):
    for left in range(0, n - length + 1):
        right = left + length - 1`,
    },
  },
  "dp-bitmask": {
    id: "dp-bitmask",
    moduleLabel: "Dynamic Programming",
    title: "DP - Bitmask",
    invariant:
      "A bitmask encodes a subset of chosen or visited items, and each transition adds, removes, or tests one bit.",
    brief: {
      why: [
        "Reach for bitmask DP when n is small but subsets matter: traveling salesperson, assignment, visited-node states, partitioning, or choosing compatible items.",
        "The mask is a compact set. Bit i tells whether item i is included, visited, or already assigned.",
        "The warning is exponential state count. 2^n grows fast; this is for n around 20-25, not 100.",
      ],
      costModel: [
        "State count is O(2^n), often multiplied by n or n^2 depending on the second parameter.",
        "Masks are integers, so membership, add, remove, and toggle are O(1).",
        "Memory can dominate before time does: arrays of size 2^n get large quickly.",
        "Python dict memoization is flexible for sparse states; lists are faster for dense mask states.",
      ],
      realWorld: [
        "Small scheduling and assignment optimizers use bitmask DP for exact answers.",
        "Route planning over a small required-stop set uses TSP-style DP over visited stops.",
        "Permission, feature, and compatibility systems often use bitsets for compact subset checks.",
      ],
    },
    visualize: {
      title: "Transitions add one unvisited item",
      description:
        "For TSP-style DP, state (mask, last) stores the best cost to have visited mask and ended at last.",
      code: `def add_item(mask, i):
    return mask | (1 << i)

def has_item(mask, i):
    return (mask & (1 << i)) != 0

def remove_item(mask, i):
    return mask & ~(1 << i)`,
      steps: [
        {
          label: "Empty set",
          state: "mask = 0b0000",
          note: "No items have been chosen.",
        },
        {
          label: "Add item 2",
          state: "mask | (1 << 2) = 0b0100",
          note: "One bit records one decision.",
        },
        {
          label: "Test item",
          state: "mask & (1 << i)",
          note: "Bitwise AND checks membership.",
        },
        {
          label: "Complete set",
          state: "(1 << n) - 1",
          note: "All n bits are set.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Best for", "Limit"],
      rows: [
        ["Bitmask DP", "Exact subset optimization for small n", "O(2^n) states"],
        ["Backtracking", "Search with pruning", "Can repeat states without memo"],
        ["Greedy", "Fast heuristic", "Usually not exact for subset optimization"],
        ["Integer linear programming", "Larger exact optimization", "External solver/complexity"],
        ["Meet-in-the-middle", "Subset problems around n=40", "Problem-specific merge step"],
      ],
      notes: [
        "Use mask | (1 << i) to add an item.",
        "Use mask & (1 << i) to test membership.",
        "Use mask == (1 << n) - 1 for all visited.",
        "If state is dense, a list indexed by mask is faster than a dict.",
      ],
    },
    drill: [
      {
        prompt: "You need shortest route through 12 required stops. What DP shape?",
        answer:
          "Bitmask DP with state (mask, last), where mask records visited stops and last records the current stop.",
      },
      {
        prompt: "n is 60 and all subsets are possible. Is bitmask DP realistic?",
        answer:
          "No. 2^60 states is infeasible. Look for greedy, approximation, constraints, or a different formulation.",
      },
      {
        prompt: "How do you mark item i as selected?",
        answer: "mask | (1 << i).",
      },
      {
        prompt: "When is dict memo better than a dense list over masks?",
        answer: "When many masks are unreachable or the state has extra sparse dimensions.",
      },
    ],
    implement: {
      prompt:
        "Write can_partition_k_items(values, target), returning True if some subset sums exactly to target. Each item can be used at most once.",
      starterCode: `def can_partition_k_items(values, target):
    pass`,
      tests: [
        "values=[3,1,4,2], target=6 -> True",
        "values=[5,10], target=3 -> False",
        "values=[], target=0 -> True",
        "values=[2,2,2], target=4 -> True",
      ],
      notes: [
        "Use a set of reachable masks or reachable sums.",
        "For bitmask practice, iterate masks and compute transitions by adding an unset item.",
        "Stop early when a reachable subset has sum target.",
      ],
    },
    scale: [
      {
        scale: "n=10",
        answer: "2^10 is tiny. Bitmask DP is straightforward.",
      },
      {
        scale: "n=22",
        answer:
          "About four million masks. Feasible with careful arrays and simple transitions, but Python dict overhead matters.",
      },
      {
        scale: "n=35",
        answer:
          "Full bitmask DP is likely too large. Consider meet-in-the-middle or branch-and-bound.",
      },
      {
        scale: "Distributed",
        answer:
          "Subset DP has heavy dependency structure. Split by mask ranges only when transitions and reductions are carefully designed.",
      },
    ],
    patterns: {
      title: "Core bitmask DP patterns",
      code: `full = (1 << n) - 1

# Iterate masks and add one item
for mask in range(1 << n):
    for i in range(n):
        if mask & (1 << i):
            continue
        nxt = mask | (1 << i)
        dp[nxt] = min(dp[nxt], transition(dp[mask], i))

# Enumerate set bits
sub = mask
while sub:
    bit = sub & -sub
    i = bit.bit_length() - 1
    sub -= bit`,
    },
  },
};
