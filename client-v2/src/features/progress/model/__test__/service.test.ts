import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ProgressChannel, ProgressRepository } from "../../api/types";
import { createProgressService } from "../service";
import { useProgressStore } from "../store.zustand";
import type { ProgressState } from "../types";

const progress: ProgressState = {
  id: "division-1",
  competition: null,
  division: {
    id: "division-1",
    competitionId: "competition-1",
    name: "A조",
    description: "",
    createdAt: new Date(),
    status: "ready",
    timeLimit: 60,
  },
  runner: null,
  nextRunners: [],
  topRecords: [],
};

function createRepository(): ProgressRepository {
  return {
    getProgress: vi.fn(),
    openProgressDivision: vi.fn(),
    closeProgressDivision: vi.fn(),
    resetProgressDivision: vi.fn(),
    setCurrentRunner: vi.fn(),
    postponeCurrentRunner: vi.fn(),
  };
}

function createChannel(): ProgressChannel & { emit(state: ProgressState): void } {
  let handler: ((state: ProgressState) => void) | undefined;
  return {
    connect: vi.fn(),
    disconnect: vi.fn(),
    subscribe: vi.fn((nextHandler) => {
      handler = nextHandler;
      return () => {
        handler = undefined;
      };
    }),
    emit: (state) => handler?.(state),
  };
}

describe("createProgressService", () => {
  beforeEach(() => useProgressStore.getState().reset());

  it("loads a division progress snapshot into the local store", async () => {
    const repository = createRepository();
    vi.mocked(repository.getProgress).mockResolvedValue(progress);
    const loaded = await createProgressService({
      progressRepository: repository,
      progressChannel: createChannel(),
    }).load.byDivision("division-1");
    expect(loaded).toEqual(progress);
    expect(useProgressStore.getState().progress).toEqual(progress);
  });

  it("delegates admin commands without directly changing the store", async () => {
    const repository = createRepository();
    const service = createProgressService({ progressRepository: repository, progressChannel: createChannel() });
    useProgressStore.getState().setProgress(progress);
    await service.admin.openDivision("division-1");
    await service.admin.closeDivision("division-1");
    await service.admin.resetDivision("division-1");
    await service.admin.setCurrentRunner("division-1", "participant-1");
    await service.admin.postponeCurrentRunner("division-1");
    expect(repository.openProgressDivision).toHaveBeenCalledWith("division-1");
    expect(repository.closeProgressDivision).toHaveBeenCalledWith("division-1");
    expect(repository.resetProgressDivision).toHaveBeenCalledWith("division-1");
    expect(repository.setCurrentRunner).toHaveBeenCalledWith("division-1", "participant-1");
    expect(repository.postponeCurrentRunner).toHaveBeenCalledWith("division-1");
    expect(useProgressStore.getState().progress).toEqual(progress);
  });

  it("subscribes to channel messages and applies them to the store", async () => {
    const channel = createChannel();
    const service = createProgressService({ progressRepository: createRepository(), progressChannel: channel });
    await service.connection.connect("division-1");
    channel.emit(progress);
    expect(useProgressStore.getState().progress).toEqual(progress);
    expect(channel.connect).toHaveBeenCalledWith("division-1");
  });

  it("replaces the previous subscription when reconnecting", async () => {
    const channel = createChannel();
    const service = createProgressService({ progressRepository: createRepository(), progressChannel: channel });
    await service.connection.connect("division-1");
    await service.connection.connect("division-2");
    expect(channel.subscribe).toHaveBeenCalledTimes(2);
    expect(channel.connect).toHaveBeenLastCalledWith("division-2");
  });

  it("unsubscribes, disconnects, and resets progress", async () => {
    const channel = createChannel();
    const service = createProgressService({ progressRepository: createRepository(), progressChannel: channel });
    await service.connection.connect("division-1");
    channel.emit(progress);
    await service.connection.disconnect();
    expect(channel.disconnect).toHaveBeenCalledOnce();
    expect(useProgressStore.getState().progress).toBeNull();
  });

  it("does not reset a newer connection while a previous disconnect is pending", async () => {
    const channel = createChannel();
    let resolveDisconnect: (() => void) | undefined;
    vi.mocked(channel.disconnect).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveDisconnect = resolve;
        })
    );
    const service = createProgressService({ progressRepository: createRepository(), progressChannel: channel });

    await service.connection.connect("division-1");
    const staleDisconnect = service.connection.disconnect();
    await service.connection.connect("division-1");
    channel.emit(progress);
    resolveDisconnect?.();
    await staleDisconnect;

    expect(useProgressStore.getState().progress).toEqual(progress);
  });
});
