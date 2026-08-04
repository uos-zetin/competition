import { Badge } from "@/shared/ui";

import { getRecordSourceLabel } from "../lib/format";
import type { RecordSource } from "../model";

interface RecordSourceBadgeProps {
  source: RecordSource;
}

const sourceClassNames: Record<RecordSource, string> = {
  stopwatch: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  manual: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  other: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

export function RecordSourceBadge({ source }: RecordSourceBadgeProps) {
  return (
    <Badge className={sourceClassNames[source]}>
      {getRecordSourceLabel(source)}
    </Badge>
  );
}
