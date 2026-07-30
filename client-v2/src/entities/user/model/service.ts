import type { UserRepository } from "../api/types";

import { UserCreateFormSchema, UserRolesFormSchema } from "./schema";
import { useUserStore } from "./store.zustand";
import type { User, UserCreateForm, UserRole } from "./types";

export function createUserService({ userRepository }: { userRepository: UserRepository }) {
  const useUsers = (): User[] => useUserStore((state) => state.users);
  const useUserById = (userId: string): User | null =>
    useUserStore((state) => state.users.find((user) => user.id === userId) ?? null);

  return {
    load: {
      all: async (): Promise<void> => {
        const users = await userRepository.getAllUsers();
        useUserStore.getState().init(users);
      },
      currentUser: async (): Promise<User | null> => userRepository.getCurrentUser(),
    },
    admin: {
      create: async (form: UserCreateForm): Promise<User> => {
        const user = await userRepository.createUser(UserCreateFormSchema.parse(form));
        useUserStore.getState().add(user);
        return user;
      },
      updateRoles: async (userId: string, roles: UserRole[]): Promise<User> => {
        const parsed = UserRolesFormSchema.parse({ roles });
        const user = await userRepository.updateRoles(userId, parsed.roles);
        useUserStore.getState().update(user);
        return user;
      },
      remove: async (userId: string): Promise<void> => {
        await userRepository.deleteUser(userId);
        useUserStore.getState().remove(userId);
      },
    },
    use: {
      users: useUsers,
      userById: useUserById,
    },
  };
}
