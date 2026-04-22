import type { LinearStudyPlan } from "@/content/linearStudyPlans";

export const advancedStudyPlans: Record<string, LinearStudyPlan> = {
  "bloom-filters": {
    id: "bloom-filters",
    moduleLabel: "Advanced",
    title: "Bloom Filters",
    invariant:
      "A Bloom filter may return false positives, but it never returns false negatives for inserted items.",
    brief: {
      why: [
        "Reach for a Bloom filter when membership checks must be very space efficient and a small false-positive rate is acceptable.",
        "It is a prefilter, not an exact database. A 'no' answer is definitive; a 'yes' answer usually needs a second exact check when correctness matters.",
        "The tradeoff is controlled by bit-array size m, hash count k, and inserted item count n.",
      ],
      costModel: [
        "Add and query are O(k), where k is the number of hash functions.",
        "Space is O(m) bits, often around 10 bits per item for roughly 1 percent false positives.",
        "Standard Bloom filters do not support deletion.",
        "False positive probability rises as the filter fills beyond its planned capacity.",
      ],
      realWorld: [
        "LSM-tree databases use Bloom filters to avoid disk reads for keys that are definitely absent from an SSTable.",
        "Safe-browsing and abuse systems use compact probabilistic membership filters before exact checks.",
        "Caches use Bloom filters to avoid expensive lookups for definitely-missing keys.",
      ],
    },
    visualize: {
      title: "Multiple hashes set multiple bits",
      description:
        "Insert sets k bit positions. Query checks the same positions. Any zero means the item was never inserted.",
      code: `def add(item):
    for h in hashes(item):
        bits[h % size] = 1

def might_contain(item):
    return all(bits[h % size] for h in hashes(item))`,
      steps: [
        {
          label: "Empty",
          state: "all bits are 0",
          note: "No item can be present yet.",
        },
        {
          label: "Insert x",
          state: "set k positions to 1",
          note: "Different items may share some bit positions.",
        },
        {
          label: "Query missing y",
          state: "one checked bit is 0",
          note: "That proves y was not inserted.",
        },
        {
          label: "Query z",
          state: "all checked bits are 1",
          note: "z is probably present, but the bits may come from other items.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Structure", "Answer", "Limit"],
      rows: [
        ["Set", "Exact membership", "High memory"],
        ["Bloom filter", "Probably present / definitely absent", "False positives"],
        ["Counting Bloom", "Allows deletion", "More space and counter overflow risk"],
        ["Cuckoo filter", "Membership plus deletion", "More complex"],
        ["HyperLogLog", "Distinct count estimate", "Not membership"],
      ],
      notes: [
        "Use Bloom filters only where false positives are acceptable or followed by exact verification.",
        "Do not use a Bloom filter for idempotent writes if false positives would drop real writes.",
        "Plan capacity; overfilling increases false positives.",
        "Use stable hashes, not Python's process-randomized hash(), when persistence matters.",
      ],
    },
    drill: [
      {
        prompt: "A filter says a key is absent. Can it be wrong?",
        answer:
          "No, assuming the item would have been inserted into this same filter. Bloom filters have no false negatives.",
      },
      {
        prompt:
          "A filter says a key is present. Can you skip the database write for an idempotent like?",
        answer:
          "No. A false positive would incorrectly skip a real write. Use exact membership for that workflow.",
      },
      {
        prompt:
          "You need to avoid disk reads for missing SSTable keys. Is a Bloom filter suitable?",
        answer:
          "Yes. A definitive 'absent' lets you skip the SSTable; a 'present' can fall through to exact lookup.",
      },
      {
        prompt: "You need deletion. What variant?",
        answer:
          "Use a counting Bloom filter or Cuckoo filter, depending on space and implementation needs.",
      },
    ],
    implement: {
      prompt:
        "Implement SimpleBloom with add(item) and __contains__(item). Use double hashing to generate k positions.",
      starterCode: `class SimpleBloom:
    def __init__(self, size, k):
        self.size = size
        self.k = k
        self.bits = [False] * size

    def add(self, item):
        pass

    def __contains__(self, item):
        pass`,
      tests: [
        "add('apple'); 'apple' in bf -> True",
        "empty filter; 'grape' in bf -> False",
        "add('apple'); 'banana' in bf -> False or True, both possible",
        "multiple inserted items remain queryable",
      ],
      notes: [
        "Use hashlib for stable hashes.",
        "Return all checked bits for membership.",
        "False positives are allowed; false negatives are not.",
      ],
    },
    scale: [
      {
        scale: "1K items",
        answer: "Tiny bit arrays are enough. This is a good in-memory prefilter.",
      },
      {
        scale: "1M items",
        answer: "Around 10 million bits is roughly 1.25 MB, before implementation overhead.",
      },
      {
        scale: "1B items",
        answer:
          "The bit array is still tractable as a binary blob, but updates and rebuilds need planning.",
      },
      {
        scale: "Distributed",
        answer:
          "Replicate read-heavy filters, or shard by hash. For mutable filters, coordinate updates carefully.",
      },
    ],
    patterns: {
      title: "Core Bloom filter pattern",
      code: `import hashlib

def hashes(item, size, k):
    data = str(item).encode()
    h1 = int(hashlib.md5(data).hexdigest(), 16)
    h2 = int(hashlib.sha1(data).hexdigest(), 16)
    for i in range(k):
        yield (h1 + i * h2) % size`,
    },
  },
  "advanced-consistent-hash": {
    id: "advanced-consistent-hash",
    moduleLabel: "Advanced",
    title: "Consistent Hashing",
    invariant:
      "Keys and nodes live on the same hash ring; adding or removing a node only remaps keys whose next clockwise node changes.",
    brief: {
      why: [
        "Reach for consistent hashing when keys must be distributed across changing nodes with minimal reshuffling.",
        "Naive modulo hashing remaps most keys when the node count changes. A ring remaps only the affected ranges.",
        "Virtual nodes smooth load imbalance by giving each physical node many positions on the ring.",
      ],
      costModel: [
        "Lookup is O(log V) with a sorted list of V virtual-node positions and binary search.",
        "Adding a physical node inserts its virtual nodes and moves only neighboring key ranges.",
        "Space is O(V) for the ring metadata.",
        "Replication usually means taking the next R distinct physical nodes clockwise.",
      ],
      realWorld: [
        "Distributed caches use consistent hashing to keep cache churn low during scale changes.",
        "Dynamo-style storage systems use ring ownership plus replication for availability.",
        "Load balancers and sharded services use virtual nodes to smooth uneven key distribution.",
      ],
    },
    visualize: {
      title: "Keys move only when their ring successor changes",
      description:
        "A key hashes to a ring position and belongs to the first node clockwise from that position.",
      code: `import bisect

def owner(ring, positions, key_hash):
    i = bisect.bisect_left(positions, key_hash)
    if i == len(positions):
        i = 0
    return ring[positions[i]]`,
      steps: [
        {
          label: "Hash nodes",
          state: "node positions on ring",
          note: "Virtual nodes place each physical node at several ring positions.",
        },
        {
          label: "Hash key",
          state: "key position",
          note: "The key does not know about node count.",
        },
        {
          label: "Walk clockwise",
          state: "first node >= key_hash",
          note: "That node owns the key.",
        },
        {
          label: "Add node",
          state: "only adjacent ranges move",
          note: "Most key successors stay unchanged.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Remap on node change", "Limit"],
      rows: [
        ["hash(key) % n", "Most keys", "Simple but disruptive"],
        ["Consistent hash ring", "Only affected ranges", "Needs ring metadata"],
        ["Rendezvous hashing", "Minimal movement", "Scores every node per lookup"],
        ["Range sharding", "Good range scans", "Hot ranges possible"],
        ["Directory service", "Explicit mapping", "Coordination overhead"],
      ],
      notes: [
        "Use virtual nodes to reduce load skew.",
        "Use replication across distinct physical nodes, not just adjacent virtual nodes from the same machine.",
        "Use stable hash functions; built-in Python hash is not stable across processes.",
        "Consistent hashing solves placement churn, not hot-key traffic by itself.",
      ],
    },
    drill: [
      {
        prompt: "Modulo sharding has 10 nodes and you add an 11th. What happens?",
        answer:
          "Most keys change owners because hash(key) % 10 and hash(key) % 11 disagree for most keys.",
      },
      {
        prompt: "Why add virtual nodes?",
        answer:
          "They smooth distribution by giving each physical node many chances to own ring ranges.",
      },
      {
        prompt: "A single key is extremely hot. Does consistent hashing fix it?",
        answer:
          "No. Placement is stable, but a hot key still overloads its owner unless replicated or specially handled.",
      },
      {
        prompt: "How do you choose replicas on a ring?",
        answer: "Walk clockwise and select the next distinct physical nodes.",
      },
    ],
    implement: {
      prompt:
        "Write get_node(positions, ring, key_hash), returning the node for key_hash. positions is sorted; ring maps position to node.",
      starterCode: `def get_node(positions, ring, key_hash):
    pass`,
      tests: [
        "positions=[10,30,70], key=20 -> ring[30]",
        "positions=[10,30,70], key=80 -> ring[10]",
        "positions=[10], key=5 -> ring[10]",
        "empty positions -> None",
      ],
      notes: [
        "Use bisect_left.",
        "Wrap to index 0 when key_hash is greater than every position.",
        "Return None for an empty ring.",
      ],
    },
    scale: [
      {
        scale: "10 nodes",
        answer: "A sorted list of virtual-node hashes is enough.",
      },
      {
        scale: "1K nodes",
        answer: "Use many virtual nodes per physical node and monitor load skew.",
      },
      {
        scale: "1M virtual nodes",
        answer:
          "Ring metadata and updates matter. Use compact arrays and staged membership changes.",
      },
      {
        scale: "Distributed",
        answer:
          "Membership must be agreed through gossip, consensus, or a control plane to avoid split-brain ownership.",
      },
    ],
    patterns: {
      title: "Core consistent hashing pattern",
      code: `import bisect

def get_node(positions, ring, key_hash):
    if not positions:
        return None
    i = bisect.bisect_left(positions, key_hash)
    if i == len(positions):
        i = 0
    return ring[positions[i]]`,
    },
  },
  "advanced-lsm": {
    id: "advanced-lsm",
    moduleLabel: "Advanced",
    title: "LSM Trees",
    invariant:
      "Writes append to an in-memory sorted memtable, flush to immutable sorted SSTables, and compaction merges sorted runs over time.",
    brief: {
      why: [
        "Reach for LSM-tree thinking when write throughput matters more than in-place update simplicity.",
        "The structure turns random writes into sequential appends and sorted flushes. Reads may consult multiple levels until compaction reduces overlap.",
        "Deletes are tombstones, not immediate removals. Compaction eventually discards old values and expired tombstones.",
      ],
      costModel: [
        "Writes are fast appends to a log plus memtable insert, often O(log M) inside the memtable.",
        "Memtable flush writes a sorted immutable SSTable.",
        "Reads check memtable first, then SSTables, often using Bloom filters to skip files.",
        "Compaction is background write amplification: the same data may be rewritten multiple times.",
      ],
      realWorld: [
        "RocksDB, LevelDB, Cassandra, and Bigtable use LSM-style storage engines.",
        "Time-series and event ingestion systems favor sequential write paths.",
        "SSTable Bloom filters avoid many unnecessary disk reads for absent keys.",
      ],
    },
    visualize: {
      title: "Writes flow from log to memtable to SSTables",
      description:
        "The write path is optimized for append and later merge. The read path checks newer structures before older ones.",
      code: `def put(key, value):
    wal.append((key, value))
    memtable[key] = value
    if memtable_too_large():
        flush_sorted_sstable(memtable)
        memtable.clear()`,
      steps: [
        {
          label: "Write WAL",
          state: "append key/value",
          note: "The write-ahead log protects against crashes.",
        },
        {
          label: "Update memtable",
          state: "sorted in-memory map",
          note: "Recent writes are queryable immediately.",
        },
        {
          label: "Flush",
          state: "immutable SSTable",
          note: "A full memtable becomes a sorted on-disk run.",
        },
        {
          label: "Compact",
          state: "merge sorted runs",
          note: "Compaction removes overwritten values and reduces read amplification.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Structure", "Write path", "Read tradeoff"],
      rows: [
        ["B-tree", "In-place page updates", "Fast point/range reads"],
        ["LSM tree", "Append and flush sorted runs", "May check multiple levels"],
        ["Hash index", "Fast point lookup", "Poor range scans"],
        ["Log only", "Very fast append", "Expensive lookup without index"],
        ["Column store", "Batch analytics", "Not ideal for point writes"],
      ],
      notes: [
        "LSM trees optimize write throughput by accepting compaction work later.",
        "Bloom filters reduce read amplification for point lookups.",
        "Leveled compaction lowers read amplification but increases write amplification.",
        "Size-tiered compaction has cheaper writes but can make reads check more files.",
      ],
    },
    drill: [
      {
        prompt: "Why does an LSM tree write fast?",
        answer:
          "It appends to a WAL and writes into memory, then flushes sorted runs sequentially instead of updating random disk pages.",
      },
      {
        prompt: "A key is deleted. What is written?",
        answer: "A tombstone marker. Compaction later removes old values covered by the tombstone.",
      },
      {
        prompt: "What problem do Bloom filters solve in an LSM read path?",
        answer: "They let the engine skip SSTables that definitely do not contain the queried key.",
      },
      {
        prompt: "What is write amplification?",
        answer: "The same logical data being rewritten multiple times during compaction.",
      },
    ],
    implement: {
      prompt:
        "Write merge_runs(runs), merging sorted key/value runs. Newer runs appear earlier in the input; keep the newest value for duplicate keys.",
      starterCode: `def merge_runs(runs):
    pass`,
      tests: [
        "runs=[[('a',2)], [('a',1),('b',1)]] -> [('a',2),('b',1)]",
        "runs=[[('b',3)], [('a',1),('c',1)]] -> [('a',1),('b',3),('c',1)]",
        "runs=[] -> []",
        "duplicate key in older run is ignored",
      ],
      notes: [
        "Track keys already emitted from newer runs.",
        "A production compactor does k-way merge; this exercise can collect then sort.",
        "Tombstones would be represented as special values and filtered at safe compaction levels.",
      ],
    },
    scale: [
      {
        scale: "1K writes",
        answer: "A dict plus periodic sorted flush is enough to understand the flow.",
      },
      {
        scale: "1M writes/sec",
        answer: "WAL throughput, memtable size, flush cadence, and compaction scheduling dominate.",
      },
      {
        scale: "1B keys",
        answer:
          "Leveling, Bloom filters, block indexes, compression, and compaction debt become core design concerns.",
      },
      {
        scale: "Distributed",
        answer:
          "Shard by key range or hash; each shard runs its own LSM engine with replication and repair around it.",
      },
    ],
    patterns: {
      title: "Core LSM patterns",
      code: `# Read newest to oldest
def get(key):
    if key in memtable:
        return memtable[key]
    for table in newest_to_oldest_sstables:
        if not table.bloom.might_contain(key):
            continue
        value = table.lookup(key)
        if value is not None:
            return value
    return None`,
    },
  },
};
