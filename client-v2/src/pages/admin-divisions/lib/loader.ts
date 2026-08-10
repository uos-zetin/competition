import type { LoaderFunction } from "react-router";

import { competitionService } from "@/entities/competition";
import { divisionService } from "@/entities/division";

export const adminDivisionsLoader: LoaderFunction = async ({ request }) => {
  await competitionService.load();

  const competitionId = new URL(request.url).searchParams.get("competitionId");
  if (competitionId) await divisionService.load(competitionId);

  return null;
};
