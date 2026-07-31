import { toast } from "sonner";

import { createErrorHandlingService } from "./service";
import { useErrorModalStore } from "./store.zustand";

export { runAuthExpiredHandler, setAuthExpiredHandler } from "./auth-redirect";
export { useErrorModalStore } from "./store.zustand";
export type { ErrorActionType, ErrorDisplayType, ErrorHandlingConfig, ErrorHandlingService } from "./types";

export const errorHandlingService = createErrorHandlingService({
  notify: (config) => {
    toast.error(config.message, { description: config.description, duration: 5000 });
  },
  openModal: (config) => useErrorModalStore.getState().open(config),
});
