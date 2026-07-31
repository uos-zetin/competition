import { describe, expect, it } from "vitest";

import { formatMsToTime } from "../format";

describe("formatMsToTime", () => {
  it("formats milliseconds with three-digit precision", () => {
    expect(formatMsToTime(61_234)).toBe("01:01.234");
    expect(formatMsToTime(-1)).toBe("00:00.000");
  });
});
