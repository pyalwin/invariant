import type { LinearStudyPlan } from "@/content/linearStudyPlans";

export const stringStudyPlans: Record<string, LinearStudyPlan> = {
  "strings-kmp": {
    id: "strings-kmp",
    moduleLabel: "Strings",
    title: "KMP",
    invariant:
      "lps[i] stores the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i].",
    brief: {
      why: [
        "Reach for KMP when you need exact substring search in O(n + m) time and cannot afford restarting the pattern scan after every mismatch.",
        "The idea is to precompute how much of the pattern can be reused after a mismatch. The text index never moves backward.",
        "The hard part is not the search loop; it is trusting the LPS invariant and using it to decide the next pattern index.",
      ],
      costModel: [
        "Building the LPS table is O(m), where m is pattern length.",
        "Searching the text is O(n), where n is text length.",
        "Space is O(m) for the LPS table.",
        "Python's 'in' and str.find are C-optimized and usually faster in production; KMP matters when explaining the algorithm or controlling matching logic.",
      ],
      realWorld: [
        "Text editors and search tools rely on linear-time string matching families.",
        "Network intrusion detection scans streams for known signatures.",
        "Bioinformatics sequence matching uses prefix-function ideas in larger exact and approximate matching pipelines.",
      ],
    },
    visualize: {
      title: "A mismatch reuses the longest valid border",
      description:
        "When pattern[j] mismatches text[i], LPS tells us the next j that preserves the already matched suffix.",
      code: `def build_lps(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            i += 1
    return lps`,
      steps: [
        {
          label: "Compare",
          state: "pattern[i] vs pattern[length]",
          note: "length is the current candidate border length.",
        },
        {
          label: "Match",
          state: "lps[i] = length + 1",
          note: "The known border extends by one character.",
        },
        {
          label: "Mismatch with border",
          state: "length = lps[length - 1]",
          note: "Try the next smaller border without moving i backward.",
        },
        {
          label: "Mismatch with no border",
          state: "lps[i] = 0",
          note: "No prefix can be reused for this position.",
        },
      ],
    },
    tradeoffs: {
      columns: ["Approach", "Best for", "Limit"],
      rows: [
        ["Naive search", "Small inputs, simple code", "Worst-case O(nm)"],
        ["KMP", "Exact search with linear guarantee", "More complex preprocessing"],
        ["Rabin-Karp", "Many patterns or rolling hash", "Hash collisions must be handled"],
        ["Boyer-Moore", "Fast practical single-pattern search", "Worst-case details are complex"],
        ["Trie/Aho-Corasick", "Many exact patterns", "Higher memory and build cost"],
      ],
      notes: [
        "Use KMP when you need a deterministic linear-time explanation.",
        "For one-off Python production search, prefer str.find unless custom matching is required.",
        "LPS values are lengths, not indexes.",
        "After a full match, set j = lps[j - 1] to find overlapping matches.",
      ],
    },
    drill: [
      {
        prompt: "Text is 'aaaaaaaaab' and pattern is 'aaaab'. Why can naive search be bad?",
        answer:
          "It repeatedly rechecks almost the same prefix. KMP reuses border information and keeps total work linear.",
      },
      {
        prompt: "What does lps[i] represent?",
        answer:
          "The longest proper prefix of pattern[0..i] that is also a suffix of that same substring.",
      },
      {
        prompt: "After a mismatch at pattern index j, where does KMP move j?",
        answer: "To lps[j - 1], preserving the longest reusable matched suffix.",
      },
      {
        prompt: "How do you find overlapping matches?",
        answer: "After reporting a match, set j = lps[j - 1] instead of resetting j to zero.",
      },
    ],
    implement: {
      prompt:
        "Write kmp_search(text, pattern), returning the start indexes of every match, including overlapping matches.",
      starterCode: `def kmp_search(text, pattern):
    pass`,
      tests: [
        "text='abababa', pattern='aba' -> [0, 2, 4]",
        "text='hello', pattern='ll' -> [2]",
        "text='aaaa', pattern='aa' -> [0, 1, 2]",
        "empty pattern -> []",
      ],
      notes: [
        "Build the LPS table first.",
        "Advance i through text exactly once.",
        "When j reaches len(pattern), record i - j and reset j using LPS.",
      ],
    },
    scale: [
      {
        scale: "1K characters",
        answer:
          "Naive search may be fine, but KMP is still straightforward once LPS is implemented.",
      },
      {
        scale: "1M characters",
        answer: "KMP's O(n + m) guarantee matters when worst-case repeated prefixes are possible.",
      },
      {
        scale: "1B characters",
        answer: "Stream chunks and carry the current pattern index across chunk boundaries.",
      },
      {
        scale: "Distributed",
        answer:
          "Shard text with overlap of pattern_length - 1 at boundaries, or use a streaming matcher per partition.",
      },
    ],
    patterns: {
      title: "Core KMP pattern",
      code: `lps = build_lps(pattern)
i = j = 0
matches = []
while i < len(text):
    if text[i] == pattern[j]:
        i += 1
        j += 1
        if j == len(pattern):
            matches.append(i - j)
            j = lps[j - 1]
    elif j:
        j = lps[j - 1]
    else:
        i += 1`,
    },
  },
};
