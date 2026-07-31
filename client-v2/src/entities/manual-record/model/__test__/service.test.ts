import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ManualRecordRepository } from "../../api/types";
import { createManualRecordService } from "../service";
import { useManualRecordStore } from "../store.zustand";

const participantOneRecord = {
  id: "manual-record-1",
  participantId: "participant-1",
  value: 52740,
  recorderName: "김심판",
  createdAt: new Date("2026-03-05T10:12:00+09:00"),
};
const participantTwoRecord = {
  id: "manual-record-2",
  participantId: "participant-2",
  value: 49980,
  recorderName: "박심판",
  createdAt: new Date("2026-03-06T11:30:00+09:00"),
};

function createRepository(): ManualRecordRepository {
  return {
    getAllManualRecords: vi.fn(),
    createManualRecord: vi.fn(),
    deleteManualRecords: vi.fn(),
  };
}

describe("createManualRecordService", () => {
  beforeEach(() => useManualRecordStore.getState().clearAll());

  it("replaces only the loaded participant's records while retaining other participants", async () => {
    const repository = createRepository();
    useManualRecordStore.getState().add(participantTwoRecord);
    vi.mocked(repository.getAllManualRecords).mockResolvedValue([participantOneRecord]);

    await createManualRecordService({ manualRecordRepository: repository }).load("participant-1");

    expect(useManualRecordStore.getState().manualRecords).toEqual([participantOneRecord, participantTwoRecord]);
  });

  it("parses a form, creates a record, and stores the server response", async () => {
    const repository = createRepository();
    vi.mocked(repository.createManualRecord).mockResolvedValue(participantOneRecord);

    await createManualRecordService({ manualRecordRepository: repository }).admin.create("participant-1", {
      value: 52740,
      recorderName: " 김심판 ",
    });

    expect(repository.createManualRecord).toHaveBeenCalledWith("participant-1", {
      value: 52740,
      recorderName: "김심판",
    });
    expect(useManualRecordStore.getState().manualRecords).toEqual([participantOneRecord]);
  });

  it("clears only the requested participant after the repository succeeds", async () => {
    const repository = createRepository();
    const service = createManualRecordService({ manualRecordRepository: repository });
    useManualRecordStore.getState().add(participantOneRecord);
    useManualRecordStore.getState().add(participantTwoRecord);

    await service.admin.clear("participant-1");

    expect(repository.deleteManualRecords).toHaveBeenCalledWith("participant-1");
    expect(useManualRecordStore.getState().manualRecords).toEqual([participantTwoRecord]);
  });

  it("does not change the store when a repository call rejects", async () => {
    const repository = createRepository();
    const service = createManualRecordService({ manualRecordRepository: repository });
    useManualRecordStore.getState().add(participantOneRecord);
    vi.mocked(repository.deleteManualRecords).mockRejectedValue(new Error("failed"));

    await expect(service.admin.clear("participant-1")).rejects.toThrow("failed");
    expect(useManualRecordStore.getState().manualRecords).toEqual([participantOneRecord]);
  });
});
