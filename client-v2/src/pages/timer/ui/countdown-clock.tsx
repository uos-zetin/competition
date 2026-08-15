import { TimeDisplay } from "@/shared/ui";
import { formatMsToTime, integrateLogs, useCountdownTimer } from "@/entities/timer";
import { progressService } from "@/features/progress";

export function CountdownClock() {
  const division = progressService.use.division();
  const timerLogs = progressService.use.runner()?.timerLogs ?? [];
  const remainingMs = useCountdownTimer(integrateLogs((division?.timeLimit ?? 0) * 1000, timerLogs));

  return (
    <Clock label="제한시간">
      <TimeDisplay
        value={formatMsToTime(remainingMs)}
        className={remainingMs < 10_000 ? "w-full [&>div]:text-destructive" : "w-full"}
      />
    </Clock>
  );
}

function Clock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="@container flex w-full flex-col items-center">
      <p className="mb-1 text-[clamp(1.1rem,2.8cqi,2.1rem)] font-semibold text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
