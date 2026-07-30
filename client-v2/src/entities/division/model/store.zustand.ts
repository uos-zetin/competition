import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { sortByCreatedAtDesc } from "@/shared/lib";

import type { DivisionStore } from "./types";

export const useDivisionStore = create<DivisionStore>()(
  immer((set) => ({
    divisions: [],
    init: (divisions) =>
      set((state) => {
        state.divisions = [...divisions].sort(sortByCreatedAtDesc);
      }),
    add: (division) =>
      set((state) => {
        state.divisions = state.divisions.filter((item) => item.id !== division.id);
        state.divisions.push(division);
        state.divisions.sort(sortByCreatedAtDesc);
      }),
    update: (division) =>
      set((state) => {
        const index = state.divisions.findIndex((item) => item.id === division.id);
        if (index !== -1) {
          state.divisions[index] = division;
          state.divisions.sort(sortByCreatedAtDesc);
        }
      }),
    remove: (divisionId) =>
      set((state) => {
        state.divisions = state.divisions.filter((item) => item.id !== divisionId);
      }),
    clearAll: () =>
      set((state) => {
        state.divisions = [];
      }),
  }))
);
