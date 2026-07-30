export type DivisionStatus = "ready" | "ongoing" | "closed";

export const MAX_TIME_LIMIT_SECONDS = 5999;

export type Division = {
  id: string;
  competitionId: string;
  name: string;
  description: string;
  createdAt: Date;
  status: DivisionStatus;
  timeLimit: number;
};

export type DivisionFormValues = Pick<Division, "name" | "description" | "timeLimit">;

export interface DivisionStore {
  divisions: Division[];
  init: (divisions: Division[]) => void;
  add: (division: Division) => void;
  update: (division: Division) => void;
  remove: (divisionId: string) => void;
  clearAll: () => void;
}
