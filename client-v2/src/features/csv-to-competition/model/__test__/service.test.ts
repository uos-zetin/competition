import { describe, expect, it, vi } from "vitest";

import { ParticipantFormSchema } from "@/entities/participant";

import { createCsvImportService } from "../service";
import type { CsvImportOptions, CsvParseResult } from "../types";

const parsed: CsvParseResult = {
  competitionName: "대회",
  totalParticipantCount: 3,
  divisionGroups: [
    {
      groupId: "a",
      divisionName: "A",
      participants: [
        { rowId: "a1", name: "가", teamName: "팀", robotName: "로봇", orderRaw: "1", comment: "" },
        { rowId: "a2", name: "나", teamName: "팀", robotName: "로봇", orderRaw: "2", comment: "" },
      ],
    },
    {
      groupId: "b",
      divisionName: "B",
      participants: [{ rowId: "b1", name: "다", teamName: "팀", robotName: "로봇", orderRaw: "3", comment: "" }],
    },
  ],
};
const options: CsvImportOptions = {
  competitionDescription: "",
  divisionSettings: [
    { groupId: "a", description: "", timeLimit: 60 },
    { groupId: "b", description: "", timeLimit: 60 },
  ],
};
function fixture() {
  const competitionService = {
    admin: { create: vi.fn().mockResolvedValue({ id: "c", name: "대회", description: "", createdAt: new Date() }) },
  };
  const divisionService = {
    admin: {
      create: vi.fn().mockImplementation(async (_competitionId: string, form: { name: string }) => ({
        id: form.name,
        competitionId: "c",
        ...form,
        status: "ready",
        createdAt: new Date(),
      })),
    },
  };
  const participantService = {
    admin: {
      create: vi
        .fn()
        .mockImplementation(async (form: { name: string }) => ({ id: form.name, ...form, createdAt: new Date() })),
    },
  };
  return {
    competitionService,
    divisionService,
    participantService,
    service: createCsvImportService({ competitionService, divisionService, participantService }),
  };
}

describe("createCsvImportService", () => {
  it("creates every level on the happy path", async () => {
    const { service, divisionService, participantService } = fixture();
    const result = await service.run(parsed, options);
    expect(result.competition.status).toBe("success");
    expect(divisionService.admin.create).toHaveBeenCalledTimes(2);
    expect(participantService.admin.create).toHaveBeenCalledTimes(3);
  });
  it("does not attempt dependent items after competition failure", async () => {
    const { service, competitionService, divisionService, participantService } = fixture();
    competitionService.admin.create.mockRejectedValueOnce(new Error("fail"));
    const result = await service.run(parsed, options);
    expect(result.competition.status).toBe("failed");
    expect(divisionService.admin.create).not.toHaveBeenCalled();
    expect(participantService.admin.create).not.toHaveBeenCalled();
  });
  it("skips only participants whose division fails", async () => {
    const { service, divisionService, participantService } = fixture();
    divisionService.admin.create.mockRejectedValueOnce(new Error("bad division"));
    const result = await service.run(parsed, options);
    expect(result.participants.filter((item) => item.outcome.status === "skipped")).toHaveLength(2);
    expect(participantService.admin.create).toHaveBeenCalledTimes(1);
  });
  it("retries only failed items, applying edits", async () => {
    const { service, participantService } = fixture();
    participantService.admin.create.mockRejectedValueOnce(new Error("bad participant"));
    const first = await service.run(parsed, options);
    const second = await service.retry(first, parsed, options, { participantFields: { a1: { orderRaw: "9" } } });
    expect(second.participants[0].outcome.status).toBe("success");
    expect(participantService.admin.create).toHaveBeenCalledTimes(4);
    expect(participantService.admin.create).toHaveBeenLastCalledWith(expect.objectContaining({ orderRaw: 9 }));
  });
  it("retries a failed competition with its edited name", async () => {
    const { service, competitionService, divisionService } = fixture();
    competitionService.admin.create.mockRejectedValueOnce(new Error("duplicate"));
    const first = await service.run(parsed, options);
    await service.retry(first, parsed, options, { competitionName: "새 대회" });
    expect(competitionService.admin.create).toHaveBeenLastCalledWith({ name: "새 대회", description: "" });
    expect(divisionService.admin.create).toHaveBeenCalledTimes(2);
  });
  it("retries a failed division with its edited name and creates its skipped participants", async () => {
    const { service, divisionService, participantService } = fixture();
    divisionService.admin.create.mockRejectedValueOnce(new Error("duplicate division"));
    const first = await service.run(parsed, options);
    expect(participantService.admin.create).toHaveBeenCalledTimes(1);
    const second = await service.retry(first, parsed, options, { divisionNames: { a: "새 A" } });
    expect(divisionService.admin.create).toHaveBeenLastCalledWith("c", expect.objectContaining({ name: "새 A" }));
    expect(second.divisions[0].divisionName).toBe("새 A");
    expect(participantService.admin.create).toHaveBeenCalledTimes(3);
  });
  it("blindly retries a transient participant failure without recreating successes", async () => {
    const { service, participantService } = fixture();
    participantService.admin.create.mockRejectedValueOnce(new Error("temporary"));
    const first = await service.run(parsed, options);
    await service.retry(first, parsed, options);
    expect(participantService.admin.create).toHaveBeenCalledTimes(4);
    expect(participantService.admin.create).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "가", orderRaw: 1 })
    );
  });
  it("retains an edited value when that item fails again", async () => {
    const { service, divisionService } = fixture();
    divisionService.admin.create.mockImplementation(async (_competitionId: string, form: { name: string }) => {
      if (form.name === "A") throw new Error("first failure");
      if (form.name === "수정된 A") throw new Error("second failure");
      return { id: form.name, competitionId: "c", ...form, status: "ready", createdAt: new Date() };
    });
    const first = await service.run(parsed, options);
    const second = await service.retry(first, parsed, options, { divisionNames: { a: "수정된 A" } });
    expect(second.divisions[0]).toMatchObject({
      groupId: "a",
      divisionName: "수정된 A",
      outcome: { status: "failed", error: "second failure" },
    });
  });
  it("flattens a participant ZodError to its first readable message", async () => {
    const { service, participantService } = fixture();
    let validationError: unknown;
    try {
      ParticipantFormSchema.parse({
        divisionId: "A",
        name: "가",
        teamName: "팀",
        robotName: "로봇",
        comment: "",
        orderRaw: 0,
      });
    } catch (error) {
      validationError = error;
    }
    participantService.admin.create.mockRejectedValueOnce(validationError);
    const result = await service.run(parsed, options);
    expect(result.participants[0].outcome).toMatchObject({ status: "failed", error: "순서는 1 이상이어야 합니다" });
  });
});
