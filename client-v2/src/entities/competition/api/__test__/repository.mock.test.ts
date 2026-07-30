import { describe, expect, it } from "vitest";

import { CompetitionMockRepository } from "../repository.mock";

describe("CompetitionMockRepository", () => {
  it("creates a competition with an id and returns it from the collection", async () => {
    const repository = new CompetitionMockRepository();
    const created = await repository.createCompetition({ name: "새 대회", description: "설명" });
    expect(created.id).not.toBe("");
    await expect(repository.getAllCompetitions()).resolves.toContainEqual(created);
  });

  it("updates and deletes only the requested competition", async () => {
    const repository = new CompetitionMockRepository();
    const [first, second] = await repository.getAllCompetitions();
    const updated = { ...first, name: "수정된 대회" };
    await expect(repository.updateCompetition(updated)).resolves.toEqual(updated);
    await expect(repository.getCompetitionById(first.id)).resolves.toEqual(updated);
    await repository.deleteCompetition(first.id);
    await expect(repository.getCompetitionById(first.id)).resolves.toBeNull();
    await expect(repository.getCompetitionById(second.id)).resolves.toEqual(second);
  });

  it("returns null when the competition does not exist", async () => {
    const repository = new CompetitionMockRepository();
    await expect(repository.getCompetitionById("missing")).resolves.toBeNull();
  });
});
