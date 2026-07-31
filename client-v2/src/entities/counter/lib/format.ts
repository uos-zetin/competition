import { formatMsToClock } from "@/shared/lib";

export function formatElapsedMs(ms: number): string {
  return formatMsToClock(ms);
}
