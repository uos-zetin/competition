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

export type ParticipantCreateDto = Omit<ParticipantForm, "divisionId">;

export interface ParticipantRepository {
  getParticipantsByDivision(divisionId: string): Promise<Participant[]>;
  createParticipant(form: ParticipantForm): Promise<Participant>;
  createParticipants(divisionId: string, forms: ParticipantForm[]): Promise<Participant[]>;
  updateParticipant(participant: Participant): Promise<Participant>;
  deleteParticipant(participantId: string): Promise<void>;
}
