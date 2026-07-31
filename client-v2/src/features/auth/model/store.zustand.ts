import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { AuthStore } from "./types";

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      sessionKey: null,
      setAuth: (user, sessionKey) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
          state.sessionKey = sessionKey;
        }),
      clearAuth: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.sessionKey = null;
        }),
    })),
    {
      name: "auth-store",
      storage: createJSONStorage(() => {
        if (typeof localStorage === "undefined" || !localStorage) throw new Error("localStorage is unavailable");
        return localStorage;
      }),
    }
  )
);
