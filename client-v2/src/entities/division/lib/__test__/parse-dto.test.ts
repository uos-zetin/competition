import { describe, expect, it } from "vitest";

import { parseDivisionDto, parseDivisionForm } from "../parse-dto";

describe("division DTO parsers", () => {
  it("converts a DTO date and status to domain values", () => {
    expect(
      parseDivisionDto({
        id: "division-1",
        competitionId: "competition-1",
        name: "예선",
        description: "설명",
        createdAt: "2026-03-02T00:00:00.000Z",
        status: "ongoing",
        timeLimit: 90,
      })
    ).toEqual({
      id: "division-1",
      competitionId: "competition-1",
      name: "예선",
      description: "설명",
      createdAt: new Date("2026-03-02T00:00:00.000Z"),
      status: "ongoing",
      timeLimit: 90,
    });
  });

  it("keeps only user-editable form fields for a create DTO", () => {
    expect(parseDivisionForm({ name: "예선", description: "설명", timeLimit: 90 })).toEqual({
      name: "예선",
      description: "설명",
      timeLimit: 90,
    });
  });
});
