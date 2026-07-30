import { describe, expect, it } from "vitest";

import { MAX_TIME_LIMIT_SECONDS } from "../../model";
import { formatTimeLimit, getDivisionStatusLabel } from "../format";

describe("division formatters", () => {
  it.each([
    ["ready", "준비"],
    ["ongoing", "진행중"],
    ["closed", "종료"],
  ] as const)("formats %s status", (status, label) => {
    expect(getDivisionStatusLabel(status)).toBe(label);
  });

  it.each([
    [0, "0분 00초"],
    [90, "1분 30초"],
    [MAX_TIME_LIMIT_SECONDS, "99분 59초"],
  ])("formats %i seconds", (seconds, formatted) => {
    expect(formatTimeLimit(seconds)).toBe(formatted);
  });
});
