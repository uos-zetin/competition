import type { TimerState } from "../model/types";

export function getRemainingMs(state: TimerState, now = Date.now()): number {
  const base = state.initialMs + state.offsetMs;
  const elapsed = state.accumulatedMs + (state.startedAt ? now - state.startedAt : 0);
  return Math.max(base - elapsed, 0);
}

export function getStatus(state: TimerState): "running" | "stopped" | "finished" {
  if (getRemainingMs(state) === 0) return "finished";
  return state.startedAt ? "running" : "stopped";
}
