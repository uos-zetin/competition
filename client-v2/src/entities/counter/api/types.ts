import type { CounterState } from "../model/types";

export interface CounterDto {
  deviceId: string;
  name: string;
  startedAt: number | null;
  stoppedAt: number | null;
  divisionId: string | null;
}

export interface CounterRepository {
  getAll(): Promise<CounterState[]>;
  getById(counterId: string): Promise<CounterState | null>;
  reset(counterId: string): Promise<void>;
  connectDivision(counterId: string, divisionId: string): Promise<void>;
  disconnectDivision(counterId: string): Promise<void>;
}

export interface CounterChannel {
  connect(counterId: string): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(handler: (counter: CounterDto) => void): () => void;
}
