import { describe, expect, it } from "vitest";

import type { Record } from "../../model/types";
import { getApprovedRecordsSortedByValue } from "../selectors";

const record = (overrides: Partial<Record>): Record => ({
  id: "record-1",
  participantId: "participant-1",
  value: 50_000,
  source: "stopwatch",
  status: "approved",
  note: "",
  createdAt: new Date(),
  ...overrides,
});

describe("getApprovedRecordsSortedByValue", () => {
  it("keeps only approved records, sorted ascending by value", () => {
    const records = [
      record({ id: "a", status: "approved", value: 60_000 }),
      record({ id: "b", status: "pending", value: 10_000 }),
      record({ id: "c", status: "approved", value: 40_000 }),
      record({ id: "d", status: "rejected", value: 5_000 }),
    ];

    expect(getApprovedRecordsSortedByValue(records).map((item) => item.id)).toEqual(["c", "a"]);
  });

  it("does not mutate the input array", () => {
    const records = [record({ id: "a", value: 2 }), record({ id: "b", value: 1 })];
    const original = [...records];

    getApprovedRecordsSortedByValue(records);

    expect(records).toEqual(original);
  });
});
