import type { Division, DivisionFormValues } from "@/entities/division";
import type { Participant } from "@/entities/participant";

export type ItemOutcome<T> =
  { status: "success"; data: T } | { status: "failed"; error: string } | { status: "skipped"; reason: string };

export type PromotionParticipantResult = {
  source: Participant;
  outcome: ItemOutcome<Participant>;
};

export type PromotionResult = {
  division: ItemOutcome<Division>;
  participants: PromotionParticipantResult[];
};

export type PromotionSourceParticipant = {
  participant: Participant;
  orderRaw: number;
};

export type ParticipantPromotionParams = {
  competitionId: string;
  newDivision: DivisionFormValues;
  sourceParticipants: PromotionSourceParticipant[];
};
