import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import type { Competition } from "@/entities/competition";
import { type Division,getDivisionStatusLabel } from "@/entities/division";

type DashboardFilterCardProps = {
  competitions: Competition[];
  divisions: Division[];
  competitionId: string;
  divisionId: string;
  onCompetitionChange: (competitionId: string) => void;
  onDivisionChange: (divisionId: string) => void;
};

const allDivisionsValue = "__all_divisions__";

export function DashboardFilterCard({
  competitions,
  divisions,
  competitionId,
  divisionId,
  onCompetitionChange,
  onDivisionChange,
}: DashboardFilterCardProps) {
  const isCompetitionSelected = Boolean(competitionId);

  return (
    <section className="mb-4 grid gap-3.5 rounded-xl border bg-card p-5 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-[0.8125rem] font-medium" htmlFor="competition-select">
          대회 선택
        </label>
        <Select value={competitionId} onValueChange={onCompetitionChange}>
          <SelectTrigger id="competition-select" className="hover:border-primary">
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
        <label className="mb-1.5 block text-[0.8125rem] font-medium" htmlFor="division-select">
          부문 선택 <span className="font-normal text-muted-foreground">(선택사항)</span>
        </label>
        <Select
          disabled={!isCompetitionSelected}
          value={divisionId || allDivisionsValue}
          onValueChange={(value) => onDivisionChange(value === allDivisionsValue ? "" : value)}
        >
          <SelectTrigger id="division-select" className="hover:border-primary">
            <SelectValue placeholder={isCompetitionSelected ? "전체 부문" : "먼저 대회를 선택하세요"} />
          </SelectTrigger>
          <SelectContent className="w-[var(--radix-select-trigger-width)]">
            <SelectItem value={allDivisionsValue}>전체 부문</SelectItem>
            {divisions.map((division) => (
              <SelectItem key={division.id} value={division.id}>
                {division.name} · {getDivisionStatusLabel(division.status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
