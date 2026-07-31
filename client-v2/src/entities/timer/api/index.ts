import { authenticatedFetcher, publicFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { TimerMockRepository } from "./repository.mock";
import { TimerRestRepository } from "./repository.rest";
import type { TimerRepository } from "./types";

export const timerRepository: TimerRepository = env.useMocks
  ? new TimerMockRepository()
  : new TimerRestRepository(publicFetcher, authenticatedFetcher);
