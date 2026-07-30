import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { sortByCreatedAtDesc } from "@/shared/lib";

import type { CompetitionStore } from "./types";

export const useCompetitionStore = create<CompetitionStore>()(
  immer((set) => ({
    competitions: [],
    init: (competitions) =>
      set((state) => {
        state.competitions = [...competitions].sort(sortByCreatedAtDesc);
      }),
    add: (competition) =>
      set((state) => {
        state.competitions = state.competitions.filter((item) => item.id !== competition.id);
        state.competitions.push(competition);
        state.competitions.sort(sortByCreatedAtDesc);
      }),
    update: (competition) =>
      set((state) => {
        const index = state.competitions.findIndex((item) => item.id === competition.id);
        if (index !== -1) {
          state.competitions[index] = competition;
          state.competitions.sort(sortByCreatedAtDesc);
        }
      }),
    remove: (competitionId) =>
      set((state) => {
        state.competitions = state.competitions.filter((item) => item.id !== competitionId);
      }),
    clearAll: () =>
      set((state) => {
        state.competitions = [];
      }),
  }))
);
