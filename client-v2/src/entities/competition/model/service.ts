import type { CompetitionRepository } from "../api/types";

import { CompetitionFormSchema } from "./schema";
import { useCompetitionStore } from "./store.zustand";
import type { Competition, CompetitionForm } from "./types";

export function createCompetitionService({ competitionRepository }: { competitionRepository: CompetitionRepository }) {
  const useCompetitions = (): Competition[] => useCompetitionStore((state) => state.competitions);

  return {
    load: async (): Promise<void> => {
      const competitions = await competitionRepository.getAllCompetitions();
      useCompetitionStore.getState().init(competitions);
    },
    admin: {
      create: async (form: CompetitionForm): Promise<Competition> => {
        const competition = await competitionRepository.createCompetition(CompetitionFormSchema.parse(form));
        useCompetitionStore.getState().add(competition);
        return competition;
      },
      update: async (competition: Competition): Promise<Competition> => {
        const form = CompetitionFormSchema.parse(competition);
        const updatedCompetition = await competitionRepository.updateCompetition({ ...competition, ...form });
        useCompetitionStore.getState().update(updatedCompetition);
        return updatedCompetition;
      },
      remove: async (competitionId: string): Promise<void> => {
        await competitionRepository.deleteCompetition(competitionId);
        useCompetitionStore.getState().remove(competitionId);
      },
    },
    use: {
      competitions: useCompetitions,
    },
  };
}
