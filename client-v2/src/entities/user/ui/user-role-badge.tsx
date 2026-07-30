import { cn } from "@/shared/lib";

import { getUserRoleLabel } from "../lib/format";
import type { UserRole } from "../model";

interface UserRoleBadgeProps {
  role?: UserRole;
}

const roleClassNames: Record<UserRole, string> = {
  administrator: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  manualRecorder: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  stopwatchRecorder: "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
};

const roleDotClassNames: Record<UserRole, string> = {
  administrator: "bg-blue-500",
  manualRecorder: "bg-emerald-500",
  stopwatchRecorder: "bg-amber-600",
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const isEmpty = role === undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        isEmpty ? "border-border bg-secondary text-secondary-foreground" : roleClassNames[role]
      )}
    >
      <span className={cn("size-1.5 rounded-full", isEmpty ? "bg-muted-foreground" : roleDotClassNames[role])} />
      {isEmpty ? "역할 없음" : getUserRoleLabel(role)}
    </span>
  );
}
