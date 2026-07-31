import { describe, expect, it } from "vitest";

import { getRecordStatusLabel } from "../format";

describe("getRecordStatusLabel", () => {
  it.each([
    ["pending", "대기"],
    ["approved", "승인"],
    ["rejected", "거부"],
  ] as const)("formats %s status", (status, label) => {
    expect(getRecordStatusLabel(status)).toBe(label);
  });
});
