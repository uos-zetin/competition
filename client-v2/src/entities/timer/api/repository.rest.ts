import type { Fetcher } from "@/shared/api";

import { parseTimerLogDto } from "../lib/parse-dto";

import type { TimerLogDto, TimerRepository } from "./types";

export class TimerRestRepository implements TimerRepository {
  private readonly fetcher: Fetcher;
  private readonly authFetcher: Fetcher;

  constructor(fetcher: Fetcher, authFetcher: Fetcher) {
    this.fetcher = fetcher;
    this.authFetcher = authFetcher;
  }

  async getTimerLogs(participantId: string) {
    const response = await this.fetcher.get<TimerLogDto[]>(`/participants/${participantId}/timer/logs`);
    return response.data.map(parseTimerLogDto);
  }

  async startTimer(participantId: string) {
    const response = await this.authFetcher.post<TimerLogDto>(`/participants/${participantId}/timer/start`);
    return parseTimerLogDto(response.data);
  }

  async stopTimer(participantId: string) {
    const response = await this.authFetcher.post<TimerLogDto>(`/participants/${participantId}/timer/stop`);
    return parseTimerLogDto(response.data);
  }

  async adjustTimer(participantId: string, type: "add" | "sub", value: number) {
    const response = await this.authFetcher.post<TimerLogDto>(`/participants/${participantId}/timer/adjust`, {
      body: { adjustmentMs: type === "sub" ? -value : value },
    });
    return parseTimerLogDto(response.data);
  }
}
