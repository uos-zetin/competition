import type { Record } from "../model/types";

export function getApprovedRecordsSortedByValue(records: Record[]): Record[] {
  return records.filter((record) => record.status === "approved").sort((a, b) => a.value - b.value);
}
