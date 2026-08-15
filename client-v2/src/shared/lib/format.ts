const koreanTimeZone = "Asia/Seoul";

export function formatCreatedAtLong(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeZone: koreanTimeZone }).format(date);
}

export function formatCreatedAtLongWithTime(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeStyle: "short", timeZone: koreanTimeZone }).format(date);
}

export function formatTimeShort(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", { timeStyle: "short", timeZone: koreanTimeZone }).format(date);
}

export function formatMsToClock(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = clamped % 1000;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
}

export function formatRelativeTimeKo(date: Date, now: Date = new Date()): string {
  const elapsedMs = Math.max(0, now.getTime() - date.getTime());
  const elapsedMinutes = Math.floor(elapsedMs / 60_000);

  if (elapsedMinutes < 1) return "방금";
  if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}시간 전`;

  return formatCreatedAtLong(date);
}
