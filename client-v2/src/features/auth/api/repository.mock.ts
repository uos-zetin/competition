import { AuthenticationError } from "@/shared/api";

import type { LoginForm } from "../model/types";

import type { AuthRepository } from "./types";

const credentials = new Map([
  ["kim.jaehyun", "user-kim-jaehyun"],
  ["lee.sua", "user-lee-sua"],
  ["park.doyoon", "user-park-doyoon"],
  ["choi.eunbi", "user-choi-eunbi"],
]);

const mockPassword = "password";

export class AuthMockRepository implements AuthRepository {
  async login({ userName, password }: LoginForm): Promise<string> {
    const userId = credentials.get(userName);
    if (!userId || password !== mockPassword) {
      throw new AuthenticationError("사용자명 또는 비밀번호가 올바르지 않습니다.");
    }
    return `mock-session-${userId}`;
  }

  async logout(): Promise<void> {}
}
