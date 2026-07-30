import { describe, expect, it } from "vitest";

import { findOrderConflict } from "../find-order-conflict";

const participants = [
  {
    id: "one",
    divisionId: "division-a",
    name: "A",
    teamName: "A",
    robotName: "A",
    comment: "",
    orderRaw: 1,
    createdAt: new Date(),
  },
  {
    id: "two",
    divisionId: "division-b",
    name: "B",
    teamName: "B",
    robotName: "B",
    comment: "",
    orderRaw: 1,
    createdAt: new Date(),
  },
];

describe("findOrderConflict", () => {
  it("returns no conflict for another division or order", () => {
    expect(findOrderConflict(participants, { divisionId: "division-a", orderRaw: 2 })).toBeUndefined();
    expect(findOrderConflict(participants, { divisionId: "division-c", orderRaw: 1 })).toBeUndefined();
  });

  it("finds a participant using the same order within a division", () => {
    expect(findOrderConflict(participants, { divisionId: "division-a", orderRaw: 1 })).toEqual(participants[0]);
  });

  it("excludes the participant currently being edited", () => {
    expect(
      findOrderConflict(participants, { divisionId: "division-a", orderRaw: 1, excludeParticipantId: "one" })
    ).toBeUndefined();
  });
});
