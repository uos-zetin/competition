let authExpiredHandler: () => void = () => undefined;

export function setAuthExpiredHandler(handler: () => void): void {
  authExpiredHandler = handler;
}

export function runAuthExpiredHandler(): void {
  authExpiredHandler();
}
