import { Play, RotateCcw, Square, Timer } from "lucide-react";

import { Badge, Button, TimeDisplay } from "@/shared/ui";
import { formatElapsedMs, useStopwatchTimer } from "@/entities/counter";

type StopwatchPanelProps = {
  startedAt: number | null;
  stoppedAt: number | null;
  disableStart: boolean;
  isStarting: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};

export function StopwatchPanel({
  startedAt,
  stoppedAt,
  disableStart,
  isStarting,
  onStart,
  onStop,
  onReset,
}: StopwatchPanelProps) {
  const elapsedMs = useStopwatchTimer(startedAt, stoppedAt);
  const isRunning = startedAt !== null && stoppedAt === null;
  const hasRecord = startedAt !== null && stoppedAt !== null;
  const status = isRunning ? "측정 중" : hasRecord ? "측정 완료" : "대기";

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Timer className="size-4 text-muted-foreground" aria-hidden="true" />
          스톱워치
        </div>
        <Badge
          className={
            isRunning
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : hasRecord
                ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                : "border-border bg-muted text-muted-foreground"
          }
        >
          {status}
        </Badge>
      </header>
      <div className="space-y-4 p-4">
        <TimeDisplay value={formatElapsedMs(elapsedMs)} className="rounded-lg bg-muted/50 py-5" />
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="lg"
              className="h-24 text-base font-bold sm:h-28"
              onClick={onStart}
              disabled={isRunning || disableStart || isStarting}
            >
              <Play className="size-6" aria-hidden="true" />
              {isStarting ? "확인 중..." : "시작"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-24 text-base font-bold sm:h-28"
              onClick={onStop}
              disabled={!isRunning}
            >
              <Square className="size-6" aria-hidden="true" />
              정지
            </Button>
          </div>
          <Button type="button" variant="ghost" className="w-full" onClick={onReset} disabled={isRunning}>
            <RotateCcw aria-hidden="true" />
            리셋
          </Button>
        </div>
      </div>
    </section>
  );
}
