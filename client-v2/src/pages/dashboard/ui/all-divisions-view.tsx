import type { Division } from "@/entities/division";

import type { TopRecordRow } from "../lib/format-top-records";

import { DivisionGroup } from "./division-group";
import { EmptyState } from "./empty-state";

type AllDivisionsViewProps = {
  divisions: Division[];
  recordsByDivision: Map<string, TopRecordRow[]>;
  onSelectDivision: (divisionId: string) => void;
};

export function AllDivisionsView({ divisions, recordsByDivision, onSelectDivision }: AllDivisionsViewProps) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-bold">부문별 최고 기록</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">부문을 선택하면 전체 순위를 볼 수 있습니다</p>
      </div>
      <div className="rounded-xl border bg-card">
        {divisions.length === 0 ? <EmptyState icon="🏁" title="등록된 부문이 없습니다" description="이 대회에는 아직 등록된 부문이 없습니다." variant="sub" /> : divisions.map((division) => (
          <DivisionGroup
            key={division.id}
            division={division}
            records={recordsByDivision.get(division.id) ?? []}
            onSelectDivision={onSelectDivision}
          />
        ))}
      </div>
    </section>
  );
}
