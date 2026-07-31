export function getElapsedMs(startedAt: number | null, stoppedAt: number | null): number {
  if (startedAt === null) return 0;
  return Math.max(0, (stoppedAt ?? Date.now()) - startedAt);
}

export function isRunning(startedAt: number | null, stoppedAt: number | null): boolean {
  return startedAt !== null && stoppedAt === null;
}
