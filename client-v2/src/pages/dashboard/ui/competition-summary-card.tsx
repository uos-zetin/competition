import type { Competition } from "@/entities/competition";
import type { Division } from "@/entities/division";

type CompetitionSummaryCardProps = {
  competition: Competition;
  division?: Division;
};

export function CompetitionSummaryCard({ competition, division }: CompetitionSummaryCardProps) {
  const description = division ? (division.description ? `${division.name} · ${division.description}` : "") : competition.description;

  return (
    <section className="mb-4 rounded-xl border bg-card px-5 py-[1.125rem]">
      <h2 className="mb-1 text-[1.0625rem] font-bold">{competition.name}</h2>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </section>
  );
}
