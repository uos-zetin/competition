import { competitionService } from "@/entities/competition";
import { divisionService } from "@/entities/division";
import { participantService } from "@/entities/participant";

import { createCsvImportService } from "./service";

export const csvImportService = createCsvImportService({ competitionService, divisionService, participantService });
