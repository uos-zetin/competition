import { timerRepository } from "../api";

import { createTimerService } from "./service";

export const timerService = createTimerService({ timerRepository });
