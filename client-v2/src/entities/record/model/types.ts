export type RecordSource = "stopwatch" | "manual" | "other";
export type RecordStatus = "pending" | "approved" | "rejected";

export type Record = {
  id: string;
  participantId: string;
  value: number;
  source: RecordSource;
  status: RecordStatus;
  note: string;
  createdAt: Date;
};

export type RecordForm = Pick<Record, "value" | "source" | "note">;

export interface RecordStore {
  records: Record[];
  init: (records: Record[]) => void;
  addMany: (records: Record[]) => void;
  add: (record: Record) => void;
  update: (record: Record) => void;
  remove: (recordId: string) => void;
  clearAll: () => void;
}
