import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { removeById, sortByCreatedAtDesc, upsertSorted } from "@/shared/lib";

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
        state.competitions = upsertSorted(state.competitions, competition, sortByCreatedAtDesc);
      }),
    update: (competition) =>
      set((state) => {
        if (!state.competitions.some((item) => item.id === competition.id)) return;
        state.competitions = upsertSorted(state.competitions, competition, sortByCreatedAtDesc);
      }),
    remove: (competitionId) =>
      set((state) => {
        state.competitions = removeById(state.competitions, competitionId);
      }),
    clearAll: () =>
      set((state) => {
        state.competitions = [];
      }),
  }))
);
