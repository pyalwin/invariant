import { create } from "zustand";

interface MockState {
  transcript: string;
  rubric: Record<string, boolean>;
  duration: number;
  startedAt: number | null;
  setTranscript: (t: string) => void;
  setRubricItem: (key: string, value: boolean) => void;
  startTimer: () => void;
  stopTimer: () => void;
  reset: () => void;
}

const RUBRIC_KEYS = [
  "constraints",
  "brute_force",
  "complexity",
  "edges",
  "tradeoff",
  "scale",
  "readable",
];

const RUBRIC_LABELS: Record<string, string> = {
  constraints: "Clarified constraints and edge cases before coding",
  brute_force: "Proposed brute-force before jumping to optimal",
  complexity: "Stated time and space complexity correctly",
  edges: "Handled edge cases in code",
  tradeoff: "Named the key tradeoff vs. a simpler approach",
  scale: "Explained what changes at scale",
  readable: "Code is readable without explanation",
};

const DEFAULT_RUBRIC = Object.fromEntries(RUBRIC_KEYS.map((k) => [k, false]));

export { RUBRIC_KEYS, RUBRIC_LABELS };

export const useMockStore = create<MockState>((set) => ({
  transcript: "",
  rubric: { ...DEFAULT_RUBRIC },
  duration: 0,
  startedAt: null,

  setTranscript: (t) => set({ transcript: t }),

  setRubricItem: (key, value) =>
    set((s) => ({ rubric: { ...s.rubric, [key]: value } })),

  startTimer: () => set({ startedAt: Date.now() }),

  stopTimer: () =>
    set((s) => {
      if (!s.startedAt) return {};
      return { duration: Math.floor((Date.now() - s.startedAt) / 1000) };
    }),

  reset: () =>
    set({ transcript: "", rubric: { ...DEFAULT_RUBRIC }, duration: 0, startedAt: null }),
}));