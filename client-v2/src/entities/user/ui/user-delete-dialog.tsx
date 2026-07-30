import { ConfirmDialog } from "@/shared/ui";

import type { User } from "../model";
import { userService } from "../model/user-service";

interface UserDeleteDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDeleteDialog({ user, open, onOpenChange }: UserDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="사용자 삭제"
      description="선택한 사용자를 영구적으로 삭제합니다."
      message={<><strong>'{user.name}'</strong> 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</>}
      confirmLabel="삭제"
      variant="destructive"
      onConfirm={() => userService.admin.remove(user.id)}
    />
  );
}
