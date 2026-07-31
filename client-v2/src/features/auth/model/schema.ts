import { z } from "zod";

import type { LoginForm } from "./types";

export const LoginFormSchema = z.object({
  userName: z.string().trim().min(1, "사용자명을 입력해주세요").max(50, "사용자명은 50자를 초과할 수 없습니다"),
  password: z.string().min(1, "비밀번호를 입력해주세요").min(6, "비밀번호는 최소 6자입니다").max(100, "비밀번호는 100자를 초과할 수 없습니다"),
}) satisfies z.ZodType<LoginForm>;
