import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, Label } from "@/shared/ui";
import { type User } from "@/entities/user";

import { authService } from "../model/auth-service";
import { LoginFormSchema } from "../model/schema";
import type { LoginForm as LoginFormValue } from "../model/types";

interface LoginFormProps {
  onSuccess?: (user: User) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useForm<LoginFormValue>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { userName: "", password: "" },
  });

  const onSubmit = async (value: LoginFormValue): Promise<void> => {
    try {
      const user = await authService.auth.login(value);
      onSuccess?.(user);
    } catch {
      form.setError("root", { message: "사용자명 또는 비밀번호가 올바르지 않습니다." });
    }
  };

  return (
    <form className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
      <div className="mb-6 grid gap-1">
        <h1 className="text-xl font-bold">로그인</h1>
        <p className="text-sm text-muted-foreground">계수기 시스템에 로그인하세요</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="auth-user-name">사용자명</Label>
          <Input
            id="auth-user-name"
            placeholder="사용자명을 입력하세요"
            aria-invalid={Boolean(form.formState.errors.userName)}
            {...form.register("userName")}
          />
          {form.formState.errors.userName ? <p className="text-xs text-destructive">{form.formState.errors.userName.message}</p> : null}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="auth-password">비밀번호</Label>
          <Input
            id="auth-password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
          {form.formState.errors.password ? <p className="text-xs text-destructive">{form.formState.errors.password.message}</p> : null}
        </div>
        {form.formState.errors.root ? (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </div>
    </form>
  );
}
