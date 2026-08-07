import { useEffect, useMemo } from "react";

import { participantService } from "@/entities/participant";
import { progressService } from "@/features/progress";

import { formatTopRecords } from "../lib/format-top-records";

import { Panel } from "./panel";
import { TopRecordRow } from "./top-record-row";

export function TopRecordPanel() {
  const division = progressService.use.division();
  const divisionId = division?.id ?? "";
  const participants = participantService.use.byDivision(divisionId);
  const records = progressService.use.topRecords();
  useEffect(() => {
    if (divisionId)
      void participantService
        .load(divisionId)
        .catch((error: unknown) => console.error("Failed to load participants", error));
  }, [divisionId]);
  const topRecords = useMemo(() => formatTopRecords(records ?? [], participants), [records, participants]);
  return (
    <Panel title="최고 기록">
      <div className="grid min-h-0 flex-1 grid-rows-5">
        {Array.from({ length: 5 }, (_, index) => (
          <TopRecordRow key={index} index={index} left={topRecords[index]} right={topRecords[index + 5]} />
        ))}
      </div>
    </Panel>
  );
}
