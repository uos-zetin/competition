import { ConfirmDialog } from "@/shared/ui";

import type { Participant } from "../model";
import { participantService } from "../model/participant-service";

interface ParticipantDeleteDialogProps {
  participant: Participant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ParticipantDeleteDialog({ participant, open, onOpenChange }: ParticipantDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="참가자 삭제"
      description="참가자를 삭제하면 되돌릴 수 없습니다."
      message={
        <>
          <strong>'{participant.name}'</strong> 참가자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </>
      }
      confirmLabel="삭제"
      variant="destructive"
      onConfirm={() => participantService.admin.remove(participant.id)}
    />
  );
}
