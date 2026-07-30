import { describe, expect, it } from "vitest";

import { UserMockRepository } from "../repository.mock";

describe("UserMockRepository", () => {
  it("creates a user with an id and returns it from the list", async () => {
    const repository = new UserMockRepository();
    const created = await repository.createUser({ name: "새 사용자", username: "new-user", password: "secret1" });

    expect(created.id).not.toBe("");
    await expect(repository.getAllUsers()).resolves.toContainEqual(created);
  });

  it("updates roles and deletes only the requested user", async () => {
    const repository = new UserMockRepository();
    const [first, second] = await repository.getAllUsers();
    const updated = await repository.updateRoles(first.id, ["manualRecorder"]);

    expect(updated).toMatchObject({ ...first, roles: ["manualRecorder"] });
    await repository.deleteUser(first.id);
    await expect(repository.getAllUsers()).resolves.not.toContainEqual(expect.objectContaining({ id: first.id }));
    await expect(repository.getAllUsers()).resolves.toContainEqual(second);
  });

  it("returns the seeded current user", async () => {
    const repository = new UserMockRepository();

    await expect(repository.getCurrentUser()).resolves.toMatchObject({ id: "user-kim-jaehyun" });
  });
});
