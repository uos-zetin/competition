export type ManualRecord = {
  id: string;
  participantId: string;
  value: number;
  recorderName: string;
  createdAt: Date;
};

export type ManualRecordForm = Pick<ManualRecord, "value" | "recorderName">;

export interface ManualRecordStore {
  manualRecords: ManualRecord[];
  setByParticipant: (participantId: string, manualRecords: ManualRecord[]) => void;
  add: (manualRecord: ManualRecord) => void;
  removeByParticipant: (participantId: string) => void;
  clearAll: () => void;
}
