import { describe, expect, it } from "vitest";

import { parseUserCreateForm, parseUserDto } from "../parse-dto";

describe("user DTO parsers", () => {
  it("converts a DTO date to a domain value", () => {
    expect(
      parseUserDto({
        id: "user-1",
        name: "김재현",
        roles: ["administrator"],
        createdAt: "2026-03-02T00:00:00.000Z",
      })
    ).toEqual({
      id: "user-1",
      name: "김재현",
      roles: ["administrator"],
      createdAt: new Date("2026-03-02T00:00:00.000Z"),
    });
  });

  it("keeps form fields for a create DTO", () => {
    expect(parseUserCreateForm({ name: "김재현", username: "jaehyun", password: "secret1" })).toEqual({
      name: "김재현",
      username: "jaehyun",
      password: "secret1",
    });
  });
});
