import { describe, expect, it } from "vitest";

import { ManualRecordMockRepository } from "../repository.mock";

describe("ManualRecordMockRepository", () => {
  it("creates a manual record scoped to its participant", async () => {
    const repository = new ManualRecordMockRepository();
    const record = await repository.createManualRecord("participant-new", { value: 52740, recorderName: "심판" });

    expect(record.participantId).toBe("participant-new");
    await expect(repository.getAllManualRecords("participant-new")).resolves.toEqual([record]);
  });

  it("deletes records for only the requested participant", async () => {
    const repository = new ManualRecordMockRepository();
    const first = await repository.createManualRecord("participant-new", { value: 52740, recorderName: "심판 A" });
    const second = await repository.createManualRecord("participant-other", { value: 52810, recorderName: "심판 B" });

    await repository.deleteManualRecords("participant-new");

    await expect(repository.getAllManualRecords("participant-new")).resolves.toEqual([]);
    await expect(repository.getAllManualRecords("participant-other")).resolves.toEqual([second]);
    expect(first.participantId).toBe("participant-new");
  });
});
