import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { removeById, sortByCreatedAtDesc, upsertSorted } from "@/shared/lib";

import type { DivisionStore } from "./types";

export const useDivisionStore = create<DivisionStore>()(
  immer((set) => ({
    divisions: [],
    init: (divisions) =>
      set((state) => {
        state.divisions = [...divisions].sort(sortByCreatedAtDesc);
      }),
    setByCompetition: (competitionId, divisions) =>
      set((state) => {
        state.divisions = state.divisions.filter((division) => division.competitionId !== competitionId);
        state.divisions.push(...divisions);
        state.divisions.sort(sortByCreatedAtDesc);
      }),
    add: (division) =>
      set((state) => {
        state.divisions = upsertSorted(state.divisions, division, sortByCreatedAtDesc);
      }),
    update: (division) =>
      set((state) => {
        if (!state.divisions.some((item) => item.id === division.id)) return;
        state.divisions = upsertSorted(state.divisions, division, sortByCreatedAtDesc);
      }),
    remove: (divisionId) =>
      set((state) => {
        state.divisions = removeById(state.divisions, divisionId);
      }),
    clearAll: () =>
      set((state) => {
        state.divisions = [];
      }),
  }))
);
