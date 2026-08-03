import type { ManualRecord } from "@/entities/manual-record";

export type AggregationMode = "median" | "average";

export interface ManualRecordAggregationResult {
  value: number;
  mode: AggregationMode;
  sortedValues: number[];
  contributingValues: number[];
  contributingRecordIds: string[];
}

export function aggregateManualRecords(selectedManualRecords: ManualRecord[]): ManualRecordAggregationResult | null {
  if (selectedManualRecords.length === 0) return null;

  const sortedRecords = selectedManualRecords
    .map((record, index) => ({ record, index }))
    .sort((a, b) => a.record.value - b.record.value || a.index - b.index)
    .map(({ record }) => record);
  const middleIndex = Math.floor(sortedRecords.length / 2);
  const sortedValues = sortedRecords.map((record) => record.value);

  if (sortedRecords.length % 2 === 1) {
    const middleRecord = sortedRecords[middleIndex];
    return {
      value: middleRecord.value,
      mode: "median",
      sortedValues,
      contributingValues: [middleRecord.value],
      contributingRecordIds: [middleRecord.id],
    };
  }

  const contributingRecords = [sortedRecords[middleIndex - 1], sortedRecords[middleIndex]];
  const contributingValues = contributingRecords.map((record) => record.value);
  return {
    value: (contributingValues[0] + contributingValues[1]) / 2,
    mode: "average",
    sortedValues,
    contributingValues,
    contributingRecordIds: contributingRecords.map((record) => record.id),
  };
}
