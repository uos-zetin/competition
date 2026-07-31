import { type SessionProvider,sessionStore } from "@/shared/api";

import { useAuthStore } from "./store.zustand";

const authSessionProvider: SessionProvider = {
  getSessionKey: (): string | null => useAuthStore.getState().sessionKey,
};

sessionStore.setSessionProvider(authSessionProvider);
