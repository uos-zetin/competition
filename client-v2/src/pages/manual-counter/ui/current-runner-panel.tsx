import { CircleAlert, UserRound } from "lucide-react";

import { Badge } from "@/shared/ui";
import type { Participant } from "@/entities/participant";

type CurrentRunnerPanelProps = {
  participant: Participant | null;
  divisionId: string | null;
  divisionName: string | null;
};

export function CurrentRunnerPanel({ participant, divisionId, divisionName }: CurrentRunnerPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold"><UserRound className="size-4 text-muted-foreground" aria-hidden="true" />측정 대상</div>
        {divisionName ? <Badge className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300">{divisionName}</Badge> : null}
      </header>
      {!divisionId ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <CircleAlert className="size-7 text-amber-600 dark:text-amber-300" aria-hidden="true" />
          <p className="text-sm font-semibold">계수기가 아직 부문에 연결되지 않았습니다</p>
          <p className="text-xs leading-5 text-muted-foreground">관리자가 컨트롤러에서 계수기를 부문에 연결해야 합니다.</p>
        </div>
      ) : !participant ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-muted-foreground">
          <UserRound className="size-7 opacity-55" aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">현재 진행 중인 참가자가 없습니다</p>
          <p className="text-xs leading-5">부문이 시작되면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{participant.name.slice(0, 1)}</div>
          <div className="min-w-0">
            <p className="truncate font-bold">{participant.name}</p>
            <p className="truncate text-sm text-muted-foreground">{participant.teamName} · {participant.robotName}</p>
          </div>
        </div>
      )}
    </section>
  );
}
