import type { ManualRecord } from "@/entities/manual-record";
import type { Record, RecordForm } from "@/entities/record";

export interface ManualRecordAggregationDeps {
  manualRecordService: {
    use: { byParticipant: (participantId: string) => ManualRecord[] };
  };
  recordService: {
    admin: { create: (participantId: string, form: RecordForm) => Promise<Record> };
  };
}
