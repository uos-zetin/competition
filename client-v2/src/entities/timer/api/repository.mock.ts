import type { TimerLog } from "../model/types";

import type { TimerRepository } from "./types";

export class TimerMockRepository implements TimerRepository {
  private readonly logsByParticipant = new Map<string, TimerLog[]>();

  async getTimerLogs(participantId: string): Promise<TimerLog[]> {
    return [...(this.logsByParticipant.get(participantId) ?? [])];
  }

  async startTimer(participantId: string): Promise<TimerLog> {
    return this.append(participantId, "start", Date.now());
  }

  async stopTimer(participantId: string): Promise<TimerLog> {
    return this.append(participantId, "stop", Date.now());
  }

  async adjustTimer(participantId: string, type: "add" | "sub", value: number): Promise<TimerLog> {
    return this.append(participantId, type, value);
  }

  private append(participantId: string, type: TimerLog["type"], value: number): TimerLog {
    const log: TimerLog = { id: crypto.randomUUID(), participantId, value, type, createdAt: new Date() };
    const logs = this.logsByParticipant.get(participantId) ?? [];
    logs.push(log);
    this.logsByParticipant.set(participantId, logs);
    return log;
  }
}
