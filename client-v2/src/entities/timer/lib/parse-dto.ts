import type { TimerLogDto, TimerLogTypeDto } from "../api/types";
import type { TimerLog, TimerLogType } from "../model/types";

export function parseTimerLogTypeDto(
  type: TimerLogTypeDto,
  value: number
): { timerLogType: TimerLogType; value: number } {
  if (type === "start" || type === "stop") return { timerLogType: type, value };
  return value > 0 ? { timerLogType: "add", value } : { timerLogType: "sub", value: -value };
}

export function parseTimerLogDto(dto: TimerLogDto): TimerLog {
  const { timerLogType: type, value } = parseTimerLogTypeDto(dto.type, dto.value);
  return { id: dto.id, participantId: dto.participantId, value, type, createdAt: new Date(dto.createdAt) };
}
