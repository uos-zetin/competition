import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ParticipantRepository } from "../../api/types";
import { createParticipantService } from "../service";
import { useParticipantStore } from "../store.zustand";

const first = {
  id: "first",
  divisionId: "division-a",
  name: "첫째",
  teamName: "팀",
  robotName: "로봇",
  comment: "",
  orderRaw: 1,
  createdAt: new Date("2026-01-01"),
};
const second = {
  id: "second",
  divisionId: "division-a",
  name: "둘째",
  teamName: "팀",
  robotName: "로봇",
  comment: "",
  orderRaw: 2,
  createdAt: new Date("2026-01-02"),
};
const anotherDivision = { ...first, id: "other", divisionId: "division-b", orderRaw: 1 };

function createRepository(): ParticipantRepository {
  return {
    getParticipantsByDivision: vi.fn(),
    getParticipantById: vi.fn(),
    createParticipant: vi.fn(),
    updateParticipant: vi.fn(),
    deleteParticipant: vi.fn(),
  };
}

describe("createParticipantService", () => {
  beforeEach(() => useParticipantStore.getState().clearAll());

  it("retains another division while replacing the loaded division in order", async () => {
    const repository = createRepository();
    useParticipantStore.getState().add(anotherDivision);
    vi.mocked(repository.getParticipantsByDivision).mockResolvedValue([second, first]);
    await createParticipantService({ participantRepository: repository }).load("division-a");
    expect(useParticipantStore.getState().participants).toEqual([anotherDivision, first, second]);
  });

  it("parses forms and changes the matching store item", async () => {
    const repository = createRepository();
    const service = createParticipantService({ participantRepository: repository });
    vi.mocked(repository.createParticipant).mockResolvedValue(second);
    await service.admin.create({
      divisionId: "division-a",
      name: " 둘째 ",
      teamName: " 팀 ",
      robotName: " 로봇 ",
      comment: " ",
      orderRaw: 2,
    });
    expect(repository.createParticipant).toHaveBeenCalledWith({
      divisionId: "division-a",
      name: "둘째",
      teamName: "팀",
      robotName: "로봇",
      comment: "",
      orderRaw: 2,
    });
    const updated = { ...second, orderRaw: 1 };
    vi.mocked(repository.updateParticipant).mockResolvedValue(updated);
    await service.admin.update(updated);
    expect(useParticipantStore.getState().participants).toEqual([updated]);
    await service.admin.remove(updated.id);
    expect(useParticipantStore.getState().participants).toEqual([]);
  });
});
