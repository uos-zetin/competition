import { timerService } from "@/entities/timer";

import { createTimerControlService } from "./service";

export const timerControlService = createTimerControlService({ timerService });
