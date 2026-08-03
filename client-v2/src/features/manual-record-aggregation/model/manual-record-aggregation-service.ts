import { manualRecordService } from "@/entities/manual-record";
import { recordService } from "@/entities/record";

import { createManualRecordAggregationService } from "./service";

export const manualRecordAggregationService = createManualRecordAggregationService({
  manualRecordService,
  recordService,
});
