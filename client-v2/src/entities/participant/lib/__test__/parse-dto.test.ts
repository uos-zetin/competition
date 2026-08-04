import { describe, expect, it } from "vitest";

import { parseParticipantDto, parseParticipantForm } from "../parse-dto";

describe("participant DTO parsers", () => {
  it("converts a DTO date to a domain Date", () => {
    expect(
      parseParticipantDto({
        id: "participant-1",
        divisionId: "division-1",
        name: "참가자",
        teamName: "팀",
        robotName: "로봇",
        comment: "메모",
        orderRaw: 4,
        createdAt: "2026-03-02T00:00:00.000Z",
      })
    ).toEqual({
      id: "participant-1",
      divisionId: "division-1",
      name: "참가자",
      teamName: "팀",
      robotName: "로봇",
      comment: "메모",
      orderRaw: 4,
      createdAt: new Date("2026-03-02T00:00:00.000Z"),
    });
  });

  it("keeps only form fields for a create DTO", () => {
    expect(
      parseParticipantForm({
        divisionId: "division-1",
        name: "참가자",
        teamName: "팀",
        robotName: "로봇",
        comment: "",
        orderRaw: 1,
      })
    ).toEqual({
      name: "참가자",
      teamName: "팀",
      robotName: "로봇",
      comment: "",
      orderRaw: 1,
    });
  });
});
