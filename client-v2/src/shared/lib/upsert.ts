export function upsertSorted<T extends { id: string }>(items: T[], item: T, compare: (a: T, b: T) => number): T[] {
  const next = items.filter((existing) => existing.id !== item.id);
  next.push(item);
  next.sort(compare);
  return next;
}

export function removeById<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter((item) => item.id !== id);
}
