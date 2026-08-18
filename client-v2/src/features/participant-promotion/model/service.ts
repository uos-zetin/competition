import type { Division, DivisionFormValues } from "@/entities/division";
import type { Participant, ParticipantForm } from "@/entities/participant";

import type { ItemOutcome, ParticipantPromotionParams, PromotionResult } from "./types";

type Dependencies = {
  divisionService: { admin: { create: (competitionId: string, form: DivisionFormValues) => Promise<Division> } };
  participantService: { admin: { create: (form: ParticipantForm) => Promise<Participant> } };
};

const skipped = (reason: string): ItemOutcome<never> => ({ status: "skipped", reason });
const message = (value: unknown) =>
  typeof value === "object" && value && "issues" in value
    ? String((value as { issues?: { message?: string }[] }).issues?.[0]?.message ?? "처리 중 오류가 발생했습니다")
    : value instanceof Error
      ? value.message
      : String(value);
const settledOutcome = <T>(result: PromiseSettledResult<T>): ItemOutcome<T> =>
  result.status === "fulfilled"
    ? { status: "success", data: result.value }
    : { status: "failed", error: message(result.reason) };

export function createParticipantPromotionService({ divisionService, participantService }: Dependencies) {
  return {
    async run({
      competitionId,
      newDivision,
      sourceParticipants,
    }: ParticipantPromotionParams): Promise<PromotionResult> {
      let division: Division;
      try {
        division = await divisionService.admin.create(competitionId, newDivision);
      } catch (cause) {
        return {
          division: { status: "failed", error: message(cause) },
          participants: sourceParticipants.map(({ participant }) => ({
            source: participant,
            outcome: skipped("부문 생성에 실패했습니다"),
          })),
        };
      }

      const outcomes = await Promise.allSettled(
        sourceParticipants.map(({ participant, orderRaw }) =>
          participantService.admin.create({
            divisionId: division.id,
            name: participant.name,
            teamName: participant.teamName,
            robotName: participant.robotName,
            comment: participant.comment,
            orderRaw,
          })
        )
      );

      return {
        division: { status: "success", data: division },
        participants: sourceParticipants.map(({ participant }, index) => ({
          source: participant,
          outcome: settledOutcome(outcomes[index]),
        })),
      };
    },
  };
}
