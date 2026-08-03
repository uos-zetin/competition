import type { Record } from "@/entities/record";

import type { ManualRecordAggregationResult } from "../lib/aggregate-manual-records";

import type { ManualRecordAggregationDeps } from "./types";

function buildAggregationNote(result: ManualRecordAggregationResult): string {
  const modeLabel = result.mode === "median" ? "중간값" : "평균값";
  return `${result.sortedValues.length}개 수동 계수 기록 취합 (${modeLabel}): ${result.sortedValues.join(", ")}`;
}

export function createManualRecordAggregationService({
  manualRecordService,
  recordService,
}: ManualRecordAggregationDeps) {
  return {
    use: {
      byParticipant: (participantId: string) => manualRecordService.use.byParticipant(participantId),
    },
    register: (participantId: string, result: ManualRecordAggregationResult): Promise<Record> =>
      recordService.admin.create(participantId, {
        value: result.value,
        source: "manual",
        note: buildAggregationNote(result),
      }),
  };
}
