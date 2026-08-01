import { describe, expect, it, vi } from "vitest";

import { createCounterAdminControlService } from "../service";
import type { CounterAdminControlDeps } from "../types";

function createDeps(): CounterAdminControlDeps {
  return {
    counterService: {
      admin: { reset: vi.fn(), connectDivision: vi.fn(), disconnectDivision: vi.fn() },
      use: {
        counterState: vi.fn(() => null),
        isConnected: vi.fn(() => false),
        stopwatch: vi.fn(() => ({ startedAt: null, stoppedAt: null })),
      },
    },
    divisionService: {
      load: vi.fn(),
      loadById: vi.fn(),
      use: { divisions: vi.fn(() => []), divisionById: vi.fn(() => undefined) },
    },
    competitionService: { load: vi.fn(), use: { competitions: vi.fn(() => []) } },
  };
}

describe("createCounterAdminControlService", () => {
  it("delegates load and control operations to its dependencies", async () => {
    const deps = createDeps();
    const service = createCounterAdminControlService(deps);

    await service.load.competitions();
    await service.load.divisionsByCompetition("competition-1");
    await service.load.connectedDivision("division-1");
    await service.control.connectDivision("counter-1", "division-1");
    await service.control.disconnectDivision("counter-1");
    await service.control.reset("counter-1");

    expect(deps.competitionService.load).toHaveBeenCalledOnce();
    expect(deps.divisionService.load).toHaveBeenCalledWith("competition-1");
    expect(deps.divisionService.loadById).toHaveBeenCalledWith("division-1");
    expect(deps.counterService.admin.connectDivision).toHaveBeenCalledWith("counter-1", "division-1");
    expect(deps.counterService.admin.disconnectDivision).toHaveBeenCalledWith("counter-1");
    expect(deps.counterService.admin.reset).toHaveBeenCalledWith("counter-1");
  });

  it("propagates control failures", async () => {
    const deps = createDeps();
    vi.mocked(deps.counterService.admin.reset).mockRejectedValue(new Error("failed"));

    await expect(createCounterAdminControlService(deps).control.reset("counter-1")).rejects.toThrow("failed");
  });

  it("returns exactly the values supplied by use accessors", () => {
    const deps = createDeps();
    const counter = { id: "counter-1", name: "계수기", divisionId: null, startedAt: 1, stoppedAt: null };
    const division = {
      id: "division-1",
      competitionId: "competition-1",
      name: "부문",
      description: "",
      createdAt: new Date(),
      status: "ready" as const,
      timeLimit: 90,
    };
    const competition = { id: "competition-1", name: "대회", description: "", createdAt: new Date() };
    vi.mocked(deps.counterService.use.counterState).mockReturnValue(counter);
    vi.mocked(deps.counterService.use.isConnected).mockReturnValue(true);
    vi.mocked(deps.counterService.use.stopwatch).mockReturnValue({ startedAt: 1, stoppedAt: null });
    vi.mocked(deps.divisionService.use.divisions).mockReturnValue([division]);
    vi.mocked(deps.divisionService.use.divisionById).mockReturnValue(division);
    vi.mocked(deps.competitionService.use.competitions).mockReturnValue([competition]);
    const service = createCounterAdminControlService(deps);

    expect(service.use.counter("counter-1")).toBe(counter);
    expect(service.use.isConnected("counter-1")).toBe(true);
    expect(service.use.stopwatch("counter-1")).toEqual({ startedAt: 1, stoppedAt: null });
    expect(service.use.competitions()).toBe(deps.competitionService.use.competitions());
    expect(service.use.divisionsForSelectedCompetition()).toBe(deps.divisionService.use.divisions());
    expect(service.use.connectedDivision("division-1")).toBe(division);
  });
});
