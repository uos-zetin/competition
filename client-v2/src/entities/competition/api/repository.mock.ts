import type { Competition, CompetitionForm } from "../model/types";

import type { CompetitionRepository } from "./types";

const seedCompetitions: Competition[] = [
  {
    id: "competition-2026-spring",
    name: "2026 상반기 라인트레이서 경진대회",
    description: "예선 라운드와 결선 라운드로 구분해 진행하며, 결선 진출자는 부문별 상위 8팀입니다.",
    createdAt: new Date("2026-03-02T09:00:00+09:00"),
  },
  {
    id: "competition-freshman",
    name: "학과 신입생 환영 대회",
    description: "",
    createdAt: new Date("2026-02-14T09:00:00+09:00"),
  },
  {
    id: "competition-2025-fall",
    name: "2025 하반기 라인트레이서 경진대회",
    description: "",
    createdAt: new Date("2025-11-01T09:00:00+09:00"),
  },
  {
    id: "competition-upcoming",
    name: "2026 겨울 친선 대회",
    description: "준비 중인 대회입니다.",
    createdAt: new Date("2026-08-01T09:00:00+09:00"),
  },
];

export class CompetitionMockRepository implements CompetitionRepository {
  private competitions = seedCompetitions.map((competition) => ({ ...competition }));

  async getAllCompetitions(): Promise<Competition[]> {
    return [...this.competitions];
  }

  async getCompetitionById(competitionId: string): Promise<Competition | null> {
    return this.competitions.find((competition) => competition.id === competitionId) ?? null;
  }

  async createCompetition(form: CompetitionForm): Promise<Competition> {
    const competition: Competition = { id: crypto.randomUUID(), ...form, createdAt: new Date() };
    this.competitions.push(competition);
    return competition;
  }

  async updateCompetition(competition: Competition): Promise<Competition> {
    const index = this.competitions.findIndex((item) => item.id === competition.id);
    if (index !== -1) this.competitions[index] = competition;
    return competition;
  }

  async deleteCompetition(competitionId: string): Promise<void> {
    this.competitions = this.competitions.filter((competition) => competition.id !== competitionId);
  }
}
