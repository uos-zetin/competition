import { ConfirmDialog } from "@/shared/ui";

import type { Competition } from "../model";
import { competitionService } from "../model/competition-service";

interface CompetitionDeleteDialogProps {
  competition: Competition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompetitionDeleteDialog({ competition, open, onOpenChange }: CompetitionDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="대회 삭제"
      description="대회를 삭제하면 되돌릴 수 없습니다."
      message={
        <>
          <strong>'{competition.name}'</strong> 대회를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </>
      }
      confirmLabel="삭제"
      variant="destructive"
      onConfirm={() => competitionService.admin.remove(competition.id)}
    />
  );
}
