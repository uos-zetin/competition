import type { User, UserCreateForm, UserRole } from "../model/types";

export type UserRoleDto = UserRole;

export type UserDto = {
  id: string;
  name: string;
  roles: UserRoleDto[];
  createdAt: string;
};

export type UserCreateDto = {
  name: string;
  username: string;
  password: string;
};

export interface UserRepository {
  getAllUsers(): Promise<User[]>;
  getCurrentUser(): Promise<User | null>;
  createUser(form: UserCreateForm): Promise<User>;
  updateRoles(userId: string, roles: UserRole[]): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}
