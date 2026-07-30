import type { Fetcher } from "@/shared/api";

import { parseUserCreateForm,parseUserDto } from "../lib/parse-dto";
import type { User, UserCreateForm, UserRole } from "../model/types";

import type { UserDto, UserRepository } from "./types";

export class UserRestRepository implements UserRepository {
  private readonly authenticatedFetcher: Fetcher;

  constructor(authenticatedFetcher: Fetcher) {
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.authenticatedFetcher.get<UserDto[]>("/actors");
    return response.data.map(parseUserDto);
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await this.authenticatedFetcher.get<UserDto>("/actors/whoami");
    return response.data ? parseUserDto(response.data) : null;
  }

  async createUser(form: UserCreateForm): Promise<User> {
    const response = await this.authenticatedFetcher.post<UserDto>("/actors/register", { body: parseUserCreateForm(form) });
    return parseUserDto(response.data);
  }

  async updateRoles(userId: string, roles: UserRole[]): Promise<User> {
    const response = await this.authenticatedFetcher.patch<UserDto>(`/actors/${userId}/roles`, { body: { roles } });
    return parseUserDto(response.data);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.authenticatedFetcher.delete(`/actors/${userId}`);
  }
}
