import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";

export type TopRecordRow = {
  rank: number;
  participantId: string;
  name: string;
  teamMeta: string;
  valueMs: number;
};

export function formatTopRecords(records: Record[], participants: Participant[], variant: "mini" | "full"): TopRecordRow[] {
  const participantsById = new Map(participants.map((participant) => [participant.id, participant]));

  return records
    .filter((record) => participantsById.has(record.participantId))
    .sort((left, right) => left.value - right.value)
    .map((record, index) => {
      const participant = participantsById.get(record.participantId)!;
      const teamName = participant.teamName || "개인 참가";

      return {
        rank: index + 1,
        participantId: participant.id,
        name: participant.name,
        teamMeta: variant === "mini" ? teamName : `${teamName}${participant.robotName ? ` · ${participant.robotName}` : ""}`,
        valueMs: record.value,
      };
    });
}
