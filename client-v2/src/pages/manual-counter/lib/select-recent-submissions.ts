import { sortByCreatedAtDesc } from "@/shared/lib";
import type { ManualRecord } from "@/entities/manual-record";

export function selectRecentSubmissions(manualRecords: ManualRecord[], submittedRecordIds: string[]): ManualRecord[] {
  const submittedIds = new Set(submittedRecordIds);
  return manualRecords.filter((record) => submittedIds.has(record.id)).sort(sortByCreatedAtDesc);
}
