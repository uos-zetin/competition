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
    await expect(repository.getParticipantsByDivision(first.divisionId)).resolves.toEqual([updated, second]);
    await repository.deleteParticipant(first.id);
    await expect(repository.getParticipantsByDivision(first.divisionId)).resolves.toEqual([second]);
  });

  it("creates participants in the requested division", async () => {
    const repository = new ParticipantMockRepository();
    const participants = await repository.createParticipants("division-new", [
      { divisionId: "ignored", name: "첫째", teamName: "팀", robotName: "로봇", comment: "", orderRaw: 1 },
      { divisionId: "ignored", name: "둘째", teamName: "팀", robotName: "로봇", comment: "", orderRaw: 2 },
    ]);

    expect(participants).toHaveLength(2);
    expect(participants.every((participant) => participant.divisionId === "division-new")).toBe(true);
    await expect(repository.getParticipantsByDivision("division-new")).resolves.toEqual(participants);
  });
});
