import type { Fetcher } from "@/shared/api";

import { parseLoginForm } from "../lib/parse-dto";
import type { LoginForm } from "../model/types";

import type { AuthRepository } from "./types";

export class AuthRestRepository implements AuthRepository {
  private readonly publicFetcher: Fetcher;
  private readonly authenticatedFetcher: Fetcher;

  constructor(
    publicFetcher: Fetcher,
    authenticatedFetcher: Fetcher
  ) {
    this.publicFetcher = publicFetcher;
    this.authenticatedFetcher = authenticatedFetcher;
  }

  async login(form: LoginForm): Promise<string> {
    const response = await this.publicFetcher.post<string>("/actors/login", { body: parseLoginForm(form) });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.authenticatedFetcher.post("/actors/logout");
  }
}
