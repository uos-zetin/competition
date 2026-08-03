import type { Competition } from "@/entities/competition";
import type { Division } from "@/entities/division";
import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";
import type { TimerLog } from "@/entities/timer";

export interface Runner { participant: Participant; timerLogs: TimerLog[]; records: Record[]; }
export interface ProgressState { id: string; competition: Competition | null; division: Division | null; runner: Runner | null; nextRunners: Participant[]; topRecords: Record[]; }
export interface ProgressStore { progress: ProgressState | null; setProgress(progress: ProgressState): void; patchProgress(progress: Partial<ProgressState>): void; reset(): void; }
