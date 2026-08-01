import type { TimerLog } from "@/entities/timer";

export interface TimerControlDeps {
  timerService: {
    admin: {
      start: (participantId: string) => Promise<TimerLog>;
      stop: (participantId: string) => Promise<TimerLog>;
      adjust: (participantId: string, type: "add" | "sub", value: number) => Promise<TimerLog>;
    };
  };
}
