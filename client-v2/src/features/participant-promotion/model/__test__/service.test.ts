import { describe, expect, it, vi } from "vitest";

import type { Division } from "@/entities/division";

import { createParticipantPromotionService } from "../service";
import type { PromotionSourceParticipant } from "../types";

const sources: PromotionSourceParticipant[] = [
  {
    participant: {
      id: "source-1",
      divisionId: "qualifying",
      name: "가",
      teamName: "A팀",
      robotName: "로봇 A",
      comment: "",
      orderRaw: 3,
      createdAt: new Date(),
    },
    orderRaw: 2,
  },
  {
    participant: {
      id: "source-2",
      divisionId: "qualifying",
      name: "나",
      teamName: "B팀",
      robotName: "로봇 B",
      comment: "메모",
      orderRaw: 8,
      createdAt: new Date(),
    },
    orderRaw: 1,
  },
];
const division: Division = {
  id: "final",
  competitionId: "competition",
  name: "결승",
  description: "",
  timeLimit: 90,
  status: "ready",
  createdAt: new Date(),
};

function fixture() {
  const divisionService = { admin: { create: vi.fn().mockResolvedValue(division) } };
  const participantService = {
    admin: {
      create: vi
        .fn()
        .mockImplementation(async (form) => ({ id: `new-${form.orderRaw}`, ...form, createdAt: new Date() })),
    },
  };
  return {
    divisionService,
    participantService,
    service: createParticipantPromotionService({ divisionService, participantService }),
  };
}

describe("createParticipantPromotionService", () => {
  it("creates a division then copies participants with their supplied orders", async () => {
    const { service, divisionService, participantService } = fixture();

    const result = await service.run({
      competitionId: "competition",
      newDivision: { name: "결승", description: "", timeLimit: 90 },
      sourceParticipants: sources,
    });

    expect(result.division).toMatchObject({ status: "success", data: division });
    expect(divisionService.admin.create).toHaveBeenCalledWith("competition", {
      name: "결승",
      description: "",
      timeLimit: 90,
    });
    expect(participantService.admin.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ divisionId: "final", name: "가", orderRaw: 2 })
    );
    expect(participantService.admin.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ divisionId: "final", name: "나", orderRaw: 1 })
    );
  });

  it("skips every participant when division creation fails", async () => {
    const { service, divisionService, participantService } = fixture();
    divisionService.admin.create.mockRejectedValueOnce(new Error("duplicate division"));

    const result = await service.run({
      competitionId: "competition",
      newDivision: { name: "결승", description: "", timeLimit: 90 },
      sourceParticipants: sources,
    });

    expect(result.division).toMatchObject({ status: "failed", error: "duplicate division" });
    expect(result.participants.map((item) => item.outcome)).toEqual([
      { status: "skipped", reason: "부문 생성에 실패했습니다" },
      { status: "skipped", reason: "부문 생성에 실패했습니다" },
    ]);
    expect(participantService.admin.create).not.toHaveBeenCalled();
  });

  it("keeps successful copies when one participant creation fails", async () => {
    const { service, participantService } = fixture();
    participantService.admin.create.mockRejectedValueOnce(new Error("temporary failure"));

    const result = await service.run({
      competitionId: "competition",
      newDivision: { name: "결승", description: "", timeLimit: 90 },
      sourceParticipants: sources,
    });

    expect(result.participants[0].outcome).toMatchObject({ status: "failed", error: "temporary failure" });
    expect(result.participants[1].outcome).toMatchObject({ status: "success" });
  });
});
