import { describe, expect, it, vi } from "vitest";

import { getElapsedMs, isRunning } from "../selectors";

describe("counter selectors", () => {
  it("calculates elapsed time and protects against negative values", () => {
    vi.spyOn(Date, "now").mockReturnValue(1500);
    expect(getElapsedMs(null, null)).toBe(0);
    expect(getElapsedMs(1000, null)).toBe(500);
    expect(getElapsedMs(1000, 900)).toBe(0);
    vi.restoreAllMocks();
  });

  it("identifies a running counter", () => {
    expect(isRunning(1000, null)).toBe(true);
    expect(isRunning(null, null)).toBe(false);
    expect(isRunning(1000, 2000)).toBe(false);
  });
});
