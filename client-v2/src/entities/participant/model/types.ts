export type Participant = {
  id: string;
  divisionId: string;
  name: string;
  teamName: string;
  robotName: string;
  comment: string;
  orderRaw: number;
  createdAt: Date;
};

export type ParticipantForm = Pick<
  Participant,
  "divisionId" | "name" | "teamName" | "robotName" | "comment" | "orderRaw"
>;

export interface DivisionOption {
  id: string;
  name: string;
}

export interface ParticipantStore {
  participants: Participant[];
  init: (participants: Participant[]) => void;
  setByDivision: (divisionId: string, participants: Participant[]) => void;
  add: (participant: Participant) => void;
  update: (participant: Participant) => void;
  remove: (participantId: string) => void;
  clearAll: () => void;
}
