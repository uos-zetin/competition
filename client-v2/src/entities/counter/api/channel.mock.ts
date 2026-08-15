import type { CounterState } from "../model/types";

import type { CounterChannel, CounterDto } from "./types";

const seedCounters: CounterState[] = [
  { id: "counter-1", name: "계수기 1", startedAt: null, stoppedAt: null, divisionId: null },
  { id: "counter-2", name: "계수기 2", startedAt: null, stoppedAt: null, divisionId: "division-finals" },
];

export const mockCounterStates = new Map<string, CounterState>(seedCounters.map((counter) => [counter.id, counter]));
const handlers = new Set<(counter: CounterDto) => void>();

export function emitMockCounter(counter: CounterState): void {
  mockCounterStates.set(counter.id, counter);
  const dto: CounterDto = { deviceId: counter.id, ...counter };
  handlers.forEach((handler) => handler(dto));
}

export class CounterMockChannel implements CounterChannel {
  async connect(counterId: string): Promise<void> {
    const counter = mockCounterStates.get(counterId);
    if (counter) emitMockCounter(counter);
  }

  async disconnect(): Promise<void> {
    handlers.clear();
  }

  subscribe(handler: (counter: CounterDto) => void): () => void {
    handlers.add(handler);
    return () => handlers.delete(handler);
  }
}
