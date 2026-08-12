import { formatMsToClock } from "@/shared/lib";

import type { TopRecordRow } from "../lib/format-top-records";

type TopRecordsListProps = {
  records: TopRecordRow[];
  variant: "mini" | "full";
};

const rankClassName: Record<number, string> = {
  1: "bg-uos-gold text-white",
  2: "bg-uos-silver text-white",
  3: "bg-uos-bronze text-white",
};

export function TopRecordsList({ records, variant }: TopRecordsListProps) {
  if (variant === "mini") {
    return (
      <div>
        {records.slice(0, 3).map((record) => (
          <div key={record.participantId} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2.5 px-[1.1rem] py-1.5 text-[0.8125rem]">
            <span className="font-mono text-center font-semibold tabular-nums text-muted-foreground">{record.rank}</span>
            <span className="truncate">{record.name} · {record.teamMeta}</span>
            <time className="font-mono font-medium tabular-nums">{formatMsToClock(record.valueMs)}</time>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {records.map((record) => (
        <div key={record.participantId} className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b py-2.5 last:border-b-0">
          <span className={`inline-flex size-[1.9rem] items-center justify-center rounded-full font-mono text-[0.8125rem] font-bold tabular-nums ${rankClassName[record.rank] ?? "bg-muted text-muted-foreground"}`}>
            {record.rank}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold">{record.name}</span>
            <span className="truncate text-xs text-muted-foreground">{record.teamMeta}</span>
          </span>
          <time className="font-mono text-sm font-semibold tabular-nums whitespace-nowrap">{formatMsToClock(record.valueMs)}</time>
        </div>
      ))}
    </div>
  );
}
