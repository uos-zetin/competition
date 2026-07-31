import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { CounterStore } from "./types";

export const useCounterStore = create<CounterStore>()(
  immer((set) => ({
    counters: [],
    init: (counters) => set((state) => { state.counters = counters; }),
    add: (counter) => set((state) => {
      state.counters = state.counters.filter((item) => item.id !== counter.id);
      state.counters.push(counter);
    }),
    update: (counter) => set((state) => {
      const index = state.counters.findIndex((item) => item.id === counter.id);
      if (index !== -1) state.counters[index] = counter;
    }),
    remove: (counterId) => set((state) => { state.counters = state.counters.filter((item) => item.id !== counterId); }),
    clearAll: () => set((state) => { state.counters = []; }),
    start: (counterId, startedAt) => set((state) => {
      state.counters = state.counters.map((counter) =>
        counter.id === counterId ? { ...counter, startedAt, stoppedAt: null } : counter
      );
    }),
    stop: (counterId, stoppedAt) => set((state) => {
      state.counters = state.counters.map((counter) => counter.id === counterId ? { ...counter, stoppedAt } : counter);
    }),
    reset: (counterId) => set((state) => {
      state.counters = state.counters.map((counter) =>
        counter.id === counterId ? { ...counter, startedAt: null, stoppedAt: null } : counter
      );
    }),
  }))
);
