import { competitionRepository } from "../api";

import { createCompetitionService } from "./service";

export const competitionService = createCompetitionService({ competitionRepository });
