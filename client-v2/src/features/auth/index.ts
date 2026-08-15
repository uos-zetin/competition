import "./model/session-provider";
import "./model/register-error-handler";

import type { LoginForm as LoginFormValue } from "./model/types";

export { authService } from "./model/auth-service";
export { LoginFormSchema } from "./model/schema";
export type { AuthService, AuthState } from "./model/types";
export type LoginForm = LoginFormValue;
export { useAdminAuthorization } from "./lib/use-admin-authorization";
export { AuthDebugWidget, LoginForm } from "./ui";
