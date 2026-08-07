import { describe, expect, it } from "vitest";

import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";

import { formatTopRecords } from "../format-top-records";

const record = (participantId: string): Record => ({
  id: "record-1",
  participantId,
  value: 12_340,
  source: "stopwatch",
  status: "approved",
  note: "",
  createdAt: new Date(),
});

const participant = (teamName: string): Participant => ({
  id: "participant-1",
  divisionId: "division-1",
  name: "홍길동",
  teamName,
  robotName: "로봇",
  comment: "",
  orderRaw: 1,
  createdAt: new Date(),
});

describe("formatTopRecords", () => {
  it("uses a fallback name when the participant cannot be found", () => {
    expect(formatTopRecords([record("missing-participant")], [])).toEqual([
      { id: "record-1", participantName: "Participant missing-", participantTeamName: "", timeMs: 12_340 },
    ]);
  });

  it("preserves an empty team name", () => {
    expect(formatTopRecords([record("participant-1")], [participant("")])[0]?.participantTeamName).toBe("");
  });

  it("returns an empty list for no records", () => {
    expect(formatTopRecords([], [participant("팀")])).toEqual([]);
  });
});
