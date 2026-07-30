import { describe, expect, it } from "vitest";

import { ParticipantMockRepository } from "../repository.mock";

describe("ParticipantMockRepository", () => {
  it("creates a participant and scopes listing to its division", async () => {
    const repository = new ParticipantMockRepository();
    const participant = await repository.createParticipant({
      divisionId: "division-new",
      name: "새 참가자",
      teamName: "팀",
      robotName: "로봇",
      comment: "",
      orderRaw: 1,
    });
    expect(participant.id).not.toBe("");
    await expect(repository.getParticipantsByDivision("division-new")).resolves.toEqual([participant]);
  });

  it("updates and deletes only the requested participant", async () => {
    const repository = new ParticipantMockRepository();
    const [first, second] = await repository.getParticipantsByDivision("division-elementary");
    const updated = { ...first, name: "수정된 참가자" };
    await expect(repository.updateParticipant(updated)).resolves.toEqual(updated);
    await expect(repository.getParticipantById(first.id)).resolves.toEqual(updated);
    await repository.deleteParticipant(first.id);
    await expect(repository.getParticipantById(first.id)).resolves.toBeNull();
    await expect(repository.getParticipantById(second.id)).resolves.toEqual(second);
  });
});
