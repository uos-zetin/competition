import { SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui";

import type { Competition } from "../model";

interface CompetitionCardProps {
  competition: Competition;
  onEdit: (competition: Competition) => void;
  onDelete: (competition: Competition) => void;
}

export function CompetitionCard({ competition, onEdit, onDelete }: CompetitionCardProps) {
  const createdAt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(competition.createdAt);
  const hasDescription = competition.description.trim().length > 0;

  return (
    <article className="w-full rounded-xl border bg-card p-[18px_20px] text-card-foreground transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">{competition.name}</h3>
          <p
            className={
              hasDescription
                ? "mt-2 line-clamp-3 text-[13.5px] text-muted-foreground"
                : "mt-2 text-[13.5px] text-muted-foreground/65"
            }
          >
            {hasDescription ? competition.description : "설명이 없습니다"}
          </p>
          <p className="mt-2.5 text-xs text-muted-foreground">생성일: {createdAt}</p>
        </div>
        <div className="ml-2 flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="수정" onClick={() => onEdit(competition)}>
            <SquarePen />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive"
            aria-label="삭제"
            onClick={() => onDelete(competition)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  );
}
