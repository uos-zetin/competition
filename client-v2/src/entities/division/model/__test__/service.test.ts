import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DivisionRepository } from "../../api/types";
import { createDivisionService } from "../service";
import { useDivisionStore } from "../store.zustand";

const oldest = {
  id: "old",
  competitionId: "competition-1",
  name: "오래된 부문",
  description: "",
  createdAt: new Date("2026-01-01"),
  status: "ready" as const,
  timeLimit: 90,
};
const newest = {
  id: "new",
  competitionId: "competition-1",
  name: "새 부문",
  description: "",
  createdAt: new Date("2026-02-01"),
  status: "ongoing" as const,
  timeLimit: 180,
};

function createRepository(): DivisionRepository {
  return {
    getAllDivisions: vi.fn(),
    getDivisionById: vi.fn(),
    createDivision: vi.fn(),
    updateDivision: vi.fn(),
    deleteDivision: vi.fn(),
  };
}

describe("createDivisionService", () => {
  beforeEach(() => useDivisionStore.getState().clearAll());

  it("loads a competition's divisions into the store in created-at descending order", async () => {
    const repository = createRepository();
    vi.mocked(repository.getAllDivisions).mockResolvedValue([oldest, newest]);
    await createDivisionService({ divisionRepository: repository }).load("competition-1");
    expect(useDivisionStore.getState().divisions).toEqual([newest, oldest]);
  });

  it("loads a division by id and adds it to the store", async () => {
    const repository = createRepository();
    vi.mocked(repository.getDivisionById).mockResolvedValue(newest);

    await expect(createDivisionService({ divisionRepository: repository }).loadById(newest.id)).resolves.toEqual(newest);

    expect(repository.getDivisionById).toHaveBeenCalledWith(newest.id);
    expect(useDivisionStore.getState().divisions).toEqual([newest]);
  });

  it("creates, updates, and removes the matching store item", async () => {
    const repository = createRepository();
    const service = createDivisionService({ divisionRepository: repository });
    vi.mocked(repository.createDivision).mockResolvedValue(newest);
    await service.admin.create("competition-1", { name: " 새 부문 ", description: " ", timeLimit: 180 });
    expect(repository.createDivision).toHaveBeenCalledWith("competition-1", {
      name: "새 부문",
      description: "",
      timeLimit: 180,
    });
    expect(useDivisionStore.getState().divisions).toEqual([newest]);
    const updated = { ...newest, name: "수정된 부문", timeLimit: 90 };
    vi.mocked(repository.updateDivision).mockResolvedValue(updated);
    await service.admin.update(newest, { name: "수정된 부문", description: "", timeLimit: 90 });
    expect(repository.updateDivision).toHaveBeenCalledWith(updated);
    expect(useDivisionStore.getState().divisions).toEqual([updated]);
    await service.admin.remove(updated.id);
    expect(repository.deleteDivision).toHaveBeenCalledWith(updated.id);
    expect(useDivisionStore.getState().divisions).toEqual([]);
  });

  it("throws without changing the store when the repository cannot find an update target", async () => {
    const repository = createRepository();
    const service = createDivisionService({ divisionRepository: repository });
    useDivisionStore.getState().add(oldest);
    vi.mocked(repository.updateDivision).mockResolvedValue(null);
    await expect(service.admin.update(oldest, { name: "수정", description: "", timeLimit: 90 })).rejects.toThrow(
      "Division not found: old"
    );
    expect(useDivisionStore.getState().divisions).toEqual([oldest]);
  });

  it("does not change the store when a repository call rejects", async () => {
    const repository = createRepository();
    const service = createDivisionService({ divisionRepository: repository });
    useDivisionStore.getState().add(oldest);
    vi.mocked(repository.createDivision).mockRejectedValue(new Error("failed"));
    await expect(
      service.admin.create("competition-1", { name: "새 부문", description: "", timeLimit: 90 })
    ).rejects.toThrow("failed");
    expect(useDivisionStore.getState().divisions).toEqual([oldest]);
  });
});
