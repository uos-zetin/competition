import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CompetitionRepository } from "../../api/types";
import { createCompetitionService } from "../service";
import { useCompetitionStore } from "../store.zustand";

const oldest = { id: "old", name: "오래된 대회", description: "", createdAt: new Date("2026-01-01") };
const newest = { id: "new", name: "새 대회", description: "", createdAt: new Date("2026-02-01") };

function createRepository(): CompetitionRepository {
  return {
    getAllCompetitions: vi.fn(),
    getCompetitionById: vi.fn(),
    createCompetition: vi.fn(),
    updateCompetition: vi.fn(),
    deleteCompetition: vi.fn(),
  };
}

describe("createCompetitionService", () => {
  beforeEach(() => useCompetitionStore.getState().clearAll());

  it("loads repository data into the store in created-at descending order", async () => {
    const repository = createRepository();
    vi.mocked(repository.getAllCompetitions).mockResolvedValue([oldest, newest]);
    await createCompetitionService({ competitionRepository: repository }).load();
    expect(useCompetitionStore.getState().competitions).toEqual([newest, oldest]);
  });

  it("creates, updates, and removes the matching store item", async () => {
    const repository = createRepository();
    const service = createCompetitionService({ competitionRepository: repository });
    vi.mocked(repository.createCompetition).mockResolvedValue(newest);
    await service.admin.create({ name: " 새 대회 ", description: " " });
    expect(repository.createCompetition).toHaveBeenCalledWith({ name: "새 대회", description: "" });
    expect(useCompetitionStore.getState().competitions).toEqual([newest]);

    const updated = { ...newest, name: "수정된 대회" };
    vi.mocked(repository.updateCompetition).mockResolvedValue(updated);
    await service.admin.update(updated);
    expect(repository.updateCompetition).toHaveBeenCalledWith(updated);
    expect(useCompetitionStore.getState().competitions).toEqual([updated]);

    await service.admin.remove(updated.id);
    expect(repository.deleteCompetition).toHaveBeenCalledWith(updated.id);
    expect(useCompetitionStore.getState().competitions).toEqual([]);
  });

  it("does not change the store when a repository call rejects", async () => {
    const repository = createRepository();
    const service = createCompetitionService({ competitionRepository: repository });
    useCompetitionStore.getState().add(oldest);
    vi.mocked(repository.createCompetition).mockRejectedValue(new Error("failed"));
    await expect(service.admin.create({ name: "새 대회", description: "" })).rejects.toThrow("failed");
    expect(useCompetitionStore.getState().competitions).toEqual([oldest]);
  });
});
