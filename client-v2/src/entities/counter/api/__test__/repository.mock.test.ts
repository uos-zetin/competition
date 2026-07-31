import { beforeEach, describe, expect, it } from "vitest";

import { mockCounterStates } from "../channel.mock";
import { CounterMockRepository } from "../repository.mock";

describe("CounterMockRepository", () => {
  beforeEach(() => {
    mockCounterStates.clear();
    mockCounterStates.set("counter-1", { id: "counter-1", name: "계수기", startedAt: 100, stoppedAt: 200, divisionId: null });
  });

  it("reads and updates the shared counter state", async () => {
    const repository = new CounterMockRepository();
    expect(await repository.getAll()).toHaveLength(1);
    await repository.connectDivision("counter-1", "division-1");
    expect((await repository.getById("counter-1"))?.divisionId).toBe("division-1");
    await repository.reset("counter-1");
    expect(await repository.getById("counter-1")).toMatchObject({ startedAt: null, stoppedAt: null });
    await repository.disconnectDivision("counter-1");
    expect((await repository.getById("counter-1"))?.divisionId).toBeNull();
  });
});
