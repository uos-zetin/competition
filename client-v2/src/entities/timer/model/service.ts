import type { TimerRepository } from "../api/types";

import type { TimerLog } from "./types";

export function createTimerService({ timerRepository }: { timerRepository: TimerRepository }) {
  return {
    load: {
      logs: (participantId: string): Promise<TimerLog[]> => timerRepository.getTimerLogs(participantId),
    },
    admin: {
      start: (participantId: string): Promise<TimerLog> => timerRepository.startTimer(participantId),
      stop: (participantId: string): Promise<TimerLog> => timerRepository.stopTimer(participantId),
      adjust: (participantId: string, type: "add" | "sub", value: number): Promise<TimerLog> =>
        timerRepository.adjustTimer(participantId, type, value),
    },
  };
}
