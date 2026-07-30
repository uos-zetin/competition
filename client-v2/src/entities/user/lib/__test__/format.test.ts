import { describe, expect, it } from "vitest";

import { getUserRoleLabel } from "../format";

describe("getUserRoleLabel", () => {
  it.each([
    ["administrator", "관리자"],
    ["manualRecorder", "수동 계수자"],
    ["stopwatchRecorder", "계수기"],
  ] as const)("formats %s role", (role, label) => {
    expect(getUserRoleLabel(role)).toBe(label);
  });
});
