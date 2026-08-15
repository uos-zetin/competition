import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { AuthStore } from "./types";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      sessionKey: null,
      sessionExpiresAt: null,
      setSessionKey: (sessionKey) =>
        set((state) => {
          state.sessionKey = sessionKey;
          state.sessionExpiresAt = Date.now() + SESSION_TTL_MS;
        }),
      setAuth: (user, sessionKey) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
          state.sessionKey = sessionKey;
          state.sessionExpiresAt = Date.now() + SESSION_TTL_MS;
        }),
      clearAuth: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.sessionKey = null;
          state.sessionExpiresAt = null;
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
