import { authenticatedFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { UserMockRepository } from "./repository.mock";
import { UserRestRepository } from "./repository.rest";
import type { UserRepository } from "./types";

export const userRepository: UserRepository = env.useMocks
  ? new UserMockRepository()
  : new UserRestRepository(authenticatedFetcher);
