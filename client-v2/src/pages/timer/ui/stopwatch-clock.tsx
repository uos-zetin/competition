import { TimeDisplay } from "@/shared/ui";
import { counterService, formatElapsedMs, useStopwatchTimer } from "@/entities/counter";

export function StopwatchClock({ counterId }: { counterId: string }) {
  const { startedAt, stoppedAt } = counterService.use.stopwatch(counterId);
  const elapsedMs = useStopwatchTimer(startedAt, stoppedAt);
  return (
    <div className="@container flex w-full flex-col items-center">
        <p className="mb-1 text-[clamp(1rem,2.2cqi,1.7rem)] font-semibold text-muted-foreground">기록 측정</p>
      <TimeDisplay value={formatElapsedMs(elapsedMs)} className="w-full" />
    </div>
  );
}
