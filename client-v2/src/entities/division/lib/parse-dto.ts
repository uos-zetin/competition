import type { DivisionCreateDto, DivisionDto, DivisionStatusDto } from "../api/types";
import type { Division, DivisionFormValues, DivisionStatus } from "../model/types";

export function parseDivisionStatusDto(status: DivisionStatusDto): DivisionStatus {
  switch (status) {
    case "ready":
    case "ongoing":
    case "closed":
      return status;
  }
}

export function parseDivisionDto(dto: DivisionDto): Division {
  return {
    id: dto.id,
    competitionId: dto.competitionId,
    name: dto.name,
    description: dto.description,
    createdAt: new Date(dto.createdAt),
    status: parseDivisionStatusDto(dto.status),
    timeLimit: dto.timeLimit,
  };
}

export function parseDivisionForm(form: DivisionFormValues): DivisionCreateDto {
  return { name: form.name, description: form.description, timeLimit: form.timeLimit };
}
