import { useCallback } from "react";

import { useRealTimeTimer } from "@/shared/lib";

import type { TimerState } from "../model/types";

import { getRemainingMs } from "./selectors";

export function useCountdownTimer(timerState: TimerState): number {
  const calculateValue = useCallback(
    (_startedAt: number | null, _stoppedAt: number | null, now: number) => getRemainingMs(timerState, now),
    [timerState]
  );
  return useRealTimeTimer(timerState.startedAt, timerState.startedAt ? null : 0, calculateValue);
}
