import { describe, expect, it } from "vitest";

import type { TimerLog } from "../../model/types";
import { integrateLogs } from "../integrate-logs";

describe("integrateLogs", () => {
  const base = 1_000_000;

  it("accumulates time between start and stop", () => {
    const logs: TimerLog[] = [
      { id: "1", participantId: "x", type: "start", value: base, createdAt: new Date(base) },
      { id: "2", participantId: "x", type: "stop", value: base + 5_000, createdAt: new Date(base + 5_000) },
    ];

    expect(integrateLogs(10_000, logs)).toMatchObject({ startedAt: null, accumulatedMs: 5_000 });
  });

  it("computes offsets for additions and subtractions", () => {
    const logs: TimerLog[] = [
      { id: "a", participantId: "x", type: "add", value: 3_000, createdAt: new Date() },
      { id: "b", participantId: "x", type: "sub", value: 1_000, createdAt: new Date() },
    ];

    expect(integrateLogs(8_000, logs).offsetMs).toBe(2_000);
  });
});
