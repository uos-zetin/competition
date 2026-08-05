import { Badge } from "@/shared/ui";
import { formatElapsedMs, getElapsedMs, isRunning } from "@/entities/counter";

type CounterRunTagProps = {
  startedAt: number | null;
  stoppedAt: number | null;
};

export function CounterRunTag({ startedAt, stoppedAt }: CounterRunTagProps) {
  const running = isRunning(startedAt, stoppedAt);

  return (
    <Badge
      className={
        running
          ? "shrink-0 border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "shrink-0 border-transparent bg-muted text-muted-foreground"
      }
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {running ? `진행 중 · ${formatElapsedMs(getElapsedMs(startedAt, stoppedAt))}` : "대기 중"}
    </Badge>
  );
}
