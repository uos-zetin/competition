import { recordRepository } from "../api";

import { createRecordService } from "./service";

export const recordService = createRecordService({ recordRepository });
