import type { Competition } from "@/entities/competition";
import type { Division } from "@/entities/division";
import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";

import { emitMockProgress, mockProgressStates } from "./channel.mock";
import type { ProgressRepository } from "./types";

const competition: Competition = { id: "competition-2026-spring", name: "2026 상반기 라인트레이서 경진대회", description: "", createdAt: new Date("2026-03-02T09:00:00+09:00") };
const divisions = new Map<string, Division>([
  ["division-preliminary-a", { id: "division-preliminary-a", competitionId: competition.id, name: "예선 A조", description: "예선 첫 번째 조입니다.", createdAt: new Date("2026-03-03T09:00:00+09:00"), status: "ready", timeLimit: 90 }],
  ["division-finals", { id: "division-finals", competitionId: competition.id, name: "본선", description: "예선을 통과한 팀이 참가합니다.", createdAt: new Date("2026-03-04T09:00:00+09:00"), status: "ongoing", timeLimit: 180 }],
]);
const participants: Participant[] = [
  { id: "participant-3", divisionId: "division-finals", name: "이궤적", teamName: "커브", robotName: "Arc-7", comment: "", orderRaw: 1, createdAt: new Date("2026-03-05T09:00:00+09:00") },
  { id: "participant-5", divisionId: "division-finals", name: "최정밀", teamName: "트레이서즈", robotName: "LT-02", comment: "", orderRaw: 2, createdAt: new Date("2026-03-05T10:00:00+09:00") },
  { id: "participant-6", divisionId: "division-finals", name: "한바퀴", teamName: "회로도둑", robotName: "Loop", comment: "", orderRaw: 3, createdAt: new Date("2026-03-05T10:30:00+09:00") },
];
const records: Record[] = [];
const orders = new Map<string, { participantOrder: string[]; runnerId: string | null }>([["division-finals", { participantOrder: participants.map((participant) => participant.id), runnerId: null }]]);

function compose(divisionId: string) {
  const division = divisions.get(divisionId) ?? null;
  const order = orders.get(divisionId) ?? { participantOrder: [], runnerId: null };
  const runnerIndex = order.runnerId ? order.participantOrder.indexOf(order.runnerId) : -1;
  const runnerParticipant = participants.find((participant) => participant.id === order.runnerId) ?? null;
  return { id: divisionId, competition: division ? competition : null, division, runner: runnerParticipant ? { participant: runnerParticipant, timerLogs: [], records: records.filter((record) => record.participantId === runnerParticipant.id) } : null, nextRunners: order.participantOrder.slice(runnerIndex + 1, runnerIndex + 6).map((id) => participants.find((participant) => participant.id === id)).filter((participant): participant is Participant => Boolean(participant)), topRecords: [] };
}
function emit(divisionId: string) { emitMockProgress(compose(divisionId)); }

mockProgressStates.set("division-finals", compose("division-finals"));

export class ProgressMockRepository implements ProgressRepository {
  async getProgress(divisionId: string) { return mockProgressStates.get(divisionId) ?? compose(divisionId); }
  async openProgressDivision(divisionId: string) { const division = divisions.get(divisionId); if (!division) return; division.status = "ongoing"; orders.set(divisionId, { participantOrder: participants.filter((participant) => participant.divisionId === divisionId).sort((a, b) => a.orderRaw - b.orderRaw).map((participant) => participant.id), runnerId: null }); emit(divisionId); }
  async closeProgressDivision(divisionId: string) { const division = divisions.get(divisionId); if (!division) return; division.status = "closed"; orders.set(divisionId, { participantOrder: [], runnerId: null }); emit(divisionId); }
  async resetProgressDivision(divisionId: string) { const division = divisions.get(divisionId); if (!division) return; division.status = "ready"; orders.set(divisionId, { participantOrder: [], runnerId: null }); emit(divisionId); }
  async setCurrentRunner(divisionId: string, participantId: string) { const order = orders.get(divisionId); if (!order?.participantOrder.includes(participantId)) return; order.runnerId = participantId; emit(divisionId); }
  async postponeCurrentRunner(divisionId: string) { const order = orders.get(divisionId); if (!order?.runnerId) return; const index = order.participantOrder.indexOf(order.runnerId); const nextRunnerId = order.participantOrder[Math.min(index + 1, order.participantOrder.length - 1)]; order.participantOrder = [...order.participantOrder.filter((id) => id !== order.runnerId), order.runnerId]; order.runnerId = nextRunnerId; emit(divisionId); }
}
