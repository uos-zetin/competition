import { useShallow } from "zustand/react/shallow";

import type { ManualRecordRepository } from "../api/types";

import { ManualRecordFormSchema } from "./schema";
import { useManualRecordStore } from "./store.zustand";
import type { ManualRecord, ManualRecordForm } from "./types";

export function createManualRecordService({ manualRecordRepository }: { manualRecordRepository: ManualRecordRepository }) {
  const useManualRecords = (): ManualRecord[] => useManualRecordStore((state) => state.manualRecords);
  const useByParticipant = (participantId: string): ManualRecord[] =>
    useManualRecordStore(
      useShallow((state) => state.manualRecords.filter((manualRecord) => manualRecord.participantId === participantId))
    );

  return {
    load: async (participantId: string): Promise<void> => {
      const manualRecords = await manualRecordRepository.getAllManualRecords(participantId);
      useManualRecordStore.getState().setByParticipant(participantId, manualRecords);
    },
    admin: {
      create: async (participantId: string, form: ManualRecordForm): Promise<ManualRecord> => {
        const manualRecord = await manualRecordRepository.createManualRecord(
          participantId,
          ManualRecordFormSchema.parse(form)
        );
        useManualRecordStore.getState().add(manualRecord);
        return manualRecord;
      },
      clear: async (participantId: string): Promise<void> => {
        await manualRecordRepository.deleteManualRecords(participantId);
        useManualRecordStore.getState().removeByParticipant(participantId);
      },
    },
    use: { manualRecords: useManualRecords, byParticipant: useByParticipant },
  };
}
