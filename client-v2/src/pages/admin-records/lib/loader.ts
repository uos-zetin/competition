import type { LoaderFunctionArgs } from "react-router";

import { competitionService } from "@/entities/competition";
import { divisionService } from "@/entities/division";
import { participantService } from "@/entities/participant";
import { recordService } from "@/entities/record";

export async function adminRecordsLoader({ request }: LoaderFunctionArgs): Promise<null> {
  await competitionService.load();

  const competitionId = new URL(request.url).searchParams.get("competitionId");
  if (!competitionId) return null;

  const divisions = await divisionService.load(competitionId);
  const participantLists = await Promise.all(divisions.map((division) => participantService.load(division.id)));
  const participants = participantLists.flat();
  await Promise.all(participants.map((participant) => recordService.load.byParticipant(participant.id)));

  return null;
}
