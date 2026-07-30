import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { ParticipantStore } from "./types";

function sortByOrderRaw(participants: { orderRaw: number }[]) {
  participants.sort((a, b) => a.orderRaw - b.orderRaw);
}

export const useParticipantStore = create<ParticipantStore>()(
  immer((set) => ({
    participants: [],
    init: (participants) =>
      set((state) => {
        state.participants = [...participants];
        sortByOrderRaw(state.participants);
      }),
    setByDivision: (divisionId, participants) =>
      set((state) => {
        state.participants = state.participants.filter((participant) => participant.divisionId !== divisionId);
        state.participants.push(...participants);
        sortByOrderRaw(state.participants);
      }),
    add: (participant) =>
      set((state) => {
        state.participants = state.participants.filter((item) => item.id !== participant.id);
        state.participants.push(participant);
        sortByOrderRaw(state.participants);
      }),
    update: (participant) =>
      set((state) => {
        const index = state.participants.findIndex((item) => item.id === participant.id);
        if (index !== -1) {
          state.participants[index] = participant;
          sortByOrderRaw(state.participants);
        }
      }),
    remove: (participantId) =>
      set((state) => {
        state.participants = state.participants.filter((participant) => participant.id !== participantId);
      }),
    clearAll: () =>
      set((state) => {
        state.participants = [];
      }),
  }))
);
