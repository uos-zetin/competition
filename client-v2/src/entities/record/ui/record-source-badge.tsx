import { cn } from "@/shared/lib";

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
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        sourceClassNames[source]
      )}
    >
      {getRecordSourceLabel(source)}
    </span>
  );
}
