import type { Fetcher } from "@/shared/api";

import { parseManualRecordDto, parseManualRecordForm } from "../lib/parse-dto";
import type { ManualRecord, ManualRecordForm } from "../model/types";

import type { ManualRecordDto, ManualRecordRepository } from "./types";

export class ManualRecordRestRepository implements ManualRecordRepository {
  private readonly publicFetcher: Fetcher;
  private readonly authenticatedFetcher: Fetcher;

  constructor(publicFetcher: Fetcher, authenticatedFetcher: Fetcher) {
    this.publicFetcher = publicFetcher;
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getAllManualRecords(participantId: string): Promise<ManualRecord[]> {
    const response = await this.publicFetcher.get<ManualRecordDto[]>(`/participants/${participantId}/manual-records`);
    return response.data.map(parseManualRecordDto);
  }

  async createManualRecord(participantId: string, form: ManualRecordForm): Promise<ManualRecord> {
    const response = await this.authenticatedFetcher.post<ManualRecordDto>(`/participants/${participantId}/manual-records`, {
      body: parseManualRecordForm(form),
    });
    return parseManualRecordDto(response.data);
  }

  async deleteManualRecords(participantId: string): Promise<void> {
    await this.authenticatedFetcher.delete(`/participants/${participantId}/manual-records`);
  }
}
