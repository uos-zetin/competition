import type { RecordStatus } from "../model";

export function getRecordStatusLabel(status: RecordStatus): string {
  switch (status) {
    case "pending":
      return "대기";
    case "approved":
      return "승인";
    case "rejected":
      return "거부";
  }
}
