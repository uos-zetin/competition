import type { TimerControlDeps } from "./types";

export function createTimerControlService({ timerService }: TimerControlDeps) {
  return {
    control: {
      start: (participantId: string) => timerService.admin.start(participantId),
      stop: (participantId: string) => timerService.admin.stop(participantId),
      adjust: (participantId: string, type: "add" | "sub", value: number) =>
        timerService.admin.adjust(participantId, type, value),
    },
  };
}
