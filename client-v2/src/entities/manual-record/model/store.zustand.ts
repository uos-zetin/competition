import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { sortByCreatedAtAsc, upsertSorted } from "@/shared/lib";

import type { ManualRecordStore } from "./types";

export const useManualRecordStore = create<ManualRecordStore>()(
  immer((set) => ({
    manualRecords: [],
    setByParticipant: (participantId, manualRecords) =>
      set((state) => {
        state.manualRecords = state.manualRecords.filter((manualRecord) => manualRecord.participantId !== participantId);
        state.manualRecords.push(...manualRecords);
        state.manualRecords.sort(sortByCreatedAtAsc);
      }),
    add: (manualRecord) =>
      set((state) => {
        state.manualRecords = upsertSorted(state.manualRecords, manualRecord, sortByCreatedAtAsc);
      }),
    removeByParticipant: (participantId) =>
      set((state) => {
        state.manualRecords = state.manualRecords.filter((manualRecord) => manualRecord.participantId !== participantId);
      }),
    clearAll: () =>
      set((state) => {
        state.manualRecords = [];
      }),
  }))
);
