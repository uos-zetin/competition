import { classifyError } from "../lib/error-classifier";

import type { ErrorHandlingConfig, ErrorHandlingService } from "./types";

interface ErrorHandlingDependencies {
  notify: (config: ErrorHandlingConfig) => void;
  openModal: (config: ErrorHandlingConfig) => void;
}

export function createErrorHandlingService({ notify, openModal }: ErrorHandlingDependencies): ErrorHandlingService {
  return {
    handle(error, context) {
      const config = classifyError(error);

      if (import.meta.env.DEV) {
        console.error(`[error-handling]${context ? ` ${context}` : ""}`, error);
      }

      if (config.displayType === "modal") {
        openModal(config);
        return;
      }

      notify(config);
    },
  };
}
