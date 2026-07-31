import { authenticatedFetcher, publicFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { RecordMockRepository } from "./repository.mock";
import { RecordRestRepository } from "./repository.rest";
import type { RecordRepository } from "./types";

export const recordRepository: RecordRepository = env.useMocks
  ? new RecordMockRepository()
  : new RecordRestRepository(publicFetcher, authenticatedFetcher);
