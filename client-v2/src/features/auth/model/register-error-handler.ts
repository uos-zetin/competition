// Error handling is the architecture's designated cross-cutting feature exception.
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-cross-slice-dependency
import { setAuthExpiredHandler } from "@/features/error-handling";

import { useAuthStore } from "./store.zustand";

setAuthExpiredHandler(() => useAuthStore.getState().clearAuth());
