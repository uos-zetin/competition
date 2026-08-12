import { describe, expect, it } from "vitest";

import type { Participant } from "@/entities/participant";
import type { Record } from "@/entities/record";

import { formatTopRecords } from "../format-top-records";

const participant = (overrides: Partial<Participant> = {}): Participant => ({
  id: "participant-1",
  divisionId: "division-1",
  name: "홍길동",
  teamName: "로보틱스",
  robotName: "라인러너",
  comment: "",
  orderRaw: 1,
  createdAt: new Date(),
  ...overrides,
});

const record = (overrides: Partial<Record> = {}): Record => ({
  id: "record-1",
  participantId: "participant-1",
  value: 12_340,
  source: "stopwatch",
  status: "approved",
  note: "",
  createdAt: new Date(),
  ...overrides,
});

describe("formatTopRecords", () => {
  it("excludes records whose participant is not in the supplied list", () => {
    expect(formatTopRecords([record({ participantId: "missing" })], [], "mini")).toEqual([]);
  });

  it("sorts records by value and assigns ranks", () => {
    const participants = [participant(), participant({ id: "participant-2", name: "김철수" })];
    const records = [record({ value: 20_000 }), record({ id: "record-2", participantId: "participant-2", value: 10_000 })];

    expect(formatTopRecords(records, participants, "mini")).toEqual([
      { rank: 1, participantId: "participant-2", name: "김철수", teamMeta: "로보틱스", valueMs: 10_000 },
      { rank: 2, participantId: "participant-1", name: "홍길동", teamMeta: "로보틱스", valueMs: 20_000 },
    ]);
  });

  it("uses the individual-participant fallback and omits an empty robot name in full rows", () => {
    const rows = formatTopRecords([record()], [participant({ teamName: "", robotName: "" })], "full");

    expect(rows[0]?.teamMeta).toBe("개인 참가");
  });
});
