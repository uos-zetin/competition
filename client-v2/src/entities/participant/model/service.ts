import { useShallow } from "zustand/react/shallow";

import type { ParticipantRepository } from "../api/types";

import { ParticipantFormSchema } from "./schema";
import { useParticipantStore } from "./store.zustand";
import type { Participant, ParticipantForm } from "./types";

export function createParticipantService({ participantRepository }: { participantRepository: ParticipantRepository }) {
  const useParticipants = (): Participant[] => useParticipantStore((state) => state.participants);
  const useByDivision = (divisionId: string): Participant[] =>
    useParticipantStore(
      useShallow((state) => state.participants.filter((participant) => participant.divisionId === divisionId))
    );

  return {
    load: async (divisionId: string): Promise<Participant[]> => {
      const participants = await participantRepository.getParticipantsByDivision(divisionId);
      useParticipantStore.getState().setByDivision(divisionId, participants);
      return participants;
    },
    admin: {
      create: async (form: ParticipantForm): Promise<Participant> => {
        const participant = await participantRepository.createParticipant(ParticipantFormSchema.parse(form));
        useParticipantStore.getState().add(participant);
        return participant;
      },
      createMany: async (divisionId: string, forms: ParticipantForm[]): Promise<Participant[]> => {
        const participants = await participantRepository.createParticipants(
          divisionId,
          forms.map((form) => ParticipantFormSchema.parse(form))
        );
        for (const participant of participants) useParticipantStore.getState().add(participant);
        return participants;
      },
      update: async (participant: Participant): Promise<Participant> => {
        const form = ParticipantFormSchema.parse(participant);
        const updatedParticipant = await participantRepository.updateParticipant({ ...participant, ...form });
        useParticipantStore.getState().update(updatedParticipant);
        return updatedParticipant;
      },
      remove: async (participantId: string): Promise<void> => {
        await participantRepository.deleteParticipant(participantId);
        useParticipantStore.getState().remove(participantId);
      },
    },
    use: { participants: useParticipants, byDivision: useByDivision },
  };
}
