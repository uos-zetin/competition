import type { Fetcher } from "@/shared/api";

import { parseParticipantDto, parseParticipantForm } from "../lib/parse-dto";
import type { Participant, ParticipantForm } from "../model/types";

import type { ParticipantDto, ParticipantRepository } from "./types";

export class ParticipantRestRepository implements ParticipantRepository {
  private readonly publicFetcher: Fetcher;
  private readonly authenticatedFetcher: Fetcher;

  constructor(publicFetcher: Fetcher, authenticatedFetcher: Fetcher) {
    this.publicFetcher = publicFetcher;
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getParticipantsByDivision(divisionId: string): Promise<Participant[]> {
    const response = await this.publicFetcher.get<ParticipantDto[]>(`/divisions/${divisionId}/participants`);
    return response.data.map(parseParticipantDto);
  }

  async getParticipantById(participantId: string): Promise<Participant | null> {
    const response = await this.publicFetcher.get<ParticipantDto>(`/participants/${participantId}`);
    return response.data ? parseParticipantDto(response.data) : null;
  }

  async createParticipant(form: ParticipantForm): Promise<Participant> {
    const response = await this.authenticatedFetcher.post<ParticipantDto>("/participants", {
      body: parseParticipantForm(form),
    });
    return parseParticipantDto(response.data);
  }

  async createParticipants(divisionId: string, forms: ParticipantForm[]): Promise<Participant[]> {
    const response = await this.authenticatedFetcher.post<ParticipantDto[]>(`/divisions/${divisionId}/participants/bulk`, {
      body: { participants: forms.map(parseParticipantForm) },
    });
    return response.data.map(parseParticipantDto);
  }

  async updateParticipant(participant: Participant): Promise<Participant> {
    const response = await this.authenticatedFetcher.patch<ParticipantDto>(`/participants/${participant.id}`, {
      body: parseParticipantForm(participant),
    });
    return parseParticipantDto(response.data);
  }

  async deleteParticipant(participantId: string): Promise<void> {
    await this.authenticatedFetcher.delete(`/participants/${participantId}`);
  }
}
