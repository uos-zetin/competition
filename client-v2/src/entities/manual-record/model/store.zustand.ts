import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { ManualRecordStore } from "./types";

function sortByCreatedAtAsc(manualRecords: { createdAt: Date }[]) {
  manualRecords.sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
}

export const useManualRecordStore = create<ManualRecordStore>()(
  immer((set) => ({
    manualRecords: [],
    setByParticipant: (participantId, manualRecords) =>
      set((state) => {
        state.manualRecords = state.manualRecords.filter((manualRecord) => manualRecord.participantId !== participantId);
        state.manualRecords.push(...manualRecords);
        sortByCreatedAtAsc(state.manualRecords);
      }),
    add: (manualRecord) =>
      set((state) => {
        state.manualRecords = state.manualRecords.filter((item) => item.id !== manualRecord.id);
        state.manualRecords.push(manualRecord);
        sortByCreatedAtAsc(state.manualRecords);
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
