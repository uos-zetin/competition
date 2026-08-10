import type { LoaderFunctionArgs } from "react-router";

import { competitionService } from "@/entities/competition";
import { divisionService } from "@/entities/division";
import { participantService } from "@/entities/participant";
import { errorHandlingService } from "@/features/error-handling";

export async function adminParticipantsLoader({ request }: LoaderFunctionArgs): Promise<null> {
  try {
    await competitionService.load();

    const competitionId = new URL(request.url).searchParams.get("competitionId");
    if (!competitionId) return null;

    const divisions = await divisionService.load(competitionId);
    await Promise.all(divisions.map((division) => participantService.load(division.id)));
  } catch (error) {
    errorHandlingService.handle(error, "참가자 관리 화면을 불러오는데 실패했습니다");
  }

  return null;
}
