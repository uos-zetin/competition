import { describe, expect, it } from "vitest";

import { parseRecordDto, parseRecordForm } from "../parse-dto";

describe("record DTO parsers", () => {
  it("converts a DTO date, source, and status to domain values", () => {
    expect(
      parseRecordDto({
        id: "record-1",
        participantId: "participant-1",
        value: 52740,
        source: "stopwatch",
        status: "approved",
        note: "안정적인 주행",
        createdAt: "2026-03-02T00:00:00.000Z",
      })
    ).toEqual({
      id: "record-1",
      participantId: "participant-1",
      value: 52740,
      source: "stopwatch",
      status: "approved",
      note: "안정적인 주행",
      createdAt: new Date("2026-03-02T00:00:00.000Z"),
    });
  });

  it("keeps only user-editable form fields for a create DTO", () => {
    expect(parseRecordForm({ value: 52740, source: "manual", note: "수동 입력" })).toEqual({
      value: 52740,
      source: "manual",
      note: "수동 입력",
    });
  });
});
