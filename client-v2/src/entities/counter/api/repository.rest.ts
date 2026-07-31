import type { Fetcher } from "@/shared/api";

import { parseCounterDto } from "../lib/parse-dto";

import type { CounterDto, CounterRepository } from "./types";

export class CounterRestRepository implements CounterRepository {
  private readonly authenticatedFetcher: Fetcher;

  constructor(authenticatedFetcher: Fetcher) {
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getAll() {
    const response = await this.authenticatedFetcher.get<CounterDto[]>("/counters");
    return response.data.map(parseCounterDto);
  }

  async getById(counterId: string) {
    const response = await this.authenticatedFetcher.get<CounterDto>(`/counters/${counterId}`);
    return response.data ? parseCounterDto(response.data) : null;
  }

  async reset(counterId: string): Promise<void> {
    await this.authenticatedFetcher.post(`/counters/${counterId}/reset`);
  }

  async connectDivision(counterId: string, divisionId: string): Promise<void> {
    await this.authenticatedFetcher.patch(`/counters/${counterId}/division`, { body: { divisionId } });
  }

  async disconnectDivision(counterId: string): Promise<void> {
    await this.authenticatedFetcher.delete(`/counters/${counterId}/division`);
  }
}
