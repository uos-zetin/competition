import { Badge } from "@/shared/ui";

import { getDivisionStatusLabel } from "../lib/format";
import type { DivisionStatus } from "../model";

interface DivisionStatusBadgeProps {
  status: DivisionStatus;
}

const statusClassNames: Record<DivisionStatus, string> = {
  ready: "border-border bg-secondary text-secondary-foreground",
  ongoing: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  closed: "border-border bg-transparent text-muted-foreground",
};

export function DivisionStatusBadge({ status }: DivisionStatusBadgeProps) {
  return (
    <Badge className={statusClassNames[status]}>
      {status === "ongoing" ? (
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
      ) : null}
      {getDivisionStatusLabel(status)}
    </Badge>
  );
}
