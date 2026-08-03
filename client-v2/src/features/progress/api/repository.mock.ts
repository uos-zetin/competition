import { mockProgressStates } from "./channel.mock";
import type { ProgressRepository } from "./types";

export class ProgressMockRepository implements ProgressRepository {
  async getProgress(divisionId: string) { return mockProgressStates.get(divisionId) ?? { id: divisionId, competition: null, division: null, runner: null, nextRunners: [], topRecords: [] }; }
  async openProgressDivision(): Promise<void> {}
  async closeProgressDivision(): Promise<void> {}
  async resetProgressDivision(): Promise<void> {}
  async setCurrentRunner(): Promise<void> {}
  async postponeCurrentRunner(): Promise<void> {}
}
