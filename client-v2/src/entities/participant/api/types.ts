import type { Participant, ParticipantForm } from "../model/types";

export interface ParticipantDto {
  id: string;
  divisionId: string;
  name: string;
  teamName: string;
  robotName: string;
  comment: string;
  orderRaw: number;
  createdAt: string;
}

export type ParticipantCreateDto = ParticipantForm;

export interface ParticipantRepository {
  getParticipantsByDivision(divisionId: string): Promise<Participant[]>;
  getParticipantById(participantId: string): Promise<Participant | null>;
  createParticipant(form: ParticipantForm): Promise<Participant>;
  updateParticipant(participant: Participant): Promise<Participant>;
  deleteParticipant(participantId: string): Promise<void>;
}
