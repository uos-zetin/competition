import type { Competition, CompetitionForm } from "@/entities/competition";
import type { Division, DivisionFormValues } from "@/entities/division";
import type { Participant, ParticipantForm } from "@/entities/participant";

import { parseCsv } from "../lib/parse-csv";

import type {
  CsvImportEdits,
  CsvImportOptions,
  CsvImportRunResult,
  CsvParseResult,
  DivisionImportItem,
  ItemOutcome,
  ParsedParticipantRow,
  ParticipantImportItem,
} from "./types";

type Dependencies = {
  competitionService: { admin: { create: (form: CompetitionForm) => Promise<Competition> } };
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
const formFor = (row: ParsedParticipantRow, divisionId: string): ParticipantForm => ({
  ...row,
  divisionId,
  orderRaw: parseInt(row.orderRaw, 10) || 0,
});

export function createCsvImportService(deps: Dependencies) {
  const createParticipants = async (
    items: { divisionGroupId: string; row: ParsedParticipantRow; divisionId?: string }[]
  ): Promise<ParticipantImportItem[]> => {
    const attempted = items.filter(
      (item): item is { divisionGroupId: string; row: ParsedParticipantRow; divisionId: string } =>
        Boolean(item.divisionId)
    );
    const outcomes = await Promise.allSettled(
      attempted.map((item) => deps.participantService.admin.create(formFor(item.row, item.divisionId)))
    );
    const byId = new Map(attempted.map((item, index) => [item.row.rowId, settledOutcome(outcomes[index])]));
    return items.map((item) => ({
      divisionGroupId: item.divisionGroupId,
      row: item.row,
      outcome: byId.get(item.row.rowId) ?? skipped("소속 부문 생성에 실패했습니다"),
    }));
  };
  const runAfterCompetition = async (
    competition: Competition,
    parsed: CsvParseResult,
    options: CsvImportOptions,
    names: Record<string, string> = {}
  ): Promise<Omit<CsvImportRunResult, "competition">> => {
    const settings = new Map(options.divisionSettings.map((setting) => [setting.groupId, setting]));
    const requested = parsed.divisionGroups.map((group) => ({
      group,
      name: names[group.groupId] ?? group.divisionName,
    }));
    const results = await Promise.allSettled(
      requested.map(({ group, name }) => {
        const setting = settings.get(group.groupId)!;
        return deps.divisionService.admin.create(competition.id, {
          name,
          description: setting.description,
          timeLimit: setting.timeLimit,
        });
      })
    );
    const divisions: DivisionImportItem[] = requested.map(({ group, name }, index) => ({
      groupId: group.groupId,
      divisionName: name,
      outcome: settledOutcome(results[index]),
    }));
    const participants = await createParticipants(
      requested.flatMap(({ group }, index) => {
        const outcome = divisions[index].outcome;
        return group.participants.map((row) => ({
          divisionGroupId: group.groupId,
          row,
          divisionId: outcome.status === "success" ? outcome.data.id : undefined,
        }));
      })
    );
    return { divisions, participants };
  };
  const run = async (parsed: CsvParseResult, options: CsvImportOptions): Promise<CsvImportRunResult> => {
    try {
      const competition = await deps.competitionService.admin.create({
        name: parsed.competitionName,
        description: options.competitionDescription,
      });
      return {
        competition: { status: "success", data: competition },
        ...(await runAfterCompetition(competition, parsed, options)),
      };
    } catch (cause) {
      return {
        competition: { status: "failed", error: message(cause) },
        divisions: parsed.divisionGroups.map((group) => ({
          groupId: group.groupId,
          divisionName: group.divisionName,
          outcome: skipped("대회 생성에 실패했습니다"),
        })),
        participants: parsed.divisionGroups.flatMap((group) =>
          group.participants.map((row) => ({
            divisionGroupId: group.groupId,
            row,
            outcome: skipped("대회 생성에 실패했습니다"),
          }))
        ),
      };
    }
  };
  return {
    parse: parseCsv,
    run,
    async retry(
      previous: CsvImportRunResult,
      parsed: CsvParseResult,
      options: CsvImportOptions,
      edits: CsvImportEdits = {}
    ): Promise<CsvImportRunResult> {
      if (previous.competition.status !== "success") {
        const retried = { ...parsed, competitionName: edits.competitionName ?? parsed.competitionName };
        return run(retried, options);
      }
      const competition = previous.competition.data;
      const settings = new Map(options.divisionSettings.map((setting) => [setting.groupId, setting]));
      const oldDivisions = new Map(previous.divisions.map((item) => [item.groupId, item]));
      const divisions = await Promise.all(
        parsed.divisionGroups.map(async (group) => {
          const old = oldDivisions.get(group.groupId)!;
          if (old.outcome.status === "success") return old;
          const divisionName = edits.divisionNames?.[group.groupId] ?? old.divisionName;
          try {
            const setting = settings.get(group.groupId)!;
            return {
              groupId: group.groupId,
              divisionName,
              outcome: {
                status: "success",
                data: await deps.divisionService.admin.create(competition.id, {
                  name: divisionName,
                  description: setting.description,
                  timeLimit: setting.timeLimit,
                }),
              } as ItemOutcome<Division>,
            };
          } catch (cause) {
            return {
              groupId: group.groupId,
              divisionName,
              outcome: { status: "failed", error: message(cause) } as ItemOutcome<Division>,
            };
          }
        })
      );
      const divisionByGroup = new Map(divisions.map((item) => [item.groupId, item]));
      const oldParticipants = new Map(previous.participants.map((item) => [item.row.rowId, item]));
      const retryItems = parsed.divisionGroups.flatMap((group) =>
        group.participants.map((original) => {
          const old = oldParticipants.get(original.rowId)!;
          const row = { ...old.row, ...edits.participantFields?.[original.rowId] };
          const division = divisionByGroup.get(group.groupId)!;
          return {
            old,
            row,
            divisionGroupId: group.groupId,
            divisionId: division.outcome.status === "success" ? division.outcome.data.id : undefined,
          };
        })
      );
      const eligible = retryItems.filter((item) => item.old.outcome.status !== "success" && item.divisionId);
      const outcomes = await Promise.allSettled(
        eligible.map((item) => deps.participantService.admin.create(formFor(item.row, item.divisionId!)))
      );
      let outcomeIndex = 0;
      const participants = retryItems.map((item): ParticipantImportItem => {
        if (item.old.outcome.status === "success") return item.old;
        if (!item.divisionId)
          return {
            divisionGroupId: item.divisionGroupId,
            row: item.row,
            outcome: skipped("소속 부문 생성에 실패했습니다"),
          };
        return {
          divisionGroupId: item.divisionGroupId,
          row: item.row,
          outcome: settledOutcome(outcomes[outcomeIndex++]),
        };
      });
      return { competition: previous.competition, divisions, participants };
    },
  };
}
