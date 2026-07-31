import { manualRecordRepository } from "../api";

import { createManualRecordService } from "./service";

export const manualRecordService = createManualRecordService({ manualRecordRepository });
