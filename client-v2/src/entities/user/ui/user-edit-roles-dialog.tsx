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
} from "@/shared/ui";

import { getUserRoleLabel } from "../lib/format";
import { type User, type UserRole, type UserRolesForm,UserRolesFormSchema } from "../model";
import { userService } from "../model/user-service";

interface UserEditRolesDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleOptions: { role: UserRole; description: string }[] = [
  { role: "administrator", description: "대회·계정 전체 관리 권한" },
  { role: "manualRecorder", description: "수동 기록 입력 권한" },
  { role: "stopwatchRecorder", description: "계수기 단말 연동 권한" },
];

export function UserEditRolesDialog({ user, open, onOpenChange }: UserEditRolesDialogProps) {
  const form = useForm<UserRolesForm>({
    resolver: zodResolver(UserRolesFormSchema),
    defaultValues: { roles: user.roles },
  });
  const roles = form.watch("roles") ?? [];

  React.useEffect(() => {
    if (open) form.reset({ roles: user.roles });
  }, [form, open, user]);

  const toggleRole = (role: UserRole, checked: boolean) => {
    form.setValue("roles", checked ? [...roles, role] : roles.filter((item) => item !== role), { shouldValidate: true });
  };
  const onSubmit = async (value: UserRolesForm) => {
    try {
      await userService.admin.updateRoles(user.id, value.roles);
      onOpenChange(false);
    } catch {
      form.setError("root", { message: "사용자 권한을 저장하지 못했습니다. 다시 시도해주세요." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 권한 수정</DialogTitle>
          <DialogDescription><strong>{user.name}</strong> 님의 역할을 선택해주세요.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <div className="grid gap-2">
            {roleOptions.map(({ role, description }) => (
              <label key={role} className="flex cursor-pointer gap-3 rounded-lg border p-3.5 transition-colors hover:bg-muted/50">
                <input type="checkbox" checked={roles.includes(role)} onChange={(event) => toggleRole(role, event.target.checked)} />
                <span className="grid gap-0.5">
                  <span className="text-sm font-semibold">{getUserRoleLabel(role)}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </span>
              </label>
            ))}
          </div>
          {form.formState.errors.root ? <p className="text-sm text-destructive">{form.formState.errors.root.message}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "저장 중..." : "저장"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
