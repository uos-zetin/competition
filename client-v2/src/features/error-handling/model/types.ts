export type ErrorDisplayType = "toast" | "modal";
export type ErrorActionType = "none" | "redirect";

export interface ErrorHandlingConfig {
  displayType: ErrorDisplayType;
  statusCode: number;
  title: string;
  message: string;
  description?: string;
  actionType: ErrorActionType;
  redirectPath?: string;
  clearAuth?: boolean;
}

export interface ErrorHandlingService {
  handle: (error: unknown, context?: string) => void;
}
