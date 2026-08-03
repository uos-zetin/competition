import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { ProgressStore } from "./types";

export const useProgressStore = create<ProgressStore>()(immer((set) => ({
  progress: null,
  setProgress: (progress) => set((state) => { state.progress = progress; }),
  patchProgress: (progress) => set((state) => { if (state.progress) Object.assign(state.progress, progress); }),
  reset: () => set((state) => { state.progress = null; }),
})));
