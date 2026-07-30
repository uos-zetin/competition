import { divisionRepository } from "../api";

import { createDivisionService } from "./service";

export const divisionService = createDivisionService({ divisionRepository });
