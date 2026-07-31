export function sortByCreatedAtDesc<T extends { createdAt: Date }>(left: T, right: T): number {
  return right.createdAt.getTime() - left.createdAt.getTime();
}

export function sortByCreatedAtAsc<T extends { createdAt: Date }>(left: T, right: T): number {
  return left.createdAt.getTime() - right.createdAt.getTime();
}
