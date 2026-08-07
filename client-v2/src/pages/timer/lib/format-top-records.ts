import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";

export type TopRecord = {
  id: string;
  participantName: string;
  participantTeamName: string;
  timeMs: number;
};

export function formatTopRecords(records: Record[], participants: Participant[]): TopRecord[] {
  const participantsById = new Map(participants.map((participant) => [participant.id, participant]));

  return records.map((record) => {
    const participant = participantsById.get(record.participantId);
    return {
      id: record.id,
      participantName: participant?.name ?? `Participant ${record.participantId.slice(0, 8)}`,
      participantTeamName: participant?.teamName ?? "",
      timeMs: record.value,
    };
  });
}
