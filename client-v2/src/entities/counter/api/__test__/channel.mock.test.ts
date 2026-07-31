import { beforeEach, describe, expect, it, vi } from "vitest";

import { CounterMockChannel, mockCounterStates } from "../channel.mock";

describe("CounterMockChannel", () => {
  beforeEach(() => mockCounterStates.clear());

  it("emits a generated counter on connect and removes subscribers on disconnect", async () => {
    const channel = new CounterMockChannel();
    const handler = vi.fn();
    channel.subscribe(handler);
    await channel.connect("device-1");
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ deviceId: "device-1" }));
    await channel.disconnect();
    await channel.connect("device-1");
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
