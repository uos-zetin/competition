import { z } from "zod";

import type { UserCreateForm, UserRolesForm } from "./types";

const UserRoleSchema = z.enum(["administrator", "manualRecorder", "stopwatchRecorder"]);

export const UserCreateFormSchema = z.object({
  name: z.string().trim().min(1, "이름은 필수입니다").max(100, "이름은 100자를 초과할 수 없습니다"),
  username: z.string().trim().min(1, "사용자명은 필수입니다").max(50, "사용자명은 50자를 초과할 수 없습니다"),
  password: z.string().min(6, "비밀번호는 최소 6자입니다").max(100, "비밀번호는 100자를 초과할 수 없습니다"),
}) satisfies z.ZodType<UserCreateForm>;

export const UserRolesFormSchema = z.object({
  roles: z.array(UserRoleSchema),
}) satisfies z.ZodType<UserRolesForm>;
