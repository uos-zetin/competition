import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import type { Competition } from "@/entities/competition";
import type { Division } from "@/entities/division";
import type { RecordStatus } from "@/entities/record";

type RecordFilterCardProps = {
  competitions: Competition[];
  divisions: Division[];
  competitionId: string;
  divisionId: string;
  status: RecordStatus | "";
  onCompetitionChange: (competitionId: string) => void;
  onDivisionChange: (divisionId: string) => void;
  onStatusChange: (status: RecordStatus | "") => void;
};

const allDivisionsValue = "__all_divisions__";
const allStatusesValue = "__all_statuses__";

export function RecordFilterCard({
  competitions,
  divisions,
  competitionId,
  divisionId,
  status,
  onCompetitionChange,
  onDivisionChange,
  onStatusChange,
}: RecordFilterCardProps) {
  const isCompetitionSelected = Boolean(competitionId);

  return (
    <section className="mb-[1.375rem] grid grid-cols-1 gap-4 rounded-xl border bg-card px-5 py-4 md:grid-cols-3">
      <div>
        <label className="mb-2 block text-[0.8125rem] font-medium" htmlFor="competition-select">
          대회 선택
        </label>
        <Select value={competitionId} onValueChange={onCompetitionChange}>
          <SelectTrigger id="competition-select" className="h-9 hover:border-primary">
            <SelectValue placeholder="대회를 선택하세요" />
          </SelectTrigger>
          <SelectContent className="w-[var(--radix-select-trigger-width)]">
            {competitions.map((competition) => (
              <SelectItem key={competition.id} value={competition.id}>
                {competition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-[0.8125rem] font-medium" htmlFor="division-select">
          부문 선택
        </label>
        <Select
          disabled={!isCompetitionSelected}
          value={divisionId || allDivisionsValue}
          onValueChange={(value) => onDivisionChange(value === allDivisionsValue ? "" : value)}
        >
          <SelectTrigger id="division-select" className="h-9 hover:border-primary">
            <SelectValue placeholder={isCompetitionSelected ? "전체 부문" : "먼저 대회를 선택하세요"} />
          </SelectTrigger>
          <SelectContent className="w-[var(--radix-select-trigger-width)]">
            <SelectItem value={allDivisionsValue}>전체 부문</SelectItem>
            {divisions.map((division) => (
              <SelectItem key={division.id} value={division.id}>
                {division.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-[0.8125rem] font-medium" htmlFor="status-select">
          상태 필터
        </label>
        <Select
          disabled={!isCompetitionSelected}
          value={status || allStatusesValue}
          onValueChange={(value) => onStatusChange(value === allStatusesValue ? "" : (value as RecordStatus))}
        >
          <SelectTrigger id="status-select" className="h-9 hover:border-primary">
            <SelectValue placeholder="전체 상태" />
          </SelectTrigger>
          <SelectContent className="w-[var(--radix-select-trigger-width)]">
            <SelectItem value={allStatusesValue}>전체 상태</SelectItem>
            <SelectItem value="pending">승인 대기</SelectItem>
            <SelectItem value="approved">승인됨</SelectItem>
            <SelectItem value="rejected">거부됨</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
