import { authenticatedFetcher, publicFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { CompetitionMockRepository } from "./repository.mock";
import { CompetitionRestRepository } from "./repository.rest";
import type { CompetitionRepository } from "./types";

export const competitionRepository: CompetitionRepository = env.useMocks
  ? new CompetitionMockRepository()
  : new CompetitionRestRepository(publicFetcher, authenticatedFetcher);
