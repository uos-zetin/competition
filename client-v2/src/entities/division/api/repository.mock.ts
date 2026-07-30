import type { Division, DivisionFormValues } from "../model/types";

import type { DivisionRepository } from "./types";

const seedDivisions: Division[] = [
  {
    id: "division-preliminary-a",
    competitionId: "competition-2026-spring",
    name: "예선 A조",
    description: "예선 첫 번째 조입니다.",
    createdAt: new Date("2026-03-03T09:00:00+09:00"),
    status: "ready",
    timeLimit: 90,
  },
  {
    id: "division-finals",
    competitionId: "competition-2026-spring",
    name: "본선",
    description: "예선을 통과한 팀이 참가합니다.",
    createdAt: new Date("2026-03-04T09:00:00+09:00"),
    status: "ongoing",
    timeLimit: 180,
  },
  {
    id: "division-championship",
    competitionId: "competition-2026-spring",
    name: "결승",
    description: "",
    createdAt: new Date("2026-03-05T09:00:00+09:00"),
    status: "closed",
    timeLimit: 120,
  },
];

export class DivisionMockRepository implements DivisionRepository {
  private divisions = seedDivisions.map((division) => ({ ...division }));

  async getAllDivisions(competitionId: string): Promise<Division[]> {
    return this.divisions.filter((division) => division.competitionId === competitionId);
  }

  async getDivisionById(divisionId: string): Promise<Division | null> {
    return this.divisions.find((division) => division.id === divisionId) ?? null;
  }

  async createDivision(competitionId: string, form: DivisionFormValues): Promise<Division> {
    const division: Division = {
      id: crypto.randomUUID(),
      competitionId,
      ...form,
      createdAt: new Date(),
      status: "ready",
    };
    this.divisions.push(division);
    return division;
  }

  async updateDivision(division: Division): Promise<Division | null> {
    const index = this.divisions.findIndex((item) => item.id === division.id);
    if (index === -1) return null;
    this.divisions[index] = division;
    return division;
  }

  async deleteDivision(divisionId: string): Promise<void> {
    this.divisions = this.divisions.filter((division) => division.id !== divisionId);
  }
}
