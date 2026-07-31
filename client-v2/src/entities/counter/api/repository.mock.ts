import { emitMockCounter, mockCounterStates } from "./channel.mock";
import type { CounterRepository } from "./types";

export class CounterMockRepository implements CounterRepository {
  async getAll() {
    return [...mockCounterStates.values()];
  }

  async getById(counterId: string) {
    return mockCounterStates.get(counterId) ?? null;
  }

  async reset(counterId: string): Promise<void> {
    const counter = mockCounterStates.get(counterId);
    if (counter) emitMockCounter({ ...counter, startedAt: null, stoppedAt: null });
  }

  async connectDivision(counterId: string, divisionId: string): Promise<void> {
    const counter = mockCounterStates.get(counterId);
    if (counter) emitMockCounter({ ...counter, divisionId });
  }

  async disconnectDivision(counterId: string): Promise<void> {
    const counter = mockCounterStates.get(counterId);
    if (counter) emitMockCounter({ ...counter, divisionId: null });
  }
}
