import { sortByCreatedAtDesc } from "@/shared/lib";
import type { Record } from "@/entities/record";

import { RecordReviewCard } from "./record-review-card";

interface RecordReviewListProps {
  records: Record[];
  getParticipantName?: (participantId: string) => string;
}

export function RecordReviewList({ records, getParticipantName }: RecordReviewListProps) {
  const sorted = [...records].sort(sortByCreatedAtDesc);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((record) => (
        <RecordReviewCard key={record.id} record={record} participantName={getParticipantName?.(record.participantId)} />
      ))}
    </div>
  );
}
