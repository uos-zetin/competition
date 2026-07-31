import type { Participant, ParticipantForm } from "../model/types";

import type { ParticipantRepository } from "./types";

const seedParticipants: Participant[] = [
  {
    id: "participant-1",
    divisionId: "division-elementary",
    name: "김라인",
    teamName: "트레이서즈",
    robotName: "LT-01",
    comment: "예선에서 라인 이탈 1회, 결선은 무사고 완주했습니다.",
    orderRaw: 1,
    createdAt: new Date("2026-03-03T09:00:00+09:00"),
  },
  {
    id: "participant-2",
    divisionId: "division-elementary",
    name: "박순환",
    teamName: "회로도둑",
    robotName: "블랙박스",
    comment: "",
    orderRaw: 2,
    createdAt: new Date("2026-03-04T09:00:00+09:00"),
  },
  {
    id: "participant-3",
    divisionId: "division-middle",
    name: "이궤적",
    teamName: "커브",
    robotName: "Arc-7",
    comment: "",
    orderRaw: 1,
    createdAt: new Date("2026-03-05T09:00:00+09:00"),
  },
];

export class ParticipantMockRepository implements ParticipantRepository {
  private participants = seedParticipants.map((participant) => ({ ...participant }));

  async getParticipantsByDivision(divisionId: string): Promise<Participant[]> {
    return this.participants.filter((participant) => participant.divisionId === divisionId);
  }

  async getParticipantById(participantId: string): Promise<Participant | null> {
    return this.participants.find((participant) => participant.id === participantId) ?? null;
  }

  async createParticipant(form: ParticipantForm): Promise<Participant> {
    const participant: Participant = { id: crypto.randomUUID(), ...form, createdAt: new Date() };
    this.participants.push(participant);
    return participant;
  }

  async createParticipants(divisionId: string, forms: ParticipantForm[]): Promise<Participant[]> {
    const participants = forms.map((form) => ({
      id: crypto.randomUUID(),
      ...form,
      divisionId,
      createdAt: new Date(),
    }));
    this.participants.push(...participants);
    return participants;
  }

  async updateParticipant(participant: Participant): Promise<Participant> {
    const index = this.participants.findIndex((item) => item.id === participant.id);
    if (index !== -1) this.participants[index] = participant;
    return participant;
  }

  async deleteParticipant(participantId: string): Promise<void> {
    this.participants = this.participants.filter((participant) => participant.id !== participantId);
  }
}
