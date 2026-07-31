import type { ManualRecord, ManualRecordForm } from "../model/types";

import type { ManualRecordRepository } from "./types";

const seedManualRecords: ManualRecord[] = [
  {
    id: "manual-record-1",
    participantId: "participant-1",
    value: 52740,
    recorderName: "김심판",
    createdAt: new Date("2026-03-05T10:12:00+09:00"),
  },
  {
    id: "manual-record-2",
    participantId: "participant-1",
    value: 52810,
    recorderName: "이심판",
    createdAt: new Date("2026-03-05T10:13:00+09:00"),
  },
  {
    id: "manual-record-3",
    participantId: "participant-2",
    value: 49980,
    recorderName: "박심판",
    createdAt: new Date("2026-03-06T11:30:00+09:00"),
  },
];

export class ManualRecordMockRepository implements ManualRecordRepository {
  private manualRecords = seedManualRecords.map((manualRecord) => ({ ...manualRecord }));

  async getAllManualRecords(participantId: string): Promise<ManualRecord[]> {
    return this.manualRecords.filter((manualRecord) => manualRecord.participantId === participantId);
  }

  async createManualRecord(participantId: string, form: ManualRecordForm): Promise<ManualRecord> {
    const manualRecord: ManualRecord = {
      id: crypto.randomUUID(),
      participantId,
      ...form,
      createdAt: new Date(),
    };
    this.manualRecords.push(manualRecord);
    return manualRecord;
  }

  async deleteManualRecords(participantId: string): Promise<void> {
    this.manualRecords = this.manualRecords.filter((manualRecord) => manualRecord.participantId !== participantId);
  }
}
