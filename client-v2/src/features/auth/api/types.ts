import type { LoginForm } from "../model/types";

export interface AuthRepository {
  login(form: LoginForm): Promise<string>;
  logout(): Promise<void>;
}
