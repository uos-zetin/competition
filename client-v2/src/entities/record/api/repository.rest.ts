import type { Fetcher } from "@/shared/api";

import { parseRecordDto, parseRecordForm } from "../lib/parse-dto";
import type { Record, RecordForm, RecordStatus } from "../model/types";

import type { RecordDto, RecordRepository } from "./types";

export class RecordRestRepository implements RecordRepository {
  private readonly publicFetcher: Fetcher;
  private readonly authenticatedFetcher: Fetcher;

  constructor(publicFetcher: Fetcher, authenticatedFetcher: Fetcher) {
    this.publicFetcher = publicFetcher;
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getAllRecords(participantId: string): Promise<Record[]> {
    const response = await this.publicFetcher.get<RecordDto[]>(`/participants/${participantId}/records`);
    return response.data.map(parseRecordDto);
  }

  async getTopRecords(divisionId: string): Promise<Record[]> {
    const response = await this.publicFetcher.get<RecordDto[]>(`/divisions/${divisionId}/records/top`);
    return response.data.map(parseRecordDto);
  }

  async createRecord(participantId: string, form: RecordForm): Promise<Record> {
    const response = await this.authenticatedFetcher.post<RecordDto>(`/participants/${participantId}/records`, {
      body: parseRecordForm(form),
    });
    return parseRecordDto(response.data);
  }

  async updateRecordNote(recordId: string, note: string): Promise<Record> {
    const response = await this.authenticatedFetcher.patch<RecordDto>(`/records/${recordId}/note`, { body: { note } });
    return parseRecordDto(response.data);
  }

  async updateRecordStatus(recordId: string, status: RecordStatus): Promise<Record> {
    const response = await this.authenticatedFetcher.patch<RecordDto>(`/records/${recordId}/status`, {
      body: { status },
    });
    return parseRecordDto(response.data);
  }
}
