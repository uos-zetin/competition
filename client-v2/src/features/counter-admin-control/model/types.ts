import type { Competition } from "@/entities/competition";
import type { CounterState } from "@/entities/counter";
import type { Division } from "@/entities/division";

export interface CounterAdminControlDeps {
  counterService: {
    admin: {
      reset: (counterId: string) => Promise<void>;
      connectDivision: (counterId: string, divisionId: string) => Promise<void>;
      disconnectDivision: (counterId: string) => Promise<void>;
    };
    use: {
      counterState: (counterId: string) => CounterState | null;
      isConnected: (counterId: string) => boolean;
      stopwatch: (counterId: string) => Pick<CounterState, "startedAt" | "stoppedAt">;
    };
  };
  divisionService: {
    load: (competitionId: string) => Promise<unknown>;
    loadById: (divisionId: string) => Promise<Division | null>;
    use: {
      divisions: () => Division[];
      divisionById: (divisionId: string) => Division | undefined;
    };
  };
  competitionService: {
    load: () => Promise<void>;
    use: {
      competitions: () => Competition[];
    };
  };
}
