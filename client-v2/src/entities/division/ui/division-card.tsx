import { SquarePen, Trash2 } from "lucide-react";

import { formatCreatedAtLong } from "@/shared/lib";
import { Button } from "@/shared/ui";

import { formatTimeLimit } from "../lib/format";
import type { Division } from "../model";

import { DivisionStatusBadge } from "./division-status-badge";

interface DivisionCardProps {
  division: Division;
  onEdit: (division: Division) => void;
  onDelete: (division: Division) => void;
}

export function DivisionCard({ division, onEdit, onDelete }: DivisionCardProps) {
  const createdAt = formatCreatedAtLong(division.createdAt);
  const hasDescription = division.description.trim().length > 0;

  return (
    <article className="w-full rounded-xl border bg-card p-[18px_20px] text-card-foreground transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base font-semibold">{division.name}</h3>
            <DivisionStatusBadge status={division.status} />
          </div>
          <p
            className={
              hasDescription
                ? "mt-2 line-clamp-3 text-[13.5px] text-muted-foreground"
                : "mt-2 text-[13.5px] text-muted-foreground/65"
            }
          >
            {hasDescription ? division.description : "설명이 없습니다"}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>⏱ 제한시간 {formatTimeLimit(division.timeLimit)}</span>
            <span>생성일: {createdAt}</span>
          </div>
        </div>
        <div className="ml-2 flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="수정" onClick={() => onEdit(division)}>
            <SquarePen />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive"
            aria-label="삭제"
            onClick={() => onDelete(division)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  );
}
