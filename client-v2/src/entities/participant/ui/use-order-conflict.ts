import * as React from "react";

import { findOrderConflict } from "../lib/find-order-conflict";
import { participantService } from "../model/participant-service";
import type { Participant } from "../model/types";

export function useOrderConflict(params: {
  divisionId: string;
  orderRaw: number;
  excludeParticipantId?: string;
}): Participant | undefined {
  const { divisionId, orderRaw, excludeParticipantId } = params;
  const participants = participantService.use.participants();
  return React.useMemo(
    () => findOrderConflict(participants, { divisionId, orderRaw, excludeParticipantId }),
    [divisionId, excludeParticipantId, orderRaw, participants]
  );
}
