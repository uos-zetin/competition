import type { RecordSource, RecordStatus } from "../model";

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

export function getRecordSourceLabel(source: RecordSource): string {
  switch (source) {
    case "stopwatch":
      return "계수기";
    case "manual":
      return "수동 계수";
    case "other":
      return "기타";
  }
}
