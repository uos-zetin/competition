import { describe, expect, it } from "vitest";

import { parseCompetitionDto, parseCompetitionForm } from "../parse-dto";

describe("competition DTO parsers", () => {
  it("converts a DTO date to a domain Date", () => {
    const competition = parseCompetitionDto({
      id: "competition-1",
      name: "대회",
      description: "설명",
      createdAt: "2026-03-02T00:00:00.000Z",
    });
    expect(competition).toEqual({
      id: "competition-1",
      name: "대회",
      description: "설명",
      createdAt: new Date("2026-03-02T00:00:00.000Z"),
    });
  });

  it("keeps only form fields for a create DTO", () => {
    expect(parseCompetitionForm({ name: "대회", description: "설명" })).toEqual({ name: "대회", description: "설명" });
  });
});
