import { describe, expect, it } from "vitest";

import { formatElapsedMs } from "../format";

describe("formatElapsedMs", () => {
  it("formats milliseconds as minutes, seconds, and milliseconds", () => {
    expect(formatElapsedMs(61_234)).toBe("01:01.234");
    expect(formatElapsedMs(-1)).toBe("00:00.000");
  });
});
