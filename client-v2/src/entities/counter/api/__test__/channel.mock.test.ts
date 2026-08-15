import { describe, expect, it, vi } from "vitest";

import { CounterMockChannel, mockCounterStates } from "../channel.mock";

describe("CounterMockChannel", () => {
  it("emits an existing counter and does not fabricate an unknown device", async () => {
    const channel = new CounterMockChannel();
    const handler = vi.fn();
    channel.subscribe(handler);
    mockCounterStates.set("device-1", { id: "device-1", name: "테스트 계수기", startedAt: null, stoppedAt: null, divisionId: null });
    await channel.connect("device-1");
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ deviceId: "device-1" }));
    await channel.disconnect();
    await channel.connect("device-1");
    expect(handler).toHaveBeenCalledTimes(1);
    await channel.connect("unknown-device");
    expect(mockCounterStates.has("unknown-device")).toBe(false);
  });
});
