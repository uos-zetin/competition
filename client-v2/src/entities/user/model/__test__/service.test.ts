import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserRepository } from "../../api/types";
import { createUserService } from "../service";
import { useUserStore } from "../store.zustand";
import type { User } from "../types";

const kim: User = { id: "kim", name: "김재현", roles: ["administrator"], createdAt: new Date("2026-01-01") };
const lee: User = { id: "lee", name: "이수아", roles: ["manualRecorder"], createdAt: new Date("2026-02-01") };

function createRepository(): UserRepository {
  return {
    getAllUsers: vi.fn(),
    getCurrentUser: vi.fn(),
    createUser: vi.fn(),
    updateRoles: vi.fn(),
    deleteUser: vi.fn(),
  };
}

describe("createUserService", () => {
  beforeEach(() => useUserStore.getState().clearAll());

  it("loads users into the store in name order", async () => {
    const repository = createRepository();
    vi.mocked(repository.getAllUsers).mockResolvedValue([lee, kim]);

    await createUserService({ userRepository: repository }).load.all();

    expect(useUserStore.getState().users).toEqual([kim, lee]);
  });

  it("creates, updates roles, and removes the matching store item", async () => {
    const repository = createRepository();
    const service = createUserService({ userRepository: repository });
    vi.mocked(repository.createUser).mockResolvedValue(lee);

    await service.admin.create({ name: " 이수아 ", username: " sua ", password: "secret1" });
    expect(repository.createUser).toHaveBeenCalledWith({ name: "이수아", username: "sua", password: "secret1" });
    expect(useUserStore.getState().users).toEqual([lee]);

    const updated: User = { ...lee, roles: ["manualRecorder", "stopwatchRecorder"] };
    vi.mocked(repository.updateRoles).mockResolvedValue(updated);
    await service.admin.updateRoles(lee.id, updated.roles);
    expect(repository.updateRoles).toHaveBeenCalledWith(lee.id, updated.roles);
    expect(useUserStore.getState().users).toEqual([updated]);

    await service.admin.remove(lee.id);
    expect(repository.deleteUser).toHaveBeenCalledWith(lee.id);
    expect(useUserStore.getState().users).toEqual([]);
  });

  it("does not change the store when a repository call rejects", async () => {
    const repository = createRepository();
    const service = createUserService({ userRepository: repository });
    useUserStore.getState().add(kim);
    vi.mocked(repository.updateRoles).mockRejectedValue(new Error("failed"));

    await expect(service.admin.updateRoles(kim.id, ["manualRecorder"])).rejects.toThrow("failed");

    expect(useUserStore.getState().users).toEqual([kim]);
  });
});
