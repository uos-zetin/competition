import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CounterChannel, CounterRepository } from "../../api/types";
import { createCounterService } from "../service";
import { useCounterStore } from "../store.zustand";

const counter = { id: "counter-1", name: "계수기", startedAt: null, stoppedAt: null, divisionId: null };
const dto: { deviceId: string; name: string; startedAt: number | null; stoppedAt: number | null; divisionId: string | null } = {
  deviceId: "counter-1", name: "계수기", startedAt: null, stoppedAt: null, divisionId: null,
};

function createRepository(): CounterRepository {
  return { getAll: vi.fn(), getById: vi.fn(), reset: vi.fn(), connectDivision: vi.fn(), disconnectDivision: vi.fn() };
}

function createChannel(): CounterChannel & { emit(message: typeof dto): void } {
  let handler: ((message: typeof dto) => void) | undefined;
  return {
    connect: vi.fn(), disconnect: vi.fn(), subscribe: vi.fn((nextHandler) => { handler = nextHandler; return () => { handler = undefined; }; }),
    emit: (message) => handler?.(message),
  };
}

describe("createCounterService", () => {
  beforeEach(() => useCounterStore.getState().clearAll());

  it("loads all counters into the store", async () => {
    const repository = createRepository();
    vi.mocked(repository.getAll).mockResolvedValue([counter]);
    await createCounterService({ counterRepository: repository, counterChannel: createChannel() }).load.all();
    expect(useCounterStore.getState().counters).toEqual([counter]);
  });

  it("delegates admin commands without directly changing the store", async () => {
    const repository = createRepository();
    const service = createCounterService({ counterRepository: repository, counterChannel: createChannel() });
    act(() => useCounterStore.getState().add(counter));
    await service.admin.reset("counter-1");
    await service.admin.connectDivision("counter-1", "division-1");
    await service.admin.disconnectDivision("counter-1");
    expect(repository.reset).toHaveBeenCalledWith("counter-1");
    expect(repository.connectDivision).toHaveBeenCalledWith("counter-1", "division-1");
    expect(repository.disconnectDivision).toHaveBeenCalledWith("counter-1");
    expect(useCounterStore.getState().counters).toEqual([counter]);
  });

  it("subscribes to socket updates and applies add, start, stop, and reset", async () => {
    const channel = createChannel();
    const service = createCounterService({ counterRepository: createRepository(), counterChannel: channel });
    await service.connection.connect("counter-1");
    channel.emit(dto);
    channel.emit({ ...dto, startedAt: 100 });
    channel.emit({ ...dto, startedAt: 100, stoppedAt: 200 });
    expect(useCounterStore.getState().counters[0]).toMatchObject({ startedAt: 100, stoppedAt: 200 });
    channel.emit(dto);
    expect(useCounterStore.getState().counters[0]).toMatchObject({ startedAt: null, stoppedAt: null });
  });

  it("unsubscribes, disconnects, and removes the requested counter", async () => {
    const channel = createChannel();
    const service = createCounterService({ counterRepository: createRepository(), counterChannel: channel });
    useCounterStore.getState().add(counter);
    await service.connection.connect("counter-1");
    await service.connection.disconnect("counter-1");
    expect(channel.disconnect).toHaveBeenCalledOnce();
    expect(useCounterStore.getState().counters).toEqual([]);
  });

  it("keeps a same-id reconnection when an earlier disconnect completes late", async () => {
    const channel = createChannel();
    let resolveDisconnect: (() => void) | undefined;
    vi.mocked(channel.disconnect).mockImplementationOnce(
      () => new Promise<void>((resolve) => { resolveDisconnect = resolve; })
    );
    const service = createCounterService({ counterRepository: createRepository(), counterChannel: channel });

    await service.connection.connect("counter-1");
    channel.emit(dto);
    const staleDisconnect = service.connection.disconnect("counter-1");
    await service.connection.connect("counter-1");
    channel.emit(dto);
    resolveDisconnect?.();
    await staleDisconnect;

    expect(useCounterStore.getState().counters).toEqual([counter]);
  });

  it("removes an old counter when a different counter connects during its disconnect", async () => {
    const channel = createChannel();
    let resolveDisconnect: (() => void) | undefined;
    vi.mocked(channel.disconnect).mockImplementationOnce(
      () => new Promise<void>((resolve) => { resolveDisconnect = resolve; })
    );
    const service = createCounterService({ counterRepository: createRepository(), counterChannel: channel });

    await service.connection.connect("counter-1");
    channel.emit(dto);
    const staleDisconnect = service.connection.disconnect("counter-1");
    await service.connection.connect("counter-2");
    channel.emit({ ...dto, deviceId: "counter-2", name: "계수기 2" });
    resolveDisconnect?.();
    await staleDisconnect;

    expect(useCounterStore.getState().counters).toEqual([{ ...counter, id: "counter-2", name: "계수기 2" }]);
  });

  it("derives connection state from counter presence", () => {
    const service = createCounterService({ counterRepository: createRepository(), counterChannel: createChannel() });
    const { result, rerender } = renderHook(() => service.use.isConnected("counter-1"));
    expect(result.current).toBe(false);
    act(() => {
      useCounterStore.getState().add(counter);
      rerender();
    });
    expect(result.current).toBe(true);
  });

  it("returns a stable stopwatch snapshot and updates it from the store", () => {
    const service = createCounterService({ counterRepository: createRepository(), counterChannel: createChannel() });
    const { result } = renderHook(() => service.use.stopwatch("counter-1"));

    expect(result.current).toEqual({ startedAt: null, stoppedAt: null });
    act(() => useCounterStore.getState().add({ ...counter, startedAt: 100 }));
    expect(result.current).toMatchObject({ startedAt: 100, stoppedAt: null });
    act(() => useCounterStore.getState().stop("counter-1", 200));
    expect(result.current).toMatchObject({ startedAt: 100, stoppedAt: 200 });
  });
});
