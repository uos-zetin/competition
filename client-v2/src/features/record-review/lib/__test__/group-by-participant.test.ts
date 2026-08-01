import { describe, expect, it } from "vitest";

import { groupRecordsByParticipant } from "../group-by-participant";

const participants = [
  {
    id: "participant-b",
    divisionId: "division-a",
    name: "B",
    teamName: "Team B",
    robotName: "Robot B",
    comment: "",
    orderRaw: 2,
    createdAt: new Date("2026-03-06T09:00:00"),
  },
  {
    id: "participant-a",
    divisionId: "division-a",
    name: "A",
    teamName: "Team A",
    robotName: "Robot A",
    comment: "",
    orderRaw: 1,
    createdAt: new Date("2026-03-06T09:00:00"),
  },
  {
    id: "participant-empty",
    divisionId: "division-a",
    name: "Empty",
    teamName: "",
    robotName: "",
    comment: "",
    orderRaw: 3,
    createdAt: new Date("2026-03-06T09:00:00"),
  },
];

const records = [
  {
    id: "record-a-approved",
    participantId: "participant-a",
    value: 63_410,
    source: "stopwatch" as const,
    status: "approved" as const,
    note: "",
    createdAt: new Date("2026-03-06T11:30:00"),
  },
  {
    id: "record-b",
    participantId: "participant-b",
    value: 55_000,
    source: "manual" as const,
    status: "pending" as const,
    note: "",
    createdAt: new Date("2026-03-06T11:31:00"),
  },
  {
    id: "record-a-rejected",
    participantId: "participant-a",
    value: 49_980,
    source: "stopwatch" as const,
    status: "rejected" as const,
    note: "",
    createdAt: new Date("2026-03-06T11:32:00"),
  },
  {
    id: "record-orphan",
    participantId: "unknown",
    value: 1,
    source: "other" as const,
    status: "pending" as const,
    note: "",
    createdAt: new Date("2026-03-06T11:33:00"),
  },
];

describe("groupRecordsByParticipant", () => {
  it("groups matching records and preserves participant input order", () => {
    const groups = groupRecordsByParticipant(records, participants);

    expect(groups.map((group) => group.participant.id)).toEqual(["participant-b", "participant-a"]);
    expect(groups[0].records).toEqual([records[1]]);
    expect(groups[1].records).toEqual([records[0], records[2]]);
  });

  it("uses the raw fastest record even when it was rejected", () => {
    const groups = groupRecordsByParticipant(records, participants);

    expect(groups.find((group) => group.participant.id === "participant-a")?.bestValue).toBe(49_980);
  });

  it("drops participants without records and records without a matching participant", () => {
    const groups = groupRecordsByParticipant(records, participants);

    expect(groups).toHaveLength(2);
    expect(groups.flatMap((group) => group.records).some((record) => record.id === "record-orphan")).toBe(false);
  });

  it("returns no groups when either input is empty", () => {
    expect(groupRecordsByParticipant([], participants)).toEqual([]);
    expect(groupRecordsByParticipant(records, [])).toEqual([]);
  });
});
