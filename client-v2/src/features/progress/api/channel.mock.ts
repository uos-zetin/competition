import type { ProgressState } from "../model/types";

import type { ProgressChannel } from "./types";

export const mockProgressStates = new Map<string, ProgressState>();
const handlers = new Set<(state: ProgressState) => void>();

export function emitMockProgress(state: ProgressState): void {
  mockProgressStates.set(state.id, state);
  handlers.forEach((handler) => handler(state));
}

export class ProgressMockChannel implements ProgressChannel {
  async connect(divisionId: string): Promise<void> {
    const progress = mockProgressStates.get(divisionId);
    if (progress) emitMockProgress(progress);
  }

  async disconnect(): Promise<void> {
    handlers.clear();
  }

  subscribe(handler: (state: ProgressState) => void): () => void {
    handlers.add(handler);
    return () => handlers.delete(handler);
  }
}
