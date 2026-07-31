import { describe, expect, it } from "vitest";

import { RecordMockRepository } from "../repository.mock";

describe("RecordMockRepository", () => {
  it("creates a pending record and returns it for its participant", async () => {
    const repository = new RecordMockRepository();
    const created = await repository.createRecord("participant-3", {
      value: 48000,
      source: "manual",
      note: "수동 기록",
    });

    expect(created).toMatchObject({ participantId: "participant-3", status: "pending" });
    await expect(repository.getAllRecords("participant-3")).resolves.toContainEqual(created);
  });

  it("updates only the requested record's note and status", async () => {
    const repository = new RecordMockRepository();
    const [first, second] = await repository.getAllRecords("participant-1");

    await expect(repository.updateRecordNote(first.id, "수정된 메모")).resolves.toMatchObject({ note: "수정된 메모" });
    await expect(repository.updateRecordStatus(first.id, "rejected")).resolves.toMatchObject({ status: "rejected" });
    await expect(repository.getAllRecords("participant-1")).resolves.toContainEqual({
      ...first,
      note: "수정된 메모",
      status: "rejected",
    });
    await expect(repository.getAllRecords("participant-1")).resolves.toContainEqual(second);
  });

  it("rejects updates for a missing record", async () => {
    const repository = new RecordMockRepository();
    await expect(repository.updateRecordNote("missing", "메모")).rejects.toThrow("Record not found: missing");
  });
});
