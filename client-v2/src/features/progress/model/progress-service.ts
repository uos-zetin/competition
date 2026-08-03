import { progressChannel, progressRepository } from "../api";

import { createProgressService } from "./service";

export const progressService = createProgressService({ progressRepository, progressChannel });
