import type { Fetcher } from "@/shared/api";

import { parseDivisionDto, parseDivisionForm } from "../lib/parse-dto";
import type { Division, DivisionFormValues } from "../model/types";

import type { DivisionDto, DivisionRepository } from "./types";

export class DivisionRestRepository implements DivisionRepository {
  private readonly publicFetcher: Fetcher;
  private readonly authenticatedFetcher: Fetcher;

  constructor(publicFetcher: Fetcher, authenticatedFetcher: Fetcher) {
    this.publicFetcher = publicFetcher;
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getAllDivisions(competitionId: string): Promise<Division[]> {
    const response = await this.publicFetcher.get<DivisionDto[]>(`/competitions/${competitionId}/divisions`);
    return response.data.map(parseDivisionDto);
  }

  async getDivisionById(divisionId: string): Promise<Division | null> {
    const response = await this.publicFetcher.get<DivisionDto>(`/divisions/${divisionId}`);
    return response.data ? parseDivisionDto(response.data) : null;
  }

  async createDivision(competitionId: string, form: DivisionFormValues): Promise<Division> {
    const response = await this.authenticatedFetcher.post<DivisionDto>(`/competitions/${competitionId}/divisions`, {
      body: parseDivisionForm(form),
    });
    return parseDivisionDto(response.data);
  }

  async updateDivision(division: Division): Promise<Division | null> {
    const response = await this.authenticatedFetcher.patch<DivisionDto>(`/divisions/${division.id}`, {
      body: parseDivisionForm(division),
    });
    return response.data ? parseDivisionDto(response.data) : null;
  }

  async deleteDivision(divisionId: string): Promise<void> {
    await this.authenticatedFetcher.delete(`/divisions/${divisionId}`);
  }
}
