import type { Participant } from "../model/types";

export function findOrderConflict(
  participants: Participant[],
  params: { divisionId: string; orderRaw: number; excludeParticipantId?: string }
): Participant | undefined {
  return participants.find(
    (participant) =>
      participant.divisionId === params.divisionId &&
      participant.orderRaw === params.orderRaw &&
      participant.id !== params.excludeParticipantId
  );
}
