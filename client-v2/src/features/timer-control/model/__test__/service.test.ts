import { describe, expect, it, vi } from "vitest";

import type { TimerLog } from "@/entities/timer";

import { createTimerControlService } from "../service";
import type { TimerControlDeps } from "../types";

const log: TimerLog = {
  id: "log-1",
  participantId: "participant-1",
  value: 1_000,
  type: "start",
  createdAt: new Date(),
};

function createDeps(): TimerControlDeps {
  return {
    timerService: {
      admin: {
        start: vi.fn().mockResolvedValue(log),
        stop: vi.fn().mockResolvedValue({ ...log, type: "stop" }),
        adjust: vi.fn().mockResolvedValue({ ...log, type: "add" }),
      },
    },
  };
}

describe("createTimerControlService", () => {
  it("delegates start, stop, and adjust commands to the injected timer service", async () => {
    const deps = createDeps();
    const service = createTimerControlService(deps);

    await service.control.start("participant-1");
    await service.control.stop("participant-1");
    await service.control.adjust("participant-1", "sub", 10_000);

    expect(deps.timerService.admin.start).toHaveBeenCalledWith("participant-1");
    expect(deps.timerService.admin.stop).toHaveBeenCalledWith("participant-1");
    expect(deps.timerService.admin.adjust).toHaveBeenCalledWith("participant-1", "sub", 10_000);
  });

  it("propagates command failures", async () => {
    const deps = createDeps();
    vi.mocked(deps.timerService.admin.adjust).mockRejectedValue(new Error("failed"));

    await expect(createTimerControlService(deps).control.adjust("participant-1", "add", 1_000)).rejects.toThrow("failed");
  });
});
