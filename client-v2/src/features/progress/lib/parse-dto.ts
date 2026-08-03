import type { Competition } from "@/entities/competition";
import type { Division } from "@/entities/division";
import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";
import { parseTimerLogTypeDto, type TimerLog } from "@/entities/timer";

import type { ProgressDto, ProgressRecordDto, ProgressTimerLogDto } from "../api/types";
import type { ProgressState } from "../model/types";

const parseCompetition = (dto: NonNullable<ProgressDto["competition"]>): Competition => ({ ...dto, createdAt: new Date(dto.createdAt) });
const parseDivision = (dto: NonNullable<ProgressDto["division"]>): Division => ({ ...dto, createdAt: new Date(dto.createdAt) });
const parseParticipant = (dto: ProgressDto["nextRunners"][number]): Participant => ({ ...dto, createdAt: new Date(dto.createdAt) });
const parseRecord = (dto: ProgressRecordDto): Record => ({ ...dto, createdAt: new Date(dto.createdAt) });
const parseTimerLog = (dto: ProgressTimerLogDto): TimerLog => {
  const { timerLogType: type, value } = parseTimerLogTypeDto(dto.type, dto.value);
  return { ...dto, value, type, createdAt: new Date(dto.createdAt) };
};

export function parseProgressDto(dto: ProgressDto): ProgressState {
  return {
    id: dto.id,
    competition: dto.competition ? parseCompetition(dto.competition) : null,
    division: dto.division ? parseDivision(dto.division) : null,
    runner: dto.runner ? {
      participant: parseParticipant(dto.runner.participant),
      timerLogs: dto.runner.timerLogs.map(parseTimerLog),
      records: dto.runner.records.map(parseRecord),
    } : null,
    nextRunners: dto.nextRunners.map(parseParticipant),
    topRecords: dto.topRecords.map(parseRecord),
  };
}
