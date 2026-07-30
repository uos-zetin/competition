import type { DivisionStatus } from "../model";

const DIVISION_STATUS_LABEL: Record<DivisionStatus, string> = {
  ready: "준비",
  ongoing: "진행중",
  closed: "종료",
};

export function getDivisionStatusLabel(status: DivisionStatus): string {
  return DIVISION_STATUS_LABEL[status];
}

export function formatTimeLimit(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}분 ${String(remaining).padStart(2, "0")}초`;
}
