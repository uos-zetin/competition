export type Competition = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

export type CompetitionForm = Pick<Competition, "name" | "description">;

export interface CompetitionStore {
  competitions: Competition[];
  init: (competitions: Competition[]) => void;
  add: (competition: Competition) => void;
  update: (competition: Competition) => void;
  remove: (competitionId: string) => void;
  clearAll: () => void;
}
