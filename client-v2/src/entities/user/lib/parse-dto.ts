import type { UserCreateDto, UserDto } from "../api/types";
import type { User, UserCreateForm } from "../model/types";

export function parseUserDto(dto: UserDto): User {
  return { id: dto.id, name: dto.name, roles: dto.roles, createdAt: new Date(dto.createdAt) };
}

export function parseUserCreateForm(form: UserCreateForm): UserCreateDto {
  return { name: form.name, username: form.username, password: form.password };
}
