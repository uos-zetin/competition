import { describe, expect, it, vi } from "vitest";

import type { TimerState } from "../../model/types";
import { getRemainingMs, getStatus } from "../selectors";

describe("timer selectors", () => {
  it("returns remaining time while stopped", () => {
    const state: TimerState = { initialMs: 10_000, offsetMs: 2_000, accumulatedMs: 3_000, startedAt: null };
    expect(getRemainingMs(state)).toBe(9_000);
  });

  it("returns remaining time while running and never below zero", () => {
    const state: TimerState = { initialMs: 10_000, offsetMs: 0, accumulatedMs: 0, startedAt: 1_000 };
    expect(getRemainingMs(state, 2_500)).toBe(8_500);
    expect(getRemainingMs(state, 20_000)).toBe(0);
  });

  it("identifies running, stopped, and finished states", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000);
    expect(getStatus({ initialMs: 10_000, offsetMs: 0, accumulatedMs: 0, startedAt: 1_000 })).toBe("running");
    expect(getStatus({ initialMs: 10_000, offsetMs: 0, accumulatedMs: 0, startedAt: null })).toBe("stopped");
    expect(getStatus({ initialMs: 5_000, offsetMs: 0, accumulatedMs: 5_000, startedAt: null })).toBe("finished");
    vi.restoreAllMocks();
  });
});
