import { authenticatedFetcher, publicFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { ParticipantMockRepository } from "./repository.mock";
import { ParticipantRestRepository } from "./repository.rest";
import type { ParticipantRepository } from "./types";

export const participantRepository: ParticipantRepository = env.useMocks
  ? new ParticipantMockRepository()
  : new ParticipantRestRepository(publicFetcher, authenticatedFetcher);
