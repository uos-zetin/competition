import { describe, expect, it } from "vitest";

import { parseManualRecordDto, parseManualRecordForm } from "../parse-dto";

describe("manual record DTO parsers", () => {
  it("converts a DTO date to a domain Date", () => {
    expect(
      parseManualRecordDto({
        id: "manual-record-1",
        participantId: "participant-1",
        value: 52740,
        recorderName: "김심판",
        createdAt: "2026-03-02T00:00:00.000Z",
      })
    ).toEqual({
      id: "manual-record-1",
      participantId: "participant-1",
      value: 52740,
      recorderName: "김심판",
      createdAt: new Date("2026-03-02T00:00:00.000Z"),
    });
  });

  it("keeps only form fields for a create DTO", () => {
    expect(parseManualRecordForm({ value: 52740, recorderName: "김심판" })).toEqual({
      value: 52740,
      recorderName: "김심판",
    });
  });
});
