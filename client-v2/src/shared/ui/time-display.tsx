import { cn } from "@/shared/lib";

export interface TimeDisplayProps {
  value: string;
  className?: string;
}

export function TimeDisplay({ value, className }: TimeDisplayProps) {
  const [minutesSeconds = "00:00", fraction = "00"] = value.split(".");
  const [minutes = "00", seconds = "00"] = minutesSeconds.split(":");

  return (
    <div className={cn("@container", className)}>
      <div className="flex items-baseline justify-center font-bold leading-none tabular-nums text-foreground">
        <span className="text-[clamp(2rem,15cqi,8rem)]">{minutes}</span>
        <span className="mx-[0.06em] text-[clamp(1.6rem,12cqi,6.4rem)] text-muted-foreground">:</span>
        <span className="text-[clamp(2rem,15cqi,8rem)]">{seconds}</span>
        <span className="text-[clamp(1.6rem,12cqi,6.4rem)] text-muted-foreground">.</span>
        <span className="text-[clamp(1.15rem,9cqi,4.8rem)] text-muted-foreground">{fraction}</span>
      </div>
    </div>
  );
}
