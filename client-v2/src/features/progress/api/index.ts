import { authenticatedFetcher } from "@/shared/api";
import { env } from "@/shared/config/env";

import { ProgressMockChannel } from "./channel.mock";
import { createProgressChannel } from "./channel.socket-io";
import { ProgressMockRepository } from "./repository.mock";
import { ProgressRestRepository } from "./repository.rest";
import type { ProgressChannel, ProgressRepository } from "./types";

export const progressRepository: ProgressRepository = env.useMocks ? new ProgressMockRepository() : new ProgressRestRepository(authenticatedFetcher);
export const progressChannel: ProgressChannel = env.useMocks ? new ProgressMockChannel() : createProgressChannel();
