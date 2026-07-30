import type { UserRole } from "../model";

const USER_ROLE_LABEL: Record<UserRole, string> = {
  administrator: "관리자",
  manualRecorder: "수동 계수자",
  stopwatchRecorder: "계수기",
};

export function getUserRoleLabel(role: UserRole): string {
  return USER_ROLE_LABEL[role];
}
