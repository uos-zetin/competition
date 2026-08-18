import { divisionService } from "@/entities/division";
import { participantService } from "@/entities/participant";

import { createParticipantPromotionService } from "./service";

export const participantPromotionService = createParticipantPromotionService({ divisionService, participantService });
