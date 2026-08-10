import type { Participant } from "@/entities/participant";

export const PARTICIPANTS_PER_PAGE = 5;

export function sortParticipantsByOrder(participants: Participant[]): Participant[] {
  return [...participants].sort((a, b) => a.orderRaw - b.orderRaw);
}

export function paginateParticipants(sorted: Participant[], page: number): Participant[] {
  const start = (page - 1) * PARTICIPANTS_PER_PAGE;
  return sorted.slice(start, start + PARTICIPANTS_PER_PAGE);
}

export function getTotalPages(count: number): number {
  return Math.ceil(count / PARTICIPANTS_PER_PAGE);
}
