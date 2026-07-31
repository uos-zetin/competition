import { counterChannel, counterRepository } from "../api";

import { createCounterService } from "./service";

export const counterService = createCounterService({ counterRepository, counterChannel });
