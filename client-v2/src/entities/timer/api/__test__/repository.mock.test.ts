import { describe, expect, it } from "vitest";

import { TimerMockRepository } from "../repository.mock";

describe("TimerMockRepository", () => {
  it("returns no logs for an unknown participant", async () => {
    await expect(new TimerMockRepository().getTimerLogs("participant-1")).resolves.toEqual([]);
  });

  it("appends and returns start, stop, and adjustment logs", async () => {
    const repository = new TimerMockRepository();

    const start = await repository.startTimer("participant-1");
    const stop = await repository.stopTimer("participant-1");
    const add = await repository.adjustTimer("participant-1", "add", 500);
    const sub = await repository.adjustTimer("participant-1", "sub", 250);

    expect([start.type, stop.type, add.type, sub.type]).toEqual(["start", "stop", "add", "sub"]);
    expect([add.value, sub.value]).toEqual([500, 250]);
    await expect(repository.getTimerLogs("participant-1")).resolves.toEqual([start, stop, add, sub]);
  });
});
