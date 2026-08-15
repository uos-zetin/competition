import type { Participant, ParticipantForm } from "../model/types";

import type { ParticipantRepository } from "./types";

const seedParticipants: Participant[] = [
  {
    id: "participant-1",
    divisionId: "division-preliminary-a",
    name: "김라인",
    teamName: "트레이서즈",
    robotName: "LT-01",
    comment: "예선에서 라인 이탈 1회, 결선은 무사고 완주했습니다.",
    orderRaw: 1,
    createdAt: new Date("2026-03-03T09:00:00+09:00"),
  },
  {
    id: "participant-2",
    divisionId: "division-preliminary-a",
    name: "박순환",
    teamName: "회로도둑",
    robotName: "블랙박스",
    comment: "",
    orderRaw: 2,
    createdAt: new Date("2026-03-04T09:00:00+09:00"),
  },
  {
    id: "participant-3",
    divisionId: "division-finals",
    name: "이궤적",
    teamName: "커브",
    robotName: "Arc-7",
    comment: "",
    orderRaw: 1,
    createdAt: new Date("2026-03-05T09:00:00+09:00"),
  },
  { id: "participant-4", divisionId: "division-preliminary-a", name: "정선로", teamName: "모터랩", robotName: "M-4", comment: "", orderRaw: 3, createdAt: new Date("2026-03-04T10:00:00+09:00") },
  { id: "participant-5", divisionId: "division-finals", name: "최정밀", teamName: "트레이서즈", robotName: "LT-02", comment: "", orderRaw: 2, createdAt: new Date("2026-03-05T10:00:00+09:00") },
  { id: "participant-6", divisionId: "division-finals", name: "한바퀴", teamName: "회로도둑", robotName: "Loop", comment: "", orderRaw: 3, createdAt: new Date("2026-03-05T10:30:00+09:00") },
  { id: "participant-7", divisionId: "division-championship", name: "윤완주", teamName: "스피드", robotName: "S-1", comment: "", orderRaw: 1, createdAt: new Date("2026-03-06T09:00:00+09:00") },
  { id: "participant-8", divisionId: "division-championship", name: "오정확", teamName: "정밀팀", robotName: "P-3", comment: "", orderRaw: 2, createdAt: new Date("2026-03-06T09:00:00+09:00") },
  { id: "participant-9", divisionId: "division-championship", name: "류빠름", teamName: "스피드", robotName: "S-2", comment: "", orderRaw: 3, createdAt: new Date("2026-03-06T09:00:00+09:00") },
  ...["division-freshman-a", "division-freshman-b", "division-fall-preliminary", "division-fall-finals"].flatMap((divisionId, group) => [1, 2, 3].map((orderRaw) => ({ id: `participant-${10 + group * 3 + orderRaw}`, divisionId, name: `참가자 ${group + 1}-${orderRaw}`, teamName: `팀 ${group + 1}`, robotName: `Robot-${orderRaw}`, comment: "", orderRaw, createdAt: new Date("2026-03-07T09:00:00+09:00") }))),
];

export class ParticipantMockRepository implements ParticipantRepository {
  private participants = seedParticipants.map((participant) => ({ ...participant }));

  async getParticipantsByDivision(divisionId: string): Promise<Participant[]> {
    return this.participants.filter((participant) => participant.divisionId === divisionId);
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
