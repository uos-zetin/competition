import { useState } from "react";

import { ChevronLeft, ChevronRight, Plus, UsersRound } from "lucide-react";

import { Button } from "@/shared/ui";
import type { Division } from "@/entities/division";
import { type Participant, ParticipantCard, participantService } from "@/entities/participant";

import { getTotalPages, paginateParticipants, sortParticipantsByOrder } from "../lib/paginate-participants";

type DivisionParticipantsSectionProps = {
  division: Division;
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
  onCreateInDivision: (divisionId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
};

export function DivisionParticipantsSection({
  division,
  onEdit,
  onDelete,
  onCreateInDivision,
  isExpanded,
  onToggle,
}: DivisionParticipantsSectionProps) {
  const participants = participantService.use.byDivision(division.id);
  const [currentPage, setCurrentPage] = useState(1);
  const sortedParticipants = sortParticipantsByOrder(participants);
  const totalPages = getTotalPages(sortedParticipants.length);
  const visibleParticipants = paginateParticipants(sortedParticipants, Math.min(currentPage, totalPages || 1));

  return (
    <section>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b pb-3">
        <button type="button" className="flex items-start gap-2 text-left" onClick={onToggle} aria-expanded={isExpanded}><ChevronRight className={`mt-1 size-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} aria-hidden="true" /><div>
          <h3 className="text-[1.0625rem] font-bold">{division.name}</h3>
          <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">
            {division.description.trim() || "설명이 없습니다"}
          </p>
        </div></button>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
            총 {participants.length}명
          </span>
          <Button type="button" variant="outline" size="sm" onClick={() => onCreateInDivision(division.id)}>
            <Plus aria-hidden="true" />참가자 추가
          </Button>
        </div>
      </header>

      {isExpanded && (participants.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed bg-card px-6 py-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UsersRound className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">이 부문에 참가자가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3.5">
            {visibleParticipants.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
          {totalPages > 1 ? (
            <nav className="mt-[1.1rem] flex items-center justify-center gap-4" aria-label={`${division.name} 참가자 페이지`}>
              <Button type="button" variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                <ChevronLeft aria-hidden="true" />이전
              </Button>
              <span className="text-[0.84375rem] tabular-nums">{currentPage} / {totalPages} 페이지</span>
              <Button type="button" variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
                다음<ChevronRight aria-hidden="true" />
              </Button>
            </nav>
          ) : null}
        </>
      ))}
    </section>
  );
}
