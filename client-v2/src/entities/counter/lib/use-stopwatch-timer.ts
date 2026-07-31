import { useCallback } from "react";

import { useRealTimeTimer } from "@/shared/lib";

import { getElapsedMs } from "./selectors";

export function useStopwatchTimer(startedAt: number | null, stoppedAt: number | null): number {
  const calculateValue = useCallback(
    (start: number | null, stop: number | null, now: number) => getElapsedMs(start, stop ?? now),
    []
  );
  return useRealTimeTimer(startedAt, stoppedAt, calculateValue);
}
