import { create } from "zustand";
import { fetchProgress, putProgress } from "@/api/client";
import type { ProgressTopic } from "@/api/types";

interface ProgressState {
  topics: Record<string, ProgressTopic[]>;
  loading: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  markStep: (topicId: string, step: string) => Promise<void>;
  isCompleted: (topicId: string, step: string) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  topics: {},
  loading: false,
  hydrated: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      const data = await fetchProgress();
      set({ topics: data.topics, hydrated: true });
    } catch {
      // Keep empty state on error — will retry on next navigation
    } finally {
      set({ loading: false });
    }
  },

  markStep: async (topicId, step) => {
    // Optimistic update
    set((s) => {
      const topicSteps = s.topics[topicId] ?? [];
      // Don't duplicate if step already recorded
      if (topicSteps.some((t) => t.step === step)) return s;
      return {
        topics: {
          ...s.topics,
          [topicId]: [...topicSteps, { step, completed_at: Math.floor(Date.now() / 1000) }],
        },
      };
    });
    try {
      await putProgress(topicId, step);
    } catch {
      // best-effort — step is still marked locally
    }
  },

  isCompleted: (topicId, step) => {
    const steps = get().topics[topicId] ?? [];
    return steps.some((t) => t.step === step);
  },
}));

export const TOTAL_STEPS = 6;