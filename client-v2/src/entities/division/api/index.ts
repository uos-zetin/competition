import { authenticatedFetcher, publicFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { DivisionMockRepository } from "./repository.mock";
import { DivisionRestRepository } from "./repository.rest";
import type { DivisionRepository } from "./types";

export const divisionRepository: DivisionRepository = env.useMocks
  ? new DivisionMockRepository()
  : new DivisionRestRepository(publicFetcher, authenticatedFetcher);
