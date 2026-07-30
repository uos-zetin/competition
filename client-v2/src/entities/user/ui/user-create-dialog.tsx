import * as React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/shared/ui";

import { type UserCreateForm,UserCreateFormSchema } from "../model";
import { userService } from "../model/user-service";

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: UserCreateForm = { name: "", username: "", password: "" };

export function UserCreateDialog({ open, onOpenChange }: UserCreateDialogProps) {
  const form = useForm<UserCreateForm>({ resolver: zodResolver(UserCreateFormSchema), defaultValues });

  React.useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [form, open]);

  const onSubmit = async (value: UserCreateForm) => {
    try {
      await userService.admin.create(value);
      form.reset(defaultValues);
      onOpenChange(false);
    } catch {
      form.setError("root", { message: "사용자를 생성하지 못했습니다. 다시 시도해주세요." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 추가</DialogTitle>
          <DialogDescription>새로운 사용자를 추가해주세요.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <div className="grid gap-1.5">
            <Label htmlFor="user-name">이름 <span className="text-destructive">*</span></Label>
            <Input id="user-name" maxLength={100} placeholder="이름을 입력하세요" aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
            {form.formState.errors.name ? <p className="text-xs text-destructive">{form.formState.errors.name.message}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="user-username">사용자명 <span className="text-destructive">*</span></Label>
            <Input id="user-username" maxLength={50} placeholder="사용자명을 입력하세요" autoComplete="username" aria-invalid={Boolean(form.formState.errors.username)} {...form.register("username")} />
            {form.formState.errors.username ? <p className="text-xs text-destructive">{form.formState.errors.username.message}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="user-password">비밀번호 <span className="text-destructive">*</span></Label>
            <Input id="user-password" type="password" maxLength={100} placeholder="비밀번호를 입력하세요 (최소 6자)" autoComplete="new-password" aria-invalid={Boolean(form.formState.errors.password)} {...form.register("password")} />
            <p className="text-xs text-muted-foreground">최소 6자</p>
            {form.formState.errors.password ? <p className="text-xs text-destructive">{form.formState.errors.password.message}</p> : null}
          </div>
          {form.formState.errors.root ? <p className="text-sm text-destructive">{form.formState.errors.root.message}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "생성 중..." : "생성"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
