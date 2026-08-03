import Papa from "papaparse";

import type { CsvParseError, CsvParseResult, ParsedDivisionGroup } from "../model/types";

export const REQUIRED_HEADERS = ["이름", "소속", "로봇 이름", "참가 순번", "참가 부문", "대회 이름"] as const;
export const OPTIONAL_HEADERS = [
  "이메일",
  "CPU",
  "ROM",
  "RAM",
  "모터 드라이버",
  "모터",
  "ADC",
  "센서",
  "하고 싶은 말",
  "참가 신청일",
] as const;

export function parseCsv(file: File): Promise<CsvParseResult> {
  return new Promise<CsvParseResult>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: ({ data, meta, errors }) => {
        if (errors.length > 0)
          return reject({ reason: "parse-error", message: errors[0].message } satisfies CsvParseError);
        const headers = meta.fields ?? [];
        const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
        if (missingHeaders.length)
          return reject({
            reason: "missing-headers",
            message: "필수 열이 없습니다",
            missingHeaders,
          } satisfies CsvParseError);
        if (!data.length)
          return reject({ reason: "empty-file", message: "참가자 행이 없습니다" } satisfies CsvParseError);
        const invalidRowNumbers = data.flatMap((row, index) =>
          REQUIRED_HEADERS.filter((header) => header !== "대회 이름").some((header) => !row[header]?.trim())
            ? [index + 2]
            : []
        );
        if (invalidRowNumbers.length)
          return reject({
            reason: "missing-required-fields",
            message: "필수 값이 비어 있습니다",
            invalidRowNumbers,
          } satisfies CsvParseError);
        const groups = new Map<string, ParsedDivisionGroup>();
        let competitionName = "";
        data.forEach((record, index) => {
          if (!competitionName && record["대회 이름"]?.trim()) competitionName = record["대회 이름"].trim();
          const divisionName = record["참가 부문"].trim();
          const group = groups.get(divisionName) ?? {
            groupId: `division-${groups.size + 1}`,
            divisionName,
            participants: [],
          };
          if (!groups.has(divisionName)) groups.set(divisionName, group);
          group.participants.push({
            rowId: `row-${index + 1}`,
            name: record["이름"].trim(),
            teamName: record["소속"].trim(),
            robotName: record["로봇 이름"].trim(),
            orderRaw: record["참가 순번"].trim(),
            comment: record["하고 싶은 말"]?.trim() ?? "",
          });
        });
        resolve({ competitionName, divisionGroups: [...groups.values()], totalParticipantCount: data.length });
      },
      error: (parseError) => reject({ reason: "parse-error", message: parseError.message } satisfies CsvParseError),
    });
  });
}
