import { describe, expect, it } from "vitest";

import type { Participant } from "@/entities/participant";

import { getTotalPages, paginateParticipants, sortParticipantsByOrder } from "../paginate-participants";

const participants: Participant[] = [
  { id: "three", divisionId: "division-1", name: "셋", teamName: "팀", robotName: "로봇", comment: "", orderRaw: 3, createdAt: new Date() },
  { id: "one", divisionId: "division-1", name: "하나", teamName: "팀", robotName: "로봇", comment: "", orderRaw: 1, createdAt: new Date() },
  { id: "two", divisionId: "division-1", name: "둘", teamName: "팀", robotName: "로봇", comment: "", orderRaw: 2, createdAt: new Date() },
];

describe("participant pagination", () => {
  it("sorts participants by ascending order without mutating the input", () => {
    const sorted = sortParticipantsByOrder(participants);

    expect(sorted.map((participant) => participant.id)).toEqual(["one", "two", "three"]);
    expect(participants.map((participant) => participant.id)).toEqual(["three", "one", "two"]);
  });

  it("returns the requested page including a final partial page", () => {
    const sorted = Array.from({ length: 7 }, (_, index) => ({ ...participants[0], id: String(index + 1), orderRaw: index + 1 }));

    expect(paginateParticipants(sorted, 1)).toHaveLength(5);
    expect(paginateParticipants(sorted, 2).map((participant) => participant.id)).toEqual(["6", "7"]);
    expect(paginateParticipants(sorted, 3)).toEqual([]);
  });

  it("calculates total pages for empty, partial, and exact multiples", () => {
    expect(getTotalPages(0)).toBe(0);
    expect(getTotalPages(1)).toBe(1);
    expect(getTotalPages(5)).toBe(1);
    expect(getTotalPages(6)).toBe(2);
    expect(getTotalPages(10)).toBe(2);
  });
});
