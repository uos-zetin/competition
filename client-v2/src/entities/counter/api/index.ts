import { authenticatedFetcher, sessionStore } from "@/shared/api";
import { env } from "@/shared/config/env";

import { CounterMockChannel } from "./channel.mock";
import { createCounterChannel } from "./channel.socket-io";
import { CounterMockRepository } from "./repository.mock";
import { CounterRestRepository } from "./repository.rest";
import type { CounterChannel, CounterRepository } from "./types";

export const counterRepository: CounterRepository = env.useMocks
  ? new CounterMockRepository()
  : new CounterRestRepository(authenticatedFetcher);

export const counterChannel: CounterChannel = env.useMocks
  ? new CounterMockChannel()
  : createCounterChannel(() => sessionStore.getSessionKey());
