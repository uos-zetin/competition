import type { ProgressState } from "../model/types";

export type ProgressCompetitionDto = { id: string; name: string; description: string; createdAt: string };
export type ProgressDivisionDto = { id: string; competitionId: string; name: string; description: string; createdAt: string; status: "ready" | "ongoing" | "closed"; timeLimit: number };
export type ProgressParticipantDto = { id: string; divisionId: string; name: string; teamName: string; robotName: string; comment: string; orderRaw: number; createdAt: string };
export type ProgressRecordDto = { id: string; participantId: string; value: number; source: "stopwatch" | "manual" | "other"; status: "pending" | "approved" | "rejected"; note: string; createdAt: string };
export type ProgressTimerLogDto = { id: string; participantId: string; value: number; type: "start" | "stop" | "adjust"; createdAt: string };

export interface ProgressDto {
  id: string;
  competition?: ProgressCompetitionDto | null;
  division?: ProgressDivisionDto | null;
  runner?: { participant: ProgressParticipantDto; timerLogs: ProgressTimerLogDto[]; records: ProgressRecordDto[] } | null;
  nextRunners: ProgressParticipantDto[];
  topRecords: ProgressRecordDto[];
}

export interface ProgressRepository {
  getProgress(divisionId: string): Promise<ProgressState>;
  openProgressDivision(divisionId: string): Promise<void>;
  closeProgressDivision(divisionId: string): Promise<void>;
  resetProgressDivision(divisionId: string): Promise<void>;
  setCurrentRunner(divisionId: string, participantId: string): Promise<void>;
  postponeCurrentRunner(divisionId: string): Promise<void>;
}

export interface ProgressChannel {
  connect(divisionId: string): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(handler: (state: ProgressState) => void): () => void;
}
