import { formatElapsedMs } from "@/entities/counter";

import type { TopRecord } from "../lib/format-top-records";

const rankTint = ["bg-yellow-500/25", "bg-zinc-400/25", "bg-amber-700/20"];

export function TopRecordRow({ index, left, right }: { index: number; left?: TopRecord; right?: TopRecord }) {
  return (
    <div className="grid min-w-0 grid-cols-2 divide-x border-b last:border-b-0">
      {[
        { rank: index + 1, entry: left },
        { rank: index + 6, entry: right },
      ].map(({ rank, entry }) => (
        <RecordCell key={rank} rank={rank} entry={entry} />
      ))}
    </div>
  );
}

function RecordCell({ rank, entry }: { rank: number; entry?: TopRecord }) {
  return (
    <div
      className={`grid min-w-0 grid-cols-[22%_1fr] items-center py-[clamp(.2rem,.45cqi,.4rem)] text-[clamp(.4rem,1cqi,.78rem)] ${rankTint[rank - 1] ?? ""}`}
    >
      <span className="flex items-center justify-center border-r font-bold">{rank}</span>
      {entry ? (
        <div className="flex min-w-0 flex-col items-center justify-center px-[clamp(.35rem,.8cqi,.65rem)] text-center">
          <div className="flex min-w-0 items-center justify-center gap-1">
            <span className="min-w-0 truncate font-semibold">{entry.participantName}</span>
            <span className="shrink-0">·</span>
            <span className="shrink-0 tabular-nums">{formatElapsedMs(entry.timeMs)}</span>
          </div>
          <p className="truncate text-muted-foreground">{entry.participantTeamName}</p>
        </div>
      ) : (
        <span className="flex items-center justify-center text-muted-foreground">—</span>
      )}
    </div>
  );
}
