import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { removeById, sortByCreatedAtDesc, upsertSorted } from "@/shared/lib";

import type { RecordStore } from "./types";

export const useRecordStore = create<RecordStore>()(
  immer((set) => ({
    records: [],
    init: (records) =>
      set((state) => {
        state.records = [...records].sort(sortByCreatedAtDesc);
      }),
    addMany: (records) =>
      set((state) => {
        const recordIds = new Set(records.map((record) => record.id));
        state.records = state.records.filter((record) => !recordIds.has(record.id));
        state.records.push(...records);
        state.records.sort(sortByCreatedAtDesc);
      }),
    add: (record) =>
      set((state) => {
        state.records = upsertSorted(state.records, record, sortByCreatedAtDesc);
      }),
    update: (record) =>
      set((state) => {
        if (!state.records.some((item) => item.id === record.id)) return;
        state.records = upsertSorted(state.records, record, sortByCreatedAtDesc);
      }),
    remove: (recordId) =>
      set((state) => {
        state.records = removeById(state.records, recordId);
      }),
    clearAll: () =>
      set((state) => {
        state.records = [];
      }),
  }))
);
