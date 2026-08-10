import { Play,RotateCcw, Square, Timer } from "lucide-react";

import { Badge, Button, TimeDisplay } from "@/shared/ui";
import { formatElapsedMs, useStopwatchTimer } from "@/entities/counter";

type StopwatchPanelProps = {
  startedAt: number | null;
  stoppedAt: number | null;
  noRunner: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};

export function StopwatchPanel({ startedAt, stoppedAt, noRunner, onStart, onStop, onReset }: StopwatchPanelProps) {
  const elapsedMs = useStopwatchTimer(startedAt, stoppedAt);
  const isRunning = startedAt !== null && stoppedAt === null;
  const hasRecord = startedAt !== null && stoppedAt !== null;
  const status = isRunning ? "측정 중" : hasRecord ? "측정 완료" : "대기";

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold"><Timer className="size-4 text-muted-foreground" aria-hidden="true" />스톱워치</div>
        <Badge className={isRunning ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : hasRecord ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300" : "border-border bg-muted text-muted-foreground"}>{status}</Badge>
      </header>
      <div className="space-y-4 p-4">
        <TimeDisplay value={formatElapsedMs(elapsedMs)} className="rounded-lg bg-muted/50 py-5" />
        <div className="grid grid-cols-3 gap-2">
          <Button type="button" onClick={onStart} disabled={isRunning || noRunner}><Play aria-hidden="true" />시작</Button>
          <Button type="button" variant="outline" onClick={onStop} disabled={!isRunning}><Square aria-hidden="true" />정지</Button>
          <Button type="button" variant="ghost" onClick={onReset} disabled={isRunning}><RotateCcw aria-hidden="true" />리셋</Button>
        </div>
      </div>
    </section>
  );
}
