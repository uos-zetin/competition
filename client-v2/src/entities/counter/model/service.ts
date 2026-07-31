import type { CounterChannel, CounterRepository } from "../api/types";
import { parseCounterDto } from "../lib/parse-dto";

import { useCounterStore } from "./store.zustand";
import type { CounterState } from "./types";

export function createCounterService({
  counterRepository,
  counterChannel,
}: {
  counterRepository: CounterRepository;
  counterChannel: CounterChannel;
}) {
  let unsubscribe: (() => void) | null = null;

  const updateStore = (counter: CounterState) => {
    const store = useCounterStore.getState();
    const current = store.counters.find((item) => item.id === counter.id);
    if (!current || current.name !== counter.name || current.divisionId !== counter.divisionId) {
      store.add(counter);
      return;
    }
    if (counter.startedAt !== current.startedAt) {
      if (counter.startedAt !== null) store.start(counter.id, counter.startedAt);
      else store.reset(counter.id);
    }
    if (counter.stoppedAt !== current.stoppedAt && counter.stoppedAt !== null) store.stop(counter.id, counter.stoppedAt);
  };
  const useCounters = (): CounterState[] => useCounterStore((state) => state.counters);
  const useCounterState = (counterId: string): CounterState | null =>
    useCounterStore((state) => state.counters.find((counter) => counter.id === counterId) ?? null);
  const useIsConnected = (counterId: string): boolean =>
    useCounterStore((state) => state.counters.some((counter) => counter.id === counterId));
  const useStopwatch = (counterId: string): Pick<CounterState, "startedAt" | "stoppedAt"> =>
    useCounterStore((state) => {
      const counter = state.counters.find((item) => item.id === counterId);
      return { startedAt: counter?.startedAt ?? null, stoppedAt: counter?.stoppedAt ?? null };
    });

  return {
    load: {
      all: async (): Promise<void> => useCounterStore.getState().init(await counterRepository.getAll()),
      byId: (counterId: string): Promise<CounterState | null> => counterRepository.getById(counterId),
    },
    admin: {
      reset: (counterId: string): Promise<void> => counterRepository.reset(counterId),
      connectDivision: (counterId: string, divisionId: string): Promise<void> =>
        counterRepository.connectDivision(counterId, divisionId),
      disconnectDivision: (counterId: string): Promise<void> => counterRepository.disconnectDivision(counterId),
    },
    connection: {
      connect: async (counterId: string): Promise<void> => {
        unsubscribe?.();
        unsubscribe = counterChannel.subscribe((dto) => updateStore(parseCounterDto(dto)));
        try {
          await counterChannel.connect(counterId);
        } catch (error) {
          unsubscribe?.();
          unsubscribe = null;
          throw error;
        }
      },
      disconnect: async (counterId?: string): Promise<void> => {
        unsubscribe?.();
        unsubscribe = null;
        await counterChannel.disconnect();
        if (counterId) useCounterStore.getState().remove(counterId);
      },
    },
    use: {
      counters: useCounters,
      counterState: useCounterState,
      isConnected: useIsConnected,
      stopwatch: useStopwatch,
    },
  };
}
