import { SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui";

import type { Participant } from "../model";

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
}

export function ParticipantCard({ participant, onEdit, onDelete }: ParticipantCardProps) {
  const createdAt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(participant.createdAt);
  const hasComment = participant.comment.trim().length > 0;

  return (
    <article className="w-full rounded-xl border bg-card p-[18px_20px] text-card-foreground transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold tabular-nums text-primary-foreground">
              {participant.orderRaw}
            </span>
            <h3 className="text-base font-semibold">{participant.name}</h3>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13.5px] text-muted-foreground max-sm:grid-cols-1">
            <p>
              팀명: <strong className="font-medium text-foreground">{participant.teamName}</strong>
            </p>
            <p>
              로봇명: <strong className="font-medium text-foreground">{participant.robotName}</strong>
            </p>
          </div>
          {hasComment ? (
            <p className="mt-2.5 border-t pt-2.5 text-[13px] text-muted-foreground">{participant.comment}</p>
          ) : null}
          <p className="mt-2.5 text-xs text-muted-foreground">등록일: {createdAt}</p>
        </div>
        <div className="ml-2 flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="수정" onClick={() => onEdit(participant)}>
            <SquarePen />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive"
            aria-label="삭제"
            onClick={() => onDelete(participant)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  );
}
