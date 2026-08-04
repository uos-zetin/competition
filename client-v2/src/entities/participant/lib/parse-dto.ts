import type { ParticipantCreateDto, ParticipantDto } from "../api/types";
import type { Participant, ParticipantForm } from "../model/types";

export function parseParticipantDto(dto: ParticipantDto): Participant {
  return { ...dto, createdAt: new Date(dto.createdAt) };
}

export function parseParticipantForm(form: ParticipantForm): ParticipantCreateDto {
  const { name, teamName, robotName, comment, orderRaw } = form;
  return { name, teamName, robotName, comment, orderRaw };
}
