import type { Competition, CompetitionForm } from "../model/types";

export interface CompetitionDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CompetitionCreateDto {
  name: string;
  description: string;
}

export interface CompetitionRepository {
  getAllCompetitions(): Promise<Competition[]>;
  getCompetitionById(competitionId: string): Promise<Competition | null>;
  createCompetition(form: CompetitionForm): Promise<Competition>;
  updateCompetition(competition: Competition): Promise<Competition>;
  deleteCompetition(competitionId: string): Promise<void>;
}
