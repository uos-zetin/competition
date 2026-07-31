import { describe, expect, it } from "vitest";

import { AuthenticationError } from "@/shared/api";

import { AuthMockRepository } from "../repository.mock";

describe("AuthMockRepository", () => {
  it.each(["kim.jaehyun", "lee.sua", "park.doyoon", "choi.eunbi"])("issues a mock session for %s", async (userName) => {
    const repository = new AuthMockRepository();

    await expect(repository.login({ userName, password: "password" })).resolves.toBeTruthy();
  });

  it("rejects unknown credentials with an authentication error", async () => {
    const repository = new AuthMockRepository();

    await expect(repository.login({ userName: "unknown", password: "password" })).rejects.toBeInstanceOf(AuthenticationError);
    await expect(repository.login({ userName: "kim.jaehyun", password: "wrong" })).rejects.toBeInstanceOf(AuthenticationError);
  });
});
