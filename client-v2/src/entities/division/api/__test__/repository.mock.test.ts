import { describe, expect, it } from "vitest";

import { DivisionMockRepository } from "../repository.mock";

describe("DivisionMockRepository", () => {
  it("creates a division with an id and returns it for its competition", async () => {
    const repository = new DivisionMockRepository();
    const created = await repository.createDivision("competition-2026-spring", {
      name: "새 부문",
      description: "설명",
      timeLimit: 90,
    });
    expect(created.id).not.toBe("");
    await expect(repository.getAllDivisions(created.competitionId)).resolves.toContainEqual(created);
  });

  it("updates and deletes only the requested division", async () => {
    const repository = new DivisionMockRepository();
    const [first, second] = await repository.getAllDivisions("competition-2026-spring");
    const updated = { ...first, name: "수정된 부문" };
    await expect(repository.updateDivision(updated)).resolves.toEqual(updated);
    await expect(repository.getDivisionById(first.id)).resolves.toEqual(updated);
    await repository.deleteDivision(first.id);
    await expect(repository.getDivisionById(first.id)).resolves.toBeNull();
    await expect(repository.getDivisionById(second.id)).resolves.toEqual(second);
  });

  it("returns null when the division does not exist", async () => {
    const repository = new DivisionMockRepository();
    await expect(repository.getDivisionById("missing")).resolves.toBeNull();
  });
});
