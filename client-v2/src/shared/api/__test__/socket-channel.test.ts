import { describe, expect, it, vi } from "vitest";

import { createSocketChannel } from "../socket-channel";

const { io, sockets } = vi.hoisted(() => {
  const nextSockets: Array<{
  on: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  removeAllListeners: ReturnType<typeof vi.fn>;
  emit(event: string, value?: unknown): void;
  }> = [];
  const nextIo = vi.fn(() => {
  const listeners = new Map<string, (value?: unknown) => void>();
  const socket = {
    on: vi.fn((event: string, handler: (value?: unknown) => void) => listeners.set(event, handler)),
    disconnect: vi.fn(),
    removeAllListeners: vi.fn(() => listeners.clear()),
    emit: (event: string, value?: unknown) => listeners.get(event)?.(value),
  };
  nextSockets.push(socket);
  return socket;
  });
  return { io: nextIo, sockets: nextSockets };
});

vi.mock("socket.io-client", () => ({ io }));

const lastSocket = () => sockets[sockets.length - 1];

describe("createSocketChannel", () => {
  it("rejects a superseded pending connection instead of leaving it pending", async () => {
    const channel = createSocketChannel({ url: "/socket", queryKey: "id", getSessionKey: () => null, parseMessage: (raw) => raw });
    const first = channel.connect("first");
    const second = channel.connect("second");
    await expect(first).rejects.toThrow("superseded by a newer connect() call");
    lastSocket()?.emit("connect");
    await expect(second).resolves.toBeUndefined();
  });

  it("configures forceNew, query, and optional session authorization", async () => {
    const channel = createSocketChannel({ url: "/socket", queryKey: "deviceId", getSessionKey: () => "key", parseMessage: (raw) => raw });
    const connection = channel.connect("device-1");
    expect(io).toHaveBeenLastCalledWith("/socket", expect.objectContaining({
      forceNew: true, query: { deviceId: "device-1" }, extraHeaders: { authorization: "Session key" },
    }));
    lastSocket()?.emit("connect");
    await connection;
    const noSession = createSocketChannel({ url: "/socket", queryKey: "id", getSessionKey: () => null, parseMessage: (raw) => raw });
    const noSessionConnection = noSession.connect("x");
    expect(io).toHaveBeenLastCalledWith("/socket", expect.objectContaining({ extraHeaders: undefined }));
    lastSocket()?.emit("connect");
    await noSessionConnection;
  });

  it("adds and removes message handlers without automatically disconnecting", () => {
    const channel = createSocketChannel({ url: "/socket", queryKey: "id", getSessionKey: () => null, parseMessage: (raw) => raw as string });
    const handler = vi.fn();
    const unsubscribe = channel.subscribe(handler);
    const connection = channel.connect("one");
    lastSocket()?.emit("message", "first");
    expect(handler).toHaveBeenCalledWith("first");
    unsubscribe();
    lastSocket()?.emit("message", "second");
    expect(handler).toHaveBeenCalledOnce();
    expect(lastSocket()?.disconnect).not.toHaveBeenCalled();
    lastSocket()?.emit("connect");
    return connection;
  });
});
