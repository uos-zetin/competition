import { describe, expect, it } from "vitest";

import { parseCsv } from "../parse-csv";

const csv = (text: string) => new File([text], "participants.csv", { type: "text/csv" });
const headers = "이름,소속,로봇 이름,참가 순번,참가 부문,대회 이름";

describe("parseCsv", () => {
  it("reports exact missing required headers", async () => {
    await expect(parseCsv(csv("이름,소속\n홍길동,팀"))).rejects.toMatchObject({
      reason: "missing-headers",
      missingHeaders: ["로봇 이름", "참가 순번", "참가 부문", "대회 이름"],
    });
  });
  it("reports 1-indexed CSV row numbers with missing fields", async () => {
    await expect(parseCsv(csv(`${headers}\n홍길동,팀,로봇,1,A,대회\n,팀,로봇,2,A,대회`))).rejects.toMatchObject({
      reason: "missing-required-fields",
      invalidRowNumbers: [3],
    });
  });
  it("groups divisions and uses the first non-empty competition name", async () => {
    const result = await parseCsv(
      csv(`${headers}\n홍길동,팀,로봇,1,A,\n김철수,팀,로봇,2,A,봄 대회\n이영희,팀,로봇,3,B,다른 대회`)
    );
    expect(result.competitionName).toBe("봄 대회");
    expect(result.divisionGroups).toHaveLength(2);
    expect(result.divisionGroups[0].participants).toHaveLength(2);
  });
  it("rejects a headers-only file", async () => {
    await expect(parseCsv(csv(headers))).rejects.toMatchObject({ reason: "empty-file" });
  });
});
