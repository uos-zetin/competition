import { describe, expect, it, vi } from "vitest";

import { createCounterChannel } from "../channel.socket-io";

const { createSocketChannel } = vi.hoisted(() => ({ createSocketChannel: vi.fn() }));
vi.mock("@/shared/api", () => ({ createSocketChannel }));
vi.mock("@/shared/config/env", () => ({ env: { serverUrl: "https://api.example.com" } }));

describe("createCounterChannel", () => {
  it("passes counter-specific socket settings to the shared channel", () => {
    createCounterChannel(() => "session-key");
    expect(createSocketChannel).toHaveBeenCalledWith(expect.objectContaining({
      url: "https://api.example.com/socket/counters", queryKey: "deviceId",
    }));
  });
});
