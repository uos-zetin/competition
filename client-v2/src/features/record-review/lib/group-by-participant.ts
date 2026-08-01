import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";

export interface ParticipantRecordGroup {
  participant: Participant;
  records: Record[];
  bestValue: number;
}

export function groupRecordsByParticipant(records: Record[], participants: Participant[]): ParticipantRecordGroup[] {
  return participants
    .map((participant) => {
      const participantRecords = records.filter((record) => record.participantId === participant.id);

      return {
        participant,
        records: participantRecords,
        bestValue: Math.min(...participantRecords.map((record) => record.value)),
      };
    })
    .filter((group) => group.records.length > 0);
}
