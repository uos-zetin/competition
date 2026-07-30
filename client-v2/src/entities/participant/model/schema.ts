import { z } from "zod";

import type { ParticipantForm } from "./types";

export const ParticipantFormSchema = z.object({
  divisionId: z.string().trim().min(1, "부문은 필수입니다"),
  name: z.string().trim().min(1, "참가자명은 필수입니다").max(100, "참가자명은 100자를 초과할 수 없습니다"),
  teamName: z.string().trim().min(1, "팀명은 필수입니다").max(100, "팀명은 100자를 초과할 수 없습니다"),
  robotName: z.string().trim().min(1, "로봇명은 필수입니다").max(100, "로봇명은 100자를 초과할 수 없습니다"),
  comment: z.string().trim().max(500, "코멘트는 500자를 초과할 수 없습니다"),
  orderRaw: z
    .number()
    .int("순서는 정수여야 합니다")
    .min(1, "순서는 1 이상이어야 합니다")
    .max(500, "순서는 500 이하여야 합니다"),
}) satisfies z.ZodType<ParticipantForm>;
