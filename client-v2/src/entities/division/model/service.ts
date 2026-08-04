import { useShallow } from "zustand/react/shallow";

import type { DivisionRepository } from "../api/types";

import { DivisionFormSchema } from "./schema";
import { useDivisionStore } from "./store.zustand";
import type { Division, DivisionFormValues } from "./types";

export function createDivisionService({ divisionRepository }: { divisionRepository: DivisionRepository }) {
  const useDivisions = (): Division[] => useDivisionStore((state) => state.divisions);
  const useDivisionById = (divisionId: string): Division | undefined =>
    useDivisionStore((state) => state.divisions.find((division) => division.id === divisionId));
  const useDivisionsByCompetition = (competitionId: string): Division[] =>
    useDivisionStore(
      useShallow((state) =>
        state.divisions
          .filter((division) => division.competitionId === competitionId)
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    );

  return {
    load: async (competitionId: string): Promise<void> => {
      const divisions = await divisionRepository.getAllDivisions(competitionId);
      useDivisionStore.getState().setByCompetition(competitionId, divisions);
    },
    loadById: async (divisionId: string): Promise<Division | null> => {
      const division = await divisionRepository.getDivisionById(divisionId);
      if (division) useDivisionStore.getState().add(division);
      return division;
    },
    admin: {
      create: async (competitionId: string, form: DivisionFormValues): Promise<Division> => {
        const division = await divisionRepository.createDivision(competitionId, DivisionFormSchema.parse(form));
        useDivisionStore.getState().add(division);
        return division;
      },
      update: async (division: Division, form: DivisionFormValues): Promise<Division> => {
        const parsed = DivisionFormSchema.parse(form);
        const updated = await divisionRepository.updateDivision({ ...division, ...parsed });
        if (!updated) throw new Error(`Division not found: ${division.id}`);
        useDivisionStore.getState().update(updated);
        return updated;
      },
      remove: async (divisionId: string): Promise<void> => {
        await divisionRepository.deleteDivision(divisionId);
        useDivisionStore.getState().remove(divisionId);
      },
    },
    use: {
      divisions: useDivisions,
      divisionById: useDivisionById,
      divisionsByCompetition: useDivisionsByCompetition,
    },
  };
}
