import { describe, expect, it } from "vitest";

import type { CounterState } from "@/entities/counter";

import { getUnresolvedDivisionIds } from "../get-unresolved-division-ids";

const counter = (divisionId: string | null): CounterState => ({
  id: crypto.randomUUID(),
  name: "계수기",
  startedAt: null,
  stoppedAt: null,
  divisionId,
});

describe("getUnresolvedDivisionIds", () => {
  it("returns an empty list when no counters need a division lookup", () => {
    expect(getUnresolvedDivisionIds([], new Set())).toEqual([]);
    expect(getUnresolvedDivisionIds([counter(null)], new Set())).toEqual([]);
    expect(getUnresolvedDivisionIds([counter("division-1")], new Set(["division-1"]))).toEqual([]);
  });

  it("deduplicates division ids that are not already known", () => {
    expect(
      getUnresolvedDivisionIds(
        [counter("division-1"), counter("division-2"), counter("division-1")],
        new Set(["known"])
      )
    ).toEqual(["division-1", "division-2"]);
  });
});
