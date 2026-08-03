import { describe, expect, it } from "vitest";

import type { ManualRecord } from "@/entities/manual-record";

import { aggregateManualRecords } from "../aggregate-manual-records";

function manualRecord(id: string, value: number): ManualRecord {
  return { id, participantId: "participant-1", value, recorderName: "심판", createdAt: new Date() };
}

describe("aggregateManualRecords", () => {
  it("returns null for an empty selection", () => {
    expect(aggregateManualRecords([])).toBeNull();
  });

  it("returns the only selected record as the median", () => {
    expect(aggregateManualRecords([manualRecord("one", 12_450)])).toMatchObject({
      value: 12_450,
      mode: "median",
      sortedValues: [12_450],
      contributingValues: [12_450],
      contributingRecordIds: ["one"],
    });
  });

  it("sorts odd selections and returns their median record", () => {
    expect(aggregateManualRecords([manualRecord("three", 13_100), manualRecord("one", 12_450), manualRecord("two", 12_800)])).toMatchObject({
      value: 12_800,
      mode: "median",
      sortedValues: [12_450, 12_800, 13_100],
      contributingRecordIds: ["two"],
    });
    expect(aggregateManualRecords([manualRecord("five", 50), manualRecord("one", 10), manualRecord("three", 30), manualRecord("four", 40), manualRecord("two", 20)])).toMatchObject({
      value: 30,
      contributingRecordIds: ["three"],
    });
  });

  it("averages the two middle records for even selections", () => {
    expect(aggregateManualRecords([manualRecord("two", 12_800), manualRecord("one", 12_450)])).toMatchObject({
      value: 12_625,
      mode: "average",
      contributingValues: [12_450, 12_800],
      contributingRecordIds: ["one", "two"],
    });
    expect(aggregateManualRecords([manualRecord("four", 40), manualRecord("one", 10), manualRecord("three", 30), manualRecord("two", 20)])).toMatchObject({
      value: 25,
      contributingRecordIds: ["two", "three"],
    });
  });

  it("uses stable ordering to identify contributing duplicate values", () => {
    expect(aggregateManualRecords([manualRecord("first", 10), manualRecord("second", 10), manualRecord("third", 20), manualRecord("fourth", 20)])).toMatchObject({
      value: 15,
      contributingRecordIds: ["second", "third"],
    });
  });
});
