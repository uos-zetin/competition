import type { CounterState } from "../model/types";

import type { CounterChannel, CounterDto } from "./types";

export const mockCounterStates = new Map<string, CounterState>();
const handlers = new Set<(counter: CounterDto) => void>();

export function emitMockCounter(counter: CounterState): void {
  mockCounterStates.set(counter.id, counter);
  const dto: CounterDto = { deviceId: counter.id, ...counter };
  handlers.forEach((handler) => handler(dto));
}

export class CounterMockChannel implements CounterChannel {
  async connect(counterId: string): Promise<void> {
    const counter = mockCounterStates.get(counterId) ?? {
      id: counterId,
      name: `계수기 ${counterId}`,
      startedAt: null,
      stoppedAt: null,
      divisionId: null,
    };
    emitMockCounter(counter);
  }

  async disconnect(): Promise<void> {
    handlers.clear();
  }

  subscribe(handler: (counter: CounterDto) => void): () => void {
    handlers.add(handler);
    return () => handlers.delete(handler);
  }
}
