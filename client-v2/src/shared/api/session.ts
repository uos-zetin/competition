export interface SessionProvider {
  getSessionKey(): string | null;
}

class SessionStore {
  private provider: SessionProvider | null = null;

  setSessionProvider(provider: SessionProvider): void {
    this.provider = provider;
  }

  getSessionKey(): string | null {
    return this.provider?.getSessionKey() ?? null;
  }
}

export const sessionStore = new SessionStore();
