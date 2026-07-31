import { describe, expect, it } from "vitest";

import { getRecordSourceLabel, getRecordStatusLabel } from "../format";

describe("getRecordStatusLabel", () => {
  it.each([
    ["pending", "대기"],
    ["approved", "승인"],
    ["rejected", "거부"],
  ] as const)("formats %s status", (status, label) => {
    expect(getRecordStatusLabel(status)).toBe(label);
  });
});

describe("getRecordSourceLabel", () => {
  it.each([
    ["stopwatch", "계수기"],
    ["manual", "수동 계수"],
    ["other", "기타"],
  ] as const)("formats %s source", (source, label) => {
    expect(getRecordSourceLabel(source)).toBe(label);
  });
});
