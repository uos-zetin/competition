import { useEffect } from "react";

import { Activity, CircleAlert, ListOrdered, Radio, SkipForward, Users } from "lucide-react";

import { Button } from "@/shared/ui";
import { counterService } from "@/entities/counter";
import { DivisionStatusBadge } from "@/entities/division";
// Error handling is the architecture's designated cross-cutting feature exception.
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-cross-slice-dependency
import { errorHandlingService } from "@/features/error-handling";

import { progressService } from "../model";

export function ProgressMonitorPanel({ counterId }: { counterId: string }) {
  const divisionId = counterService.use.counterState(counterId)?.divisionId ?? null;
  const progress = progressService.use.progress();

  useEffect(() => {
    if (!divisionId) return;
    void progressService.connection.connect(divisionId).catch((error: unknown) => errorHandlingService.handle(error, "진행 상황 채널 연결에 실패했습니다"));
    return () => { void progressService.connection.disconnect(); };
  }, [divisionId]);

  const command = (action: () => Promise<void>, message: string) => { void action().catch((error: unknown) => errorHandlingService.handle(error, message)); };
  const division = progress?.division;
  const runner = progress?.runner;
  const nextRunners = progress?.nextRunners ?? [];
  const nextRunner = nextRunners[0];

  return <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
    <header className="flex items-center gap-2 border-b px-4 py-3 text-sm font-bold"><Activity className="size-4 text-muted-foreground" aria-hidden="true" />진행 상황</header>
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground"><Radio className="size-3.5" aria-hidden="true" />Progress 채널</span>{divisionId ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><span className="size-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />연결됨</span> : <span className="rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">연결 안됨</span>}</div>
      {!divisionId ? <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed px-3 py-5 text-center text-xs text-muted-foreground"><CircleAlert className="size-5 opacity-60" aria-hidden="true" />부문이 연결되어 있으면<br />자동으로 연결됩니다</div> : <>
        <div className="h-px bg-border" />
        {division ? <div className="flex flex-col gap-2"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-bold">{division.name}</p><DivisionStatusBadge status={division.status} /></div>{division.status === "ready" ? <Button type="button" onClick={() => command(() => progressService.admin.openDivision(division.id), "부문 시작에 실패했습니다")}>부문 시작</Button> : null}{division.status === "ongoing" ? <Button type="button" variant="destructive" onClick={() => command(() => progressService.admin.closeDivision(division.id), "부문 종료에 실패했습니다")}>부문 종료</Button> : null}{division.status === "closed" ? <Button type="button" variant="outline" onClick={() => command(() => progressService.admin.resetDivision(division.id), "부문 초기화에 실패했습니다")}>부문 초기화</Button> : null}</div> : null}
        <div className="h-px bg-border" />
        <div className="flex flex-col gap-2"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground"><Users className="size-3.5" aria-hidden="true" />현재 참가자</span>{division?.status === "ongoing" && runner ? <span className="flex gap-1"><Button type="button" size="sm" variant="outline" onClick={() => command(() => progressService.admin.postponeCurrentRunner(division.id), "순번 미루기에 실패했습니다")}><SkipForward className="size-3.5" aria-hidden="true" />순번 미루기</Button><Button type="button" size="sm" onClick={() => nextRunner && command(() => progressService.admin.setCurrentRunner(division.id, nextRunner.id), "다음 참가자 설정에 실패했습니다")} disabled={!nextRunner}>다음 참가자로</Button></span> : null}</div>{runner ? <div className="space-y-1.5 text-xs"><p className="flex justify-between gap-4"><span className="text-muted-foreground">이름</span><b>{runner.participant.name}</b></p><p className="flex justify-between gap-4"><span className="text-muted-foreground">소속</span><b>{runner.participant.teamName}</b></p><p className="flex justify-between gap-4"><span className="text-muted-foreground">기록 수</span><b>{runner.records.length}개</b></p></div> : <p className="rounded-lg border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">현재 참가자가 없습니다</p>}{nextRunner ? <p className="border-t border-dashed pt-2 text-xs text-blue-700 dark:text-blue-300">다음 참가자: {nextRunner.name}</p> : null}</div>
        <div className="h-px bg-border" />
        <div className="flex flex-col gap-2"><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground"><ListOrdered className="size-3.5" aria-hidden="true" />대기 중인 참가자</span><span className="rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{nextRunners.length}명</span></div>{nextRunners.length ? <ol className="overflow-hidden rounded-lg border divide-y">{nextRunners.map((participant, index) => <li key={participant.id} className="flex items-baseline gap-2 px-2.5 py-2 text-xs"><span className="w-4 font-mono text-muted-foreground">{index + 1}</span><b className="min-w-0 flex-1 truncate">{participant.name}</b><span className="max-w-2/5 truncate text-muted-foreground">{participant.teamName}</span></li>)}</ol> : <p className="rounded-lg border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">대기 중인 참가자가 없습니다</p>}</div>
      </>}</div>
  </section>;
}
