import type { CounterAdminControlDeps } from "./types";

export function createCounterAdminControlService({
  counterService,
  divisionService,
  competitionService,
}: CounterAdminControlDeps) {
  return {
    load: {
      competitions: (): Promise<void> => competitionService.load(),
      divisionsByCompetition: (competitionId: string): Promise<void> => divisionService.load(competitionId),
      connectedDivision: (divisionId: string) => divisionService.loadById(divisionId),
    },
    control: {
      connectDivision: (counterId: string, divisionId: string): Promise<void> =>
        counterService.admin.connectDivision(counterId, divisionId),
      disconnectDivision: (counterId: string): Promise<void> => counterService.admin.disconnectDivision(counterId),
      reset: (counterId: string): Promise<void> => counterService.admin.reset(counterId),
    },
    use: {
      counter: (counterId: string) => counterService.use.counterState(counterId),
      isConnected: (counterId: string): boolean => counterService.use.isConnected(counterId),
      stopwatch: (counterId: string) => counterService.use.stopwatch(counterId),
      competitions: () => competitionService.use.competitions(),
      divisionsForSelectedCompetition: () => divisionService.use.divisions(),
      connectedDivision: (divisionId: string) => divisionService.use.divisionById(divisionId),
    },
  };
}
