import { authenticatedFetcher, publicFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { AuthMockRepository } from "./repository.mock";
import { AuthRestRepository } from "./repository.rest";
import type { AuthRepository } from "./types";

export const authRepository: AuthRepository = env.useMocks
  ? new AuthMockRepository()
  : new AuthRestRepository(publicFetcher, authenticatedFetcher);
