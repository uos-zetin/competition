import { type Division,DivisionStatusBadge } from "@/entities/division";

import type { TopRecordRow } from "../lib/format-top-records";

import { TopRecordsList } from "./top-records-list";

type DivisionGroupProps = {
  division: Division;
  records: TopRecordRow[];
  onSelectDivision: (divisionId: string) => void;
};

export function DivisionGroup({ division, records, onSelectDivision }: DivisionGroupProps) {
  return (
    <section className="border-t pb-[1.1rem] first:border-t-0">
      <div className="flex items-center justify-between gap-3 px-[1.1rem] pt-[0.85rem] pb-2.5">
        <h3 className="flex items-center gap-2 text-[0.9375rem] font-bold">
          {division.name} <DivisionStatusBadge status={division.status} />
        </h3>
        <button className="text-xs font-semibold text-uos-blue hover:underline" type="button" onClick={() => onSelectDivision(division.id)}>
          전체 보기 →
        </button>
      </div>
      {division.status === "ready" ? (
        <p className="px-[1.1rem] py-1.5 text-[0.8125rem] text-muted-foreground">아직 시작 전인 부문입니다</p>
      ) : (
        <TopRecordsList records={records} variant="mini" />
      )}
    </section>
  );
}
