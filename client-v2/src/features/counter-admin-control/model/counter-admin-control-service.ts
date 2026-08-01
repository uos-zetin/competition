import { competitionService } from "@/entities/competition";
import { counterService } from "@/entities/counter";
import { divisionService } from "@/entities/division";

import { createCounterAdminControlService } from "./service";

export const counterAdminControlService = createCounterAdminControlService({
  counterService,
  divisionService,
  competitionService,
});
