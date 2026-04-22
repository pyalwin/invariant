import type { LinearStudyPlan } from "@/content/linearStudyPlans";

export const hashingStudyPlans: Record<string, LinearStudyPlan> = {
  hashmaps: {
    id: "hashmaps",
    moduleLabel: "Hashing",
    title: "Dicts & Sets",
    invariant:
      "A key maps to a slot derived from its hash. Python dicts and sets give O(1) amortized lookup, insert, and delete while preserving dict insertion order.",
    brief: {
      why: [
        "Reach for a dict when you need to associate a key with a value: indexes, caches, grouped records, memoized answers, lookup tables, and joins.",
        "Reach for a set when only membership matters: deduplication, visited tracking, fast allowlists, seen-state checks, and intersections.",
        "The staff-level version of this topic is not just O(1). It is knowing when the memory cost, key design, ordering semantics, hashability rules, and worst-case collision behavior matter.",
      ],
      costModel: [
        "d[key], d[key] = value, key in d, d.get(key), and d.pop(key) are O(1) amortized.",
        "Worst-case lookup can be O(n) under heavy collisions, though Python hardens string and bytes hashing against common collision attacks.",
        "Dict iteration order is insertion order in Python 3.7+ as a language guarantee.",
        "Set union is O(len(a) + len(b)); intersection is O(min(len(a), len(b))) when implemented by iterating the smaller set.",
      ],
      realWorld: [
        "Python itself uses dictionaries for globals, locals, class attributes, and most instance attributes.",
        "Search engines use inverted indexes: a hash map from term to posting list.",
        "Caches, routing tables, compaction indexes, and deduplication services all lean on hash-table lookup.",
      ],
    },
    visualize: {
      title: "Membership turns a scan into a lookup",
      description:
        "The useful invariant is that the table can jump near the key's slot from the hash, then only resolve local collisions.",
      code: `seen = set()
result = []

for x in items:
    if x not in seen:
        seen.add(x)
        result.append(x)`,
      steps: [
        {
          label: "Start",
          state: "seen={}, result=[]",
          note: "The set records membership, not output order.",
        },
        {
          label: "Read 'api'",
          state: "seen={'api'}, result=['api']",
          note: "Missing key: add it to the set and preserve first occurrence in the list.",
        },
        {
          label: "Read 'db'",
          state: "seen={'api', 'db'}, result=['api', 'db']",
          note: "Another missing key inserts in O(1) amortized time.",
        },
        {
          label: "Read 'api' again",
          state: "seen={'api', 'db'}, result=['api', 'db']",
          note: "Membership catches the duplicate without scanning result.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Need", "Best Python choice", "Watch out for"],
      rows: [
        ["Membership only", "set", "Memory growth and hashable keys"],
        ["Key -> value lookup", "dict", "KeyError and mutable keys"],
        ["Frequency counting", "Counter", "most_common(k) still has selection cost"],
        ["Grouping", "defaultdict(list)", "Accidental key creation on read"],
        ["LRU cache", "functools.lru_cache or OrderedDict", "Eviction policy and max size"],
      ],
      notes: [
        "Keys must be hashable and equality-stable. Do not use mutable lists or mutable objects whose equality changes after insertion.",
        "Use key in d when you only need membership; use d.get(key) when missing values have a meaningful default.",
        "Use defaultdict for grouping and Counter for counting instead of hand-rolled branches.",
        "For huge read-only lookup sets, sorted arrays plus binary search can beat hash tables on memory and cache locality.",
      ],
    },
    drill: [
      {
        prompt:
          "You need to remove duplicates from a list while preserving first-seen order. What structure combination?",
        answer:
          "A set plus an output list. The set gives O(1) membership; the list preserves the order you want to return.",
      },
      {
        prompt: "You need to count log levels across 50M lines. What Python tool?",
        answer:
          "collections.Counter if the input is already tokenized, or a dict updated while streaming lines. Do not store all lines first.",
      },
      {
        prompt: "You need to group events by user_id for later per-user analysis. What pattern?",
        answer:
          "defaultdict(list). It keeps the grouping logic explicit and avoids a branch for every event.",
      },
      {
        prompt:
          "You need to cache results of a pure function with repeated calls. What should you try first?",
        answer:
          "functools.lru_cache with a bounded maxsize. It gives dict-backed lookup plus eviction without writing cache machinery.",
      },
      {
        prompt:
          "You need membership checks for 100M immutable IDs and almost never insert. Is a set always best?",
        answer:
          "Not always. A sorted compact array plus binary search may use far less memory and can be fast enough for read-heavy workloads.",
      },
    ],
    implement: {
      prompt:
        "Write intersection(a, b), returning unique elements that appear in both lists. Order does not matter.",
      starterCode: `def intersection(a, b):
    pass`,
      tests: [
        "[1, 2, 2, 3], [2, 2, 3, 4] -> [2, 3]",
        "[1, 2, 3], [4, 5, 6] -> []",
        "[], [1, 2] -> []",
        "[1, 1, 1, 1], [1] -> [1]",
      ],
      notes: [
        "Convert one input to a set for O(1) membership.",
        "Iterate the other input and add matches to a result set to keep outputs unique.",
        "For memory, build the lookup set from the smaller input.",
      ],
    },
    scale: [
      {
        scale: "1K elements",
        answer: "set(a) & set(b) is clear, fast, and fine.",
      },
      {
        scale: "1M elements",
        answer:
          "Still fine in memory for many primitive values. Prefer building the smaller set first for intersections.",
      },
      {
        scale: "1B elements",
        answer:
          "Partition by hash so the same key lands on the same machine. Each partition computes a local intersection, then results merge.",
      },
      {
        scale: "Distributed",
        answer:
          "Use shuffle-by-key for exact joins/intersections. For approximate overlap, use MinHash or HyperLogLog depending on whether you need similarity or cardinality.",
      },
    ],
    patterns: {
      title: "Core hashing patterns",
      code: `from collections import Counter, defaultdict

# Count
counts = Counter(items)

# Group
groups = defaultdict(list)
for item in items:
    groups[key_fn(item)].append(item)

# Deduplicate while preserving order
seen = set()
deduped = []
for x in seq:
    if x not in seen:
        seen.add(x)
        deduped.append(x)

# LRU for pure functions
from functools import lru_cache

@lru_cache(maxsize=4096)
def solve(state):
    ...`,
    },
  },
};
