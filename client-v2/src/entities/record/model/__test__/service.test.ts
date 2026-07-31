import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RecordRepository } from "../../api/types";
import { createRecordService } from "../service";
import { useRecordStore } from "../store.zustand";

const olderRecord = {
  id: "record-old",
  participantId: "participant-1",
  value: 60000,
  source: "stopwatch" as const,
  status: "approved" as const,
  note: "기존 기록",
  createdAt: new Date("2026-03-01"),
};
const newerRecord = {
  id: "record-new",
  participantId: "participant-2",
  value: 55000,
  source: "manual" as const,
  status: "pending" as const,
  note: "새 기록",
  createdAt: new Date("2026-03-02"),
};

function createRepository(): RecordRepository {
  return {
    getAllRecords: vi.fn(),
    getTopRecords: vi.fn(),
    createRecord: vi.fn(),
    updateRecordNote: vi.fn(),
    updateRecordStatus: vi.fn(),
  };
}

describe("createRecordService", () => {
  beforeEach(() => useRecordStore.getState().clearAll());

  it("merges participant and division record loads without evicting unrelated records", async () => {
    const repository = createRepository();
    vi.mocked(repository.getAllRecords).mockResolvedValue([olderRecord]);
    vi.mocked(repository.getTopRecords).mockResolvedValue([newerRecord]);
    const service = createRecordService({ recordRepository: repository });

    await service.load.byParticipant("participant-1");
    await service.load.topByDivision("division-1");

    expect(useRecordStore.getState().records).toEqual([newerRecord, olderRecord]);
  });

  it("validates and trims a record form before creating it", async () => {
    const repository = createRepository();
    vi.mocked(repository.createRecord).mockResolvedValue(newerRecord);

    await createRecordService({ recordRepository: repository }).admin.create("participant-2", {
      value: 55000,
      source: "manual",
      note: " 새 기록 ",
    });

    expect(repository.createRecord).toHaveBeenCalledWith("participant-2", {
      value: 55000,
      source: "manual",
      note: "새 기록",
    });
    expect(useRecordStore.getState().records).toEqual([newerRecord]);
  });

  it("updates the matching record note and status", async () => {
    const repository = createRepository();
    const service = createRecordService({ recordRepository: repository });
    useRecordStore.getState().add(olderRecord);
    const notedRecord = { ...olderRecord, note: "수정된 메모" };
    const approvedRecord = { ...notedRecord, status: "rejected" as const };
    vi.mocked(repository.updateRecordNote).mockResolvedValue(notedRecord);
    vi.mocked(repository.updateRecordStatus).mockResolvedValue(approvedRecord);

    await service.admin.updateNote(olderRecord.id, "수정된 메모");
    await service.admin.updateStatus(olderRecord.id, "rejected");

    expect(useRecordStore.getState().records).toEqual([approvedRecord]);
  });

  it("does not change the store when a repository call rejects", async () => {
    const repository = createRepository();
    const service = createRecordService({ recordRepository: repository });
    useRecordStore.getState().add(olderRecord);
    vi.mocked(repository.updateRecordStatus).mockRejectedValue(new Error("failed"));

    await expect(service.admin.updateStatus(olderRecord.id, "rejected")).rejects.toThrow("failed");
    expect(useRecordStore.getState().records).toEqual([olderRecord]);
  });
});
