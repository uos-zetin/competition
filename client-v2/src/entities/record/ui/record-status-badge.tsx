import { cn } from "@/shared/lib";

import { getRecordStatusLabel } from "../lib/format";
import type { RecordStatus } from "../model";

interface RecordStatusBadgeProps {
  status: RecordStatus;
}

const statusClassNames: Record<RecordStatus, string> = {
  pending: "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  rejected: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function RecordStatusBadge({ status }: RecordStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        statusClassNames[status]
      )}
    >
      {getRecordStatusLabel(status)}
    </span>
  );
}
