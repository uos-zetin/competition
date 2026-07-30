import type { User, UserCreateForm, UserRole } from "../model/types";

import type { UserRepository } from "./types";

const seedUsers: User[] = [
  { id: "user-kim-jaehyun", name: "김재현", roles: ["administrator"], createdAt: new Date("2026-03-01T09:00:00+09:00") },
  { id: "user-lee-sua", name: "이수아", roles: ["manualRecorder"], createdAt: new Date("2026-03-02T09:00:00+09:00") },
  {
    id: "user-park-doyoon",
    name: "박도윤",
    roles: ["stopwatchRecorder", "manualRecorder"],
    createdAt: new Date("2026-03-03T09:00:00+09:00"),
  },
  { id: "user-choi-eunbi", name: "최은비", roles: [], createdAt: new Date("2026-03-04T09:00:00+09:00") },
];

export class UserMockRepository implements UserRepository {
  private users = seedUsers.map((user) => ({ ...user, roles: [...user.roles] }));

  async getAllUsers(): Promise<User[]> {
    return this.users.map((user) => ({ ...user, roles: [...user.roles] }));
  }

  async getCurrentUser(): Promise<User | null> {
    return this.users[0] ? { ...this.users[0], roles: [...this.users[0].roles] } : null;
  }

  async createUser(form: UserCreateForm): Promise<User> {
    const user: User = { id: crypto.randomUUID(), name: form.name, roles: [], createdAt: new Date() };
    this.users.push(user);
    return { ...user, roles: [...user.roles] };
  }

  async updateRoles(userId: string, roles: UserRole[]): Promise<User> {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index === -1) throw new Error(`User not found: ${userId}`);
    const user = { ...this.users[index], roles: [...roles] };
    this.users[index] = user;
    return { ...user, roles: [...user.roles] };
  }

  async deleteUser(userId: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== userId);
  }
}
