import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { UserStore } from "./types";

const sortByName = (left: { name: string }, right: { name: string }) => left.name.localeCompare(right.name, "ko");

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    users: [],
    init: (users) =>
      set((state) => {
        state.users = [...users].sort(sortByName);
      }),
    add: (user) =>
      set((state) => {
        state.users = state.users.filter((item) => item.id !== user.id);
        state.users.push(user);
        state.users.sort(sortByName);
      }),
    update: (user) =>
      set((state) => {
        const index = state.users.findIndex((item) => item.id === user.id);
        if (index !== -1) {
          state.users[index] = user;
          state.users.sort(sortByName);
        }
      }),
    remove: (userId) =>
      set((state) => {
        state.users = state.users.filter((item) => item.id !== userId);
      }),
    clearAll: () =>
      set((state) => {
        state.users = [];
      }),
  }))
);
