import { z } from "zod";

import { type DivisionFormValues,MAX_TIME_LIMIT_SECONDS } from "./types";

export const DivisionFormSchema = z.object({
  name: z.string().trim().min(1, "부문명은 필수입니다").max(100, "부문명은 100자를 초과할 수 없습니다"),
  description: z.string().trim().max(1000, "설명은 1000자를 초과할 수 없습니다"),
  timeLimit: z
    .number()
    .int()
    .min(1, "제한 시간은 1초 이상이어야 합니다")
    .max(MAX_TIME_LIMIT_SECONDS, `제한 시간은 ${MAX_TIME_LIMIT_SECONDS}초(99분 59초)를 초과할 수 없습니다`),
}) satisfies z.ZodType<DivisionFormValues>;
