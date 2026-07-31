import { authenticatedFetcher, publicFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { ManualRecordMockRepository } from "./repository.mock";
import { ManualRecordRestRepository } from "./repository.rest";
import type { ManualRecordRepository } from "./types";

export const manualRecordRepository: ManualRecordRepository = env.useMocks
  ? new ManualRecordMockRepository()
  : new ManualRecordRestRepository(publicFetcher, authenticatedFetcher);
