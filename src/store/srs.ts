import { create } from "zustand";
import type { SRSCard } from "@/api/types";

const BASE = "/api";

interface SRSState {
  cards: SRSCard[];
  loading: boolean;
  hydrate: () => Promise<void>;
  grade: (cardId: number, grade: number) => Promise<void>;
  dueCount: () => number;
}

export const useSRSStore = create<SRSState>((set, get) => ({
  cards: [],
  loading: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${BASE}/srs/due`);
      const data = await res.json();
      set({ cards: data.cards });
    } catch {
      // keep empty on error
    } finally {
      set({ loading: false });
    }
  },

  grade: async (cardId, grade) => {
    const res = await fetch(`${BASE}/srs/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: cardId, grade }),
    });
    if (!res.ok) return;

    // Remove graded card from view
    set((s) => ({ cards: s.cards.filter((c) => c.id !== cardId) }));
  },

  dueCount: () => get().cards.length,
}));

export function useReviewDueCount() {
  return useSRSStore((s) => s.cards.length);
}