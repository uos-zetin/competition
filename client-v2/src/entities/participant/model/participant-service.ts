import { participantRepository } from "../api";

import { createParticipantService } from "./service";

export const participantService = createParticipantService({ participantRepository });
