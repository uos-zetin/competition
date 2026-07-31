export interface CounterState {
  id: string;
  name: string;
  startedAt: number | null;
  stoppedAt: number | null;
  divisionId: string | null;
}

export interface CounterStore {
  counters: CounterState[];
  init(counters: CounterState[]): void;
  add(counter: CounterState): void;
  update(counter: CounterState): void;
  remove(counterId: string): void;
  clearAll(): void;
  start(counterId: string, startedAt: number): void;
  stop(counterId: string, stoppedAt: number): void;
  reset(counterId: string): void;
}
