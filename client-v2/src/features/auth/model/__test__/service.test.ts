import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthenticationError } from "@/shared/api";
import { type User,userService } from "@/entities/user";

import type { AuthRepository } from "../../api/types";
import { createAuthService } from "../service";
import { useAuthStore } from "../store.zustand";

vi.mock("@/entities/user", () => ({
  userService: {
    load: {
      currentUser: vi.fn(),
    },
  },
}));

const kim: User = { id: "user-kim", name: "김재현", roles: ["administrator"], createdAt: new Date("2026-01-01") };

function createRepository(): AuthRepository {
  return { login: vi.fn(), logout: vi.fn() };
}

describe("createAuthService", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    vi.mocked(userService.load.currentUser).mockReset();
  });

  it("stores and returns the current user after login", async () => {
    const repository = createRepository();
    vi.mocked(repository.login).mockResolvedValue("session-1");
    vi.mocked(userService.load.currentUser).mockResolvedValue(kim);

    await expect(createAuthService({ authRepository: repository }).auth.login({ userName: "kim.jaehyun", password: "password" })).resolves.toEqual(kim);
    expect(useAuthStore.getState()).toMatchObject({ user: kim, isAuthenticated: true, sessionKey: "session-1" });
  });

  it("clears the store when login fails", async () => {
    const repository = createRepository();
    useAuthStore.getState().setAuth(kim, "old-session");
    vi.mocked(repository.login).mockRejectedValue(new AuthenticationError());

    await expect(createAuthService({ authRepository: repository }).auth.login({ userName: "bad", password: "password" })).rejects.toBeInstanceOf(AuthenticationError);
    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false, sessionKey: null });
  });

  it("clears the store even when logout request fails", async () => {
    const repository = createRepository();
    useAuthStore.getState().setAuth(kim, "session-1");
    vi.mocked(repository.logout).mockRejectedValue(new Error("network failed"));

    await createAuthService({ authRepository: repository }).auth.logout();

    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false, sessionKey: null });
  });

  it("does not validate when no session is persisted", async () => {
    const repository = createRepository();

    await expect(createAuthService({ authRepository: repository }).auth.restoreSession()).resolves.toBeNull();
    expect(userService.load.currentUser).not.toHaveBeenCalled();
  });

  it("clears a stale session when current user validation fails", async () => {
    const repository = createRepository();
    useAuthStore.getState().setAuth(kim, "stale-session");
    vi.mocked(userService.load.currentUser).mockRejectedValue(new AuthenticationError());

    await expect(createAuthService({ authRepository: repository }).auth.restoreSession()).resolves.toBeNull();
    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false, sessionKey: null });
  });

  it("clears an expired session without validating the current user", async () => {
    const repository = createRepository();
    useAuthStore.getState().setAuth(kim, "expired-session");
    useAuthStore.setState({ sessionExpiresAt: Date.now() - 1 });

    await expect(createAuthService({ authRepository: repository }).auth.restoreSession()).resolves.toBeNull();

    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false, sessionKey: null, sessionExpiresAt: null });
    expect(userService.load.currentUser).not.toHaveBeenCalled();
  });

  it("switches mock users without invoking the repository", () => {
    const repository = createRepository();

    createAuthService({ authRepository: repository }).debug.switchToMockUser(kim);

    expect(useAuthStore.getState()).toMatchObject({ user: kim, isAuthenticated: true, sessionKey: "mock-session-user-kim" });
    expect(repository.login).not.toHaveBeenCalled();
    expect(repository.logout).not.toHaveBeenCalled();
  });
});
