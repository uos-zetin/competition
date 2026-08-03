import type { Competition } from "@/entities/competition";
import type { Division } from "@/entities/division";
import type { Participant } from "@/entities/participant";

export type ParsedParticipantRow = {
  rowId: string;
  name: string;
  teamName: string;
  robotName: string;
  orderRaw: string;
  comment: string;
};
export type ParsedDivisionGroup = { groupId: string; divisionName: string; participants: ParsedParticipantRow[] };
export type CsvParseResult = {
  competitionName: string;
  divisionGroups: ParsedDivisionGroup[];
  totalParticipantCount: number;
};
export type CsvParseError = {
  reason: "missing-headers" | "missing-required-fields" | "empty-file" | "parse-error";
  message: string;
  missingHeaders?: string[];
  invalidRowNumbers?: number[];
};
export type DivisionSettingInput = { groupId: string; description: string; timeLimit: number };
export type CsvImportOptions = { competitionDescription: string; divisionSettings: DivisionSettingInput[] };
export type ItemOutcome<T> =
  { status: "success"; data: T } | { status: "failed"; error: string } | { status: "skipped"; reason: string };
export type DivisionImportItem = { groupId: string; divisionName: string; outcome: ItemOutcome<Division> };
export type ParticipantImportItem = {
  divisionGroupId: string;
  row: ParsedParticipantRow;
  outcome: ItemOutcome<Participant>;
};
export type CsvImportRunResult = {
  competition: ItemOutcome<Competition>;
  divisions: DivisionImportItem[];
  participants: ParticipantImportItem[];
};
export type CsvImportEdits = {
  competitionName?: string;
  divisionNames?: Record<string, string>;
  participantFields?: Record<
    string,
    Partial<Pick<ParsedParticipantRow, "name" | "teamName" | "robotName" | "orderRaw" | "comment">>
  >;
};
