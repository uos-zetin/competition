import { describe, expect, it } from "vitest";

import { parseTimerLogDto, parseTimerLogTypeDto } from "../parse-dto";

describe("parseTimerLogDto", () => {
  it("maps start and stop logs directly", () => {
    expect(parseTimerLogTypeDto("start", 1_000)).toEqual({ timerLogType: "start", value: 1_000 });
    expect(parseTimerLogTypeDto("stop", 2_000)).toEqual({ timerLogType: "stop", value: 2_000 });
  });

  it("maps signed adjustment DTOs to add and sub logs", () => {
    expect(parseTimerLogTypeDto("adjust", 500)).toEqual({ timerLogType: "add", value: 500 });
    expect(parseTimerLogTypeDto("adjust", -500)).toEqual({ timerLogType: "sub", value: 500 });
  });

  it("parses a timer log DTO", () => {
    expect(parseTimerLogDto({ id: "log-1", participantId: "participant-1", value: -500, type: "adjust", createdAt: "2025-01-01T00:00:00.000Z" })).toEqual({
      id: "log-1", participantId: "participant-1", value: 500, type: "sub", createdAt: new Date("2025-01-01T00:00:00.000Z"),
    });
  });
});
