import { describe, expect, it } from "vitest";

import { formatCreatedAtLong, formatCreatedAtLongWithTime, formatRelativeTimeKo, formatTimeShort } from "../format";

describe("formatRelativeTimeKo", () => {
  const now = new Date("2026-08-03T12:00:00+09:00");

  it("formats recent dates in the mockup's relative-time buckets", () => {
    expect(formatRelativeTimeKo(new Date("2026-08-03T11:59:01+09:00"), now)).toBe("방금");
    expect(formatRelativeTimeKo(new Date("2026-08-03T11:57:00+09:00"), now)).toBe("3분 전");
    expect(formatRelativeTimeKo(new Date("2026-08-03T10:00:00+09:00"), now)).toBe("2시간 전");
  });

  it("uses the long-date format after one day", () => {
    const date = new Date("2026-08-02T12:00:00+09:00");

    expect(formatRelativeTimeKo(date, now)).toBe(formatCreatedAtLong(date));
  });
});

describe("Korean time formatters", () => {
  const date = new Date("2026-08-03T12:34:00+09:00");

  it("pins date and time output to Asia/Seoul", () => {
    expect(formatCreatedAtLong(date)).toBe(new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeZone: "Asia/Seoul" }).format(date));
    expect(formatCreatedAtLongWithTime(date)).toBe(new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Seoul" }).format(date));
    expect(formatTimeShort(date)).toBe(new Intl.DateTimeFormat("ko-KR", { timeStyle: "short", timeZone: "Asia/Seoul" }).format(date));
  });
});
