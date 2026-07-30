import { ConfirmDialog } from "@/shared/ui";

import type { Division } from "../model";
import { divisionService } from "../model/division-service";

interface DivisionDeleteDialogProps {
  division: Division;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DivisionDeleteDialog({ division, open, onOpenChange }: DivisionDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="부문 삭제"
      description="부문을 삭제하면 되돌릴 수 없습니다."
      message={
        <>
          <strong>'{division.name}'</strong> 부문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </>
      }
      confirmLabel="삭제"
      variant="destructive"
      onConfirm={() => divisionService.admin.remove(division.id)}
    />
  );
}
