import type { ParticipantCreateDto, ParticipantDto } from "../api/types";
import type { Participant, ParticipantForm } from "../model/types";

export function parseParticipantDto(dto: ParticipantDto): Participant {
  return { ...dto, createdAt: new Date(dto.createdAt) };
}

export function parseParticipantForm(form: ParticipantForm): ParticipantCreateDto {
  return { ...form };
}
