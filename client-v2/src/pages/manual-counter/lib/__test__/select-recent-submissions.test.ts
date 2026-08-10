import { describe, expect, it } from "vitest";

import type { ManualRecord } from "@/entities/manual-record";

import { selectRecentSubmissions } from "../select-recent-submissions";

const record = (id: string, createdAt: string): ManualRecord => ({
  id,
  participantId: "participant-1",
  value: 12_345,
  recorderName: "기록원",
  createdAt: new Date(createdAt),
});

describe("selectRecentSubmissions", () => {
  it("returns an empty list when nothing has been submitted", () => {
    expect(selectRecentSubmissions([], [])).toEqual([]);
    expect(selectRecentSubmissions([record("one", "2026-01-01")], [])).toEqual([]);
  });

  it("filters submitted records and sorts them newest first", () => {
    const oldest = record("oldest", "2026-01-01T09:00:00Z");
    const newest = record("newest", "2026-01-01T11:00:00Z");
    const middle = record("middle", "2026-01-01T10:00:00Z");

    expect(selectRecentSubmissions([middle, oldest, newest], ["oldest", "newest"])).toEqual([newest, oldest]);
  });

  it("ignores submitted ids that are not in the store yet", () => {
    const existing = record("existing", "2026-01-01");
    expect(selectRecentSubmissions([existing], ["missing", "existing"])).toEqual([existing]);
  });
});
