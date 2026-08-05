import type { CounterState } from "@/entities/counter";

export function getUnresolvedDivisionIds(counters: CounterState[], knownDivisionIds: Set<string>): string[] {
  return [...new Set(counters.flatMap((counter) => (counter.divisionId ? [counter.divisionId] : [])))].filter(
    (divisionId) => !knownDivisionIds.has(divisionId)
  );
}
