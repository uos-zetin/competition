export type TimerLogType = "start" | "stop" | "add" | "sub";

export interface TimerLog {
  id: string;
  participantId: string;
  value: number;
  type: TimerLogType;
  createdAt: Date;
}

export interface TimerState {
  initialMs: number;
  offsetMs: number;
  accumulatedMs: number;
  startedAt: number | null;
}
