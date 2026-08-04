import { type User, userService } from "@/entities/user";

import type { AuthRepository } from "../api/types";

import { useAuthStore } from "./store.zustand";
import type { AuthService, LoginForm } from "./types";

export function createAuthService({ authRepository }: { authRepository: AuthRepository }): AuthService {
  const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return { user, isAuthenticated };
  };

  return {
    auth: {
      login: async (form: LoginForm): Promise<User> => {
        try {
          const sessionKey = await authRepository.login(form);
          const user = await userService.load.currentUser();
          if (!user) throw new Error("현재 사용자를 찾을 수 없습니다.");
          useAuthStore.getState().setAuth(user, sessionKey);
          return user;
        } catch (error) {
          useAuthStore.getState().clearAuth();
          throw error;
        }
      },
      logout: async (): Promise<void> => {
        try {
          await authRepository.logout();
        } catch (error) {
          console.warn("로그아웃 요청에 실패했습니다.", error);
        } finally {
          useAuthStore.getState().clearAuth();
        }
      },
      restoreSession: async (): Promise<User | null> => {
        const { sessionKey, sessionExpiresAt } = useAuthStore.getState();
        if (!sessionKey) return null;
        if (sessionExpiresAt !== null && Date.now() > sessionExpiresAt) {
          useAuthStore.getState().clearAuth();
          return null;
        }
        try {
          const user = await userService.load.currentUser();
          if (!user) throw new Error("현재 사용자를 찾을 수 없습니다.");
          useAuthStore.getState().setAuth(user, sessionKey);
          return user;
        } catch {
          useAuthStore.getState().clearAuth();
          return null;
        }
      },
    },
    session: {
      getSessionKey: (): string | null => useAuthStore.getState().sessionKey,
    },
    debug: {
      switchToMockUser: (user: User): void => {
        useAuthStore.getState().setAuth(user, `mock-session-${user.id}`);
      },
    },
    use: {
      auth: useAuth,
    },
  };
}
