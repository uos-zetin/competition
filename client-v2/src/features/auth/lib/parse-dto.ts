import type { LoginForm } from "../model/types";

export function parseLoginForm(form: LoginForm): { username: string; password: string } {
  return { username: form.userName, password: form.password };
}
