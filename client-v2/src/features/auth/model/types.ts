import type { User } from "@/entities/user";

export type LoginForm = {
  userName: string;
  password: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export interface AuthService {
  auth: {
    login(form: LoginForm): Promise<User>;
    logout(): Promise<void>;
    restoreSession(): Promise<User | null>;
  };
  session: {
    getSessionKey(): string | null;
  };
  debug: {
    switchToMockUser(user: User): void;
  };
  use: {
    auth(): AuthState;
  };
}

export interface AuthStore extends AuthState {
  sessionKey: string | null;
  sessionExpiresAt: number | null;
  setAuth(user: User, sessionKey: string): void;
  clearAuth(): void;
}
