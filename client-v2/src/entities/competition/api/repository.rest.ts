import type { Fetcher } from "@/shared/api";

import { parseCompetitionDto, parseCompetitionForm } from "../lib/parse-dto";
import type { Competition, CompetitionForm } from "../model/types";

import type { CompetitionDto, CompetitionRepository } from "./types";

export class CompetitionRestRepository implements CompetitionRepository {
  private readonly publicFetcher: Fetcher;
  private readonly authenticatedFetcher: Fetcher;

  constructor(publicFetcher: Fetcher, authenticatedFetcher: Fetcher) {
    this.publicFetcher = publicFetcher;
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getAllCompetitions(): Promise<Competition[]> {
    const response = await this.publicFetcher.get<CompetitionDto[]>("/competitions");
    return response.data.map(parseCompetitionDto);
  }

  async getCompetitionById(competitionId: string): Promise<Competition | null> {
    const response = await this.publicFetcher.get<CompetitionDto>(`/competitions/${competitionId}`);
    return response.data ? parseCompetitionDto(response.data) : null;
  }

  async createCompetition(form: CompetitionForm): Promise<Competition> {
    const response = await this.authenticatedFetcher.post<CompetitionDto>("/competitions", {
      body: parseCompetitionForm(form),
    });
    return parseCompetitionDto(response.data);
  }

  async updateCompetition(competition: Competition): Promise<Competition> {
    const response = await this.authenticatedFetcher.patch<CompetitionDto>(`/competitions/${competition.id}`, {
      body: parseCompetitionForm(competition),
    });
    return parseCompetitionDto(response.data);
  }

  async deleteCompetition(competitionId: string): Promise<void> {
    await this.authenticatedFetcher.delete(`/competitions/${competitionId}`);
  }
}
