import { progressService } from "@/features/progress";

import { Panel } from "./panel";

export function NextRunnerPanel() {
  const nextRunners = progressService.use.nextRunners() ?? [];
  return (
    <Panel title="다음 경연자">
      <ol className="grid min-h-0 flex-1 grid-rows-5 divide-y">
        {Array.from({ length: 5 }, (_, index) => {
          const participant = nextRunners[index];
          return (
            <li
              key={participant?.id ?? index}
              className={`grid min-w-0 grid-cols-[22%_1fr] text-[clamp(.65rem,1.15cqi,.95rem)] ${index === 0 && participant ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300" : ""}`}
            >
              <span className="flex items-center justify-center border-r font-bold">{index + 1}</span>
              <span className="flex min-w-0 items-center justify-center px-[clamp(.35rem,.8cqi,.65rem)]">
                <span className="truncate font-semibold">{participant?.name ?? "—"}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
