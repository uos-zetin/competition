import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { sortByCreatedAtDesc } from "@/shared/lib";

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
        state.records = state.records.filter((item) => item.id !== record.id);
        state.records.push(record);
        state.records.sort(sortByCreatedAtDesc);
      }),
    update: (record) =>
      set((state) => {
        const index = state.records.findIndex((item) => item.id === record.id);
        if (index !== -1) {
          state.records[index] = record;
          state.records.sort(sortByCreatedAtDesc);
        }
      }),
    remove: (recordId) =>
      set((state) => {
        state.records = state.records.filter((record) => record.id !== recordId);
      }),
    clearAll: () =>
      set((state) => {
        state.records = [];
      }),
  }))
);
