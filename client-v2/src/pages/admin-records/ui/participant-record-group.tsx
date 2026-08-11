import { ChevronRight } from "lucide-react";

import { cn, formatMsToClock } from "@/shared/lib";
import { Badge } from "@/shared/ui";
import { RecordStatusBadge } from "@/entities/record";
import { type groupRecordsByParticipant, RecordReviewList } from "@/features/record-review";

type ParticipantRecordGroup = ReturnType<typeof groupRecordsByParticipant>[number];

type ParticipantRecordGroupItemProps = {
  group: ParticipantRecordGroup;
  divisionName: string;
  isExpanded: boolean;
  onToggle: () => void;
};

export function ParticipantRecordGroupItem({
  group,
  divisionName,
  isExpanded,
  onToggle,
}: ParticipantRecordGroupItemProps) {
  const pendingCount = group.records.filter((record) => record.status === "pending").length;

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <button
        type="button"
        className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-accent"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <span className="flex flex-wrap items-center gap-2.5">
          <ChevronRight
            className={cn(
              "size-[15px] shrink-0 text-muted-foreground transition-transform",
              isExpanded && "rotate-90 text-foreground"
            )}
            aria-hidden="true"
          />
          <span className="text-base font-bold">{group.participant.name}</span>
          <Badge className="border-border bg-secondary text-secondary-foreground">
            {divisionName} · {group.records.length}개 기록
          </Badge>
          {pendingCount > 0 ? <RecordStatusBadge status="pending" pendingCount={pendingCount} /> : null}
        </span>
        <span className="text-[0.8125rem] text-muted-foreground">
          최고 기록:{" "}
          <strong className="font-bold text-foreground tabular-nums">{formatMsToClock(group.bestValue)}</strong>
        </span>
      </button>
      {isExpanded ? (
        <div className="border-t px-4 pt-3 pb-4">
          <RecordReviewList records={group.records} />
        </div>
      ) : null}
    </section>
  );
}
