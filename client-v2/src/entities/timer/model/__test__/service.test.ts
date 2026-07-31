import { describe, expect, it, vi } from "vitest";

import type { TimerRepository } from "../../api/types";
import { createTimerService } from "../service";

const log = { id: "log-1", participantId: "participant-1", value: 1_000, type: "start" as const, createdAt: new Date() };

function createRepository(): TimerRepository {
  return {
    getTimerLogs: vi.fn(),
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    adjustTimer: vi.fn(),
  };
}

describe("createTimerService", () => {
  it("returns logs directly from the repository", async () => {
    const repository = createRepository();
    vi.mocked(repository.getTimerLogs).mockResolvedValue([log]);

    await expect(createTimerService({ timerRepository: repository }).load.logs("participant-1")).resolves.toEqual([log]);
    expect(repository.getTimerLogs).toHaveBeenCalledWith("participant-1");
  });

  it("delegates admin commands without maintaining local state", async () => {
    const repository = createRepository();
    vi.mocked(repository.startTimer).mockResolvedValue(log);
    vi.mocked(repository.stopTimer).mockResolvedValue({ ...log, type: "stop" });
    vi.mocked(repository.adjustTimer).mockResolvedValue({ ...log, type: "add", value: 500 });
    const service = createTimerService({ timerRepository: repository });

    await expect(service.admin.start("participant-1")).resolves.toBe(log);
    await expect(service.admin.stop("participant-1")).resolves.toEqual({ ...log, type: "stop" });
    await expect(service.admin.adjust("participant-1", "add", 500)).resolves.toEqual({ ...log, type: "add", value: 500 });
    expect(repository.startTimer).toHaveBeenCalledWith("participant-1");
    expect(repository.stopTimer).toHaveBeenCalledWith("participant-1");
    expect(repository.adjustTimer).toHaveBeenCalledWith("participant-1", "add", 500);
  });
});
