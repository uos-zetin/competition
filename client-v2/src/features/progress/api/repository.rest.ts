import type { Fetcher } from "@/shared/api";

import { parseProgressDto } from "../lib/parse-dto";

import type { ProgressDto, ProgressRepository } from "./types";

export class ProgressRestRepository implements ProgressRepository {
  private readonly authenticatedFetcher: Fetcher;

  constructor(authenticatedFetcher: Fetcher) {
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getProgress(divisionId: string) {
    const response = await this.authenticatedFetcher.get<ProgressDto>(`/divisions/${divisionId}/progress`);
    return parseProgressDto(response.data);
  }

  async openProgressDivision(divisionId: string): Promise<void> { await this.authenticatedFetcher.post(`/divisions/${divisionId}/progress/open`); }
  async closeProgressDivision(divisionId: string): Promise<void> { await this.authenticatedFetcher.post(`/divisions/${divisionId}/progress/close`); }
  async resetProgressDivision(divisionId: string): Promise<void> { await this.authenticatedFetcher.post(`/divisions/${divisionId}/progress/reset`); }
  async setCurrentRunner(divisionId: string, participantId: string): Promise<void> { await this.authenticatedFetcher.patch(`/divisions/${divisionId}/progress/runner`, { body: { participantId } }); }
  async postponeCurrentRunner(divisionId: string): Promise<void> { await this.authenticatedFetcher.post(`/divisions/${divisionId}/progress/runner/postpone`); }
}
