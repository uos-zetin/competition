import type { Record, RecordForm, RecordStatus } from "../model/types";

import type { RecordRepository } from "./types";

const seedRecords: Record[] = [
  {
    id: "record-approved",
    participantId: "participant-1",
    value: 52740,
    source: "stopwatch",
    status: "approved",
    note: "안정적인 주행",
    createdAt: new Date("2026-03-05T10:12:00+09:00"),
  },
  {
    id: "record-pending",
    participantId: "participant-1",
    value: 54120,
    source: "manual",
    status: "pending",
    note: "영상 확인 필요",
    createdAt: new Date("2026-03-06T11:30:00+09:00"),
  },
  {
    id: "record-rejected",
    participantId: "participant-2",
    value: 49980,
    source: "other",
    status: "rejected",
    note: "코스 이탈",
    createdAt: new Date("2026-03-04T14:20:00+09:00"),
  },
];

export class RecordMockRepository implements RecordRepository {
  private records = seedRecords.map((record) => ({ ...record }));

  async getAllRecords(participantId: string): Promise<Record[]> {
    return this.records.filter((record) => record.participantId === participantId);
  }

  async getTopRecords(divisionId: string): Promise<Record[]> {
    void divisionId;
    return [...this.records].sort((first, second) => first.value - second.value).slice(0, 10);
  }

  async createRecord(participantId: string, form: RecordForm): Promise<Record> {
    const record: Record = {
      id: crypto.randomUUID(),
      participantId,
      ...form,
      status: "pending",
      createdAt: new Date(),
    };
    this.records.push(record);
    return record;
  }

  async updateRecordNote(recordId: string, note: string): Promise<Record> {
    const record = this.findRecord(recordId);
    record.note = note;
    return record;
  }

  async updateRecordStatus(recordId: string, status: RecordStatus): Promise<Record> {
    const record = this.findRecord(recordId);
    record.status = status;
    return record;
  }

  private findRecord(recordId: string): Record {
    const record = this.records.find((item) => item.id === recordId);
    if (!record) throw new Error(`Record not found: ${recordId}`);
    return record;
  }
}
