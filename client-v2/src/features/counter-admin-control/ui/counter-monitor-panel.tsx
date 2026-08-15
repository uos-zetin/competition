import { useState } from "react";

import { Clock3 } from "lucide-react";

import { formatTimeShort } from "@/shared/lib";
import { Button, ConfirmDialog, TimeDisplay } from "@/shared/ui";
import { formatElapsedMs, isRunning, useStopwatchTimer } from "@/entities/counter";
// Error handling is the architecture's designated cross-cutting feature exception.
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-cross-slice-dependency
import { errorHandlingService } from "@/features/error-handling";

import { counterAdminControlService } from "../model";

interface CounterMonitorPanelProps {
  counterId: string;
}

export function CounterMonitorPanel({ counterId }: CounterMonitorPanelProps) {
  const [resetOpen, setResetOpen] = useState(false);
  const stopwatch = counterAdminControlService.use.stopwatch(counterId);
  const elapsedMs = useStopwatchTimer(stopwatch.startedAt, stopwatch.stoppedAt);
  const idle = stopwatch.startedAt === null;
  const running = isRunning(stopwatch.startedAt, stopwatch.stoppedAt);

  const handleReset = async () => {
    try {
      await counterAdminControlService.control.reset(counterId);
    } catch (error) {
      errorHandlingService.handle(error, "계수기 리셋에 실패했습니다");
    }
  };

  const status = idle ? "대기 중" : running ? "측정 중" : "측정 완료";

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
          계수기 모니터
        </div>
        <p className="mt-1 pl-6 text-xs text-muted-foreground">측정 시간과 리셋을 관리합니다</p>
      </header>
      <div className="flex flex-col gap-4 p-4">
        <TimeDisplay value={formatElapsedMs(elapsedMs)} className="py-1" />
        <div className="flex justify-center">
          <span
            className={
              running
                ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                : "inline-flex items-center gap-1.5 rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
            }
          >
            {running ? <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" /> : null}
            {status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <TimeMark label="시작 시간" value={stopwatch.startedAt ? formatTimeShort(new Date(stopwatch.startedAt)) : "---"} />
          <TimeMark label="종료 시간" value={stopwatch.stoppedAt ? formatTimeShort(new Date(stopwatch.stoppedAt)) : "---"} />
        </div>
        {!idle ? (
          <Button type="button" variant="destructive" onClick={() => setResetOpen(true)}>
            계수기 리셋
          </Button>
        ) : null}
      </div>
      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        variant="destructive"
        title="계수기 리셋"
        message="계수기를 리셋하시겠습니까? 모든 시간 데이터가 초기화됩니다."
        confirmLabel="리셋"
        onConfirm={handleReset}
      />
    </section>
  );
}

function TimeMark({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted px-2.5 py-2">
      <p className="mb-0.5 text-[0.65rem] font-semibold text-muted-foreground">{label}</p>
      <p className="text-xs tabular-nums">{value}</p>
    </div>
  );
}
