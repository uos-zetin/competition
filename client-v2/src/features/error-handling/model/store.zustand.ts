import { create } from "zustand";

import type { ErrorHandlingConfig } from "./types";

interface ErrorModalStore {
  activeError: ErrorHandlingConfig | null;
  open: (config: ErrorHandlingConfig) => void;
  close: () => void;
  clearAll: () => void;
}

export const useErrorModalStore = create<ErrorModalStore>((set) => ({
  activeError: null,
  open: (config) => set({ activeError: config }),
  close: () => set({ activeError: null }),
  clearAll: () => set({ activeError: null }),
}));
