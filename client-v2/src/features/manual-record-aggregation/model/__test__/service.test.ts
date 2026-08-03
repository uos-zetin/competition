import { describe, expect, it, vi } from "vitest";

import type { ManualRecord } from "@/entities/manual-record";
import type { Record } from "@/entities/record";

import { createManualRecordAggregationService } from "../service";
import type { ManualRecordAggregationDeps } from "../types";

const manualRecords: ManualRecord[] = [
  { id: "manual-1", participantId: "participant-1", value: 12_450, recorderName: "김심판", createdAt: new Date() },
];
const createdRecord: Record = {
  id: "record-1",
  participantId: "participant-1",
  value: 12_800,
  source: "manual",
  status: "pending",
  note: "",
  createdAt: new Date(),
};

function createDeps(): ManualRecordAggregationDeps {
  return {
    manualRecordService: { use: { byParticipant: vi.fn().mockReturnValue(manualRecords) } },
    recordService: { admin: { create: vi.fn().mockResolvedValue(createdRecord) } },
  };
}

describe("createManualRecordAggregationService", () => {
  const result = {
    value: 12_800,
    mode: "median" as const,
    sortedValues: [12_450, 12_800, 13_100],
    contributingValues: [12_800],
    contributingRecordIds: ["manual-2"],
  };

  it("registers the aggregation as a manual record and returns it", async () => {
    const deps = createDeps();

    await expect(createManualRecordAggregationService(deps).register("participant-1", result)).resolves.toBe(createdRecord);
    expect(deps.recordService.admin.create).toHaveBeenCalledWith("participant-1", {
      value: 12_800,
      source: "manual",
      note: "3개 수동 계수 기록 취합 (중간값): 12450, 12800, 13100",
    });
  });

  it("propagates record creation failures", async () => {
    const deps = createDeps();
    vi.mocked(deps.recordService.admin.create).mockRejectedValue(new Error("failed"));

    await expect(createManualRecordAggregationService(deps).register("participant-1", result)).rejects.toThrow("failed");
  });

  it("delegates participant records without adding a delete capability", () => {
    const deps = createDeps();
    const service = createManualRecordAggregationService(deps);

    expect(service.use.byParticipant("participant-1")).toBe(manualRecords);
    expect(deps.manualRecordService.use.byParticipant).toHaveBeenCalledWith("participant-1");
    expect("clear" in service).toBe(false);
    expect("admin" in service).toBe(false);
  });
});
