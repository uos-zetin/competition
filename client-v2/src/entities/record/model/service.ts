import { useShallow } from "zustand/react/shallow";

import type { RecordRepository } from "../api/types";

import { RecordFormSchema } from "./schema";
import { useRecordStore } from "./store.zustand";
import type { Record, RecordForm, RecordStatus } from "./types";

export function createRecordService({ recordRepository }: { recordRepository: RecordRepository }) {
  const useRecords = (): Record[] => useRecordStore((state) => state.records);
  const useRecordsByParticipant = (participantId: string): Record[] =>
    useRecordStore(useShallow((state) => state.records.filter((record) => record.participantId === participantId)));
  const useRecordById = (recordId: string): Record | undefined =>
    useRecordStore((state) => state.records.find((record) => record.id === recordId));

  return {
    load: {
      byParticipant: async (participantId: string): Promise<void> => {
        const records = await recordRepository.getAllRecords(participantId);
        useRecordStore.getState().addMany(records);
      },
      topByDivision: async (divisionId: string): Promise<void> => {
        const records = await recordRepository.getTopRecords(divisionId);
        useRecordStore.getState().addMany(records);
      },
    },
    admin: {
      create: async (participantId: string, form: RecordForm): Promise<Record> => {
        const record = await recordRepository.createRecord(participantId, RecordFormSchema.parse(form));
        useRecordStore.getState().add(record);
        return record;
      },
      updateNote: async (recordId: string, note: string): Promise<Record> => {
        const record = await recordRepository.updateRecordNote(recordId, note);
        useRecordStore.getState().update(record);
        return record;
      },
      updateStatus: async (recordId: string, status: RecordStatus): Promise<Record> => {
        const record = await recordRepository.updateRecordStatus(recordId, status);
        useRecordStore.getState().update(record);
        return record;
      },
    },
    use: {
      records: useRecords,
      recordsByParticipant: useRecordsByParticipant,
      recordById: useRecordById,
    },
  };
}
