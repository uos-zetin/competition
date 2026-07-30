import type { CompetitionCreateDto, CompetitionDto } from "../api/types";
import type { Competition, CompetitionForm } from "../model/types";

export function parseCompetitionDto(dto: CompetitionDto): Competition {
  return { id: dto.id, name: dto.name, description: dto.description, createdAt: new Date(dto.createdAt) };
}

export function parseCompetitionForm(form: CompetitionForm): CompetitionCreateDto {
  return { name: form.name, description: form.description };
}
