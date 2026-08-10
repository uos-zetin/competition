import { Award, Plus } from "lucide-react";

import { Button } from "@/shared/ui";
import { type Competition,CompetitionCard } from "@/entities/competition";

type CompetitionListProps = {
  competitions: Competition[];
  onEdit: (competition: Competition) => void;
  onDelete: (competition: Competition) => void;
  onCreate: () => void;
};

export function CompetitionList({ competitions, onEdit, onDelete, onCreate }: CompetitionListProps) {
  if (competitions.length === 0) {
    return (
      <section className="flex flex-col items-center gap-3.5 rounded-xl border border-dashed bg-card px-6 py-14 text-center">
        <div className="flex size-[52px] items-center justify-center rounded-full bg-primary/10 text-primary">
          <Award className="size-[26px]" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold">대회가 없습니다</h3>
        <p className="max-w-md text-sm text-muted-foreground">새로운 대회를 생성하거나 CSV 파일로 한 번에 등록해보세요.</p>
        <Button type="button" className="mt-1.5" onClick={onCreate}>
          <Plus aria-hidden="true" />첫 번째 대회 생성하기
        </Button>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {competitions.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
