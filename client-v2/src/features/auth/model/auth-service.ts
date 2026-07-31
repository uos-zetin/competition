import { authRepository } from "../api";

import { createAuthService } from "./service";

export const authService = createAuthService({ authRepository });
