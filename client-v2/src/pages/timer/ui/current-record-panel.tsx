import { formatElapsedMs } from "@/entities/counter";
import { getApprovedRecordsSortedByValue } from "@/entities/record";
import { progressService } from "@/features/progress";

import { Panel } from "./panel";

export function CurrentRecordPanel() {
  const records = getApprovedRecordsSortedByValue(progressService.use.runner()?.records ?? []);
  return (
    <Panel title="현재 경연자 기록">
      <ol className="grid min-h-0 flex-1 grid-rows-5 divide-y">
        {Array.from({ length: 5 }, (_, index) => (
          <li
            key={records[index]?.id ?? index}
            className="grid grid-cols-[22%_1fr] text-[clamp(.65rem,1.15cqi,.95rem)] font-semibold tabular-nums"
          >
            <span className="flex items-center justify-center border-r">{index + 1}</span>
            <span className="flex items-center justify-center">
              {records[index] ? formatElapsedMs(records[index].value) : "—"}
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
