import { type KeyboardEvent,useState } from "react";

import { PenLine } from "lucide-react";

import { cn,formatMsToClock } from "@/shared/lib";
import { Button, Textarea } from "@/shared/ui";
import { getRecordStatusLabel, type Record as RecordEntity, recordService, RecordSourceBadge, type RecordStatus,RecordStatusBadge } from "@/entities/record";
// Error handling is the architecture's designated cross-cutting feature exception.
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-cross-slice-dependency
import { errorHandlingService } from "@/features/error-handling/model";

interface RecordReviewCardProps {
  record: RecordEntity;
  participantName?: string;
}

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeStyle: "short" });

const selectedStatusClassNames: Record<RecordStatus, string> = {
  pending: "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  rejected: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

const statusOptions: RecordStatus[] = [
  "pending",
  "approved",
  "rejected",
];

export function RecordReviewCard({ record, participantName }: RecordReviewCardProps) {
  const [activePanel, setActivePanel] = useState<"note" | "status" | null>(null);
  const [noteDraft, setNoteDraft] = useState(record.note);
  const [isMutating, setIsMutating] = useState(false);

  const isPending = record.status === "pending";

  const closeNotePanel = () => {
    setNoteDraft(record.note);
    setActivePanel(null);
  };

  const toggleNotePanel = () => {
    if (activePanel === "note") {
      closeNotePanel();
      return;
    }

    setNoteDraft(record.note);
    setActivePanel("note");
  };

  const updateStatus = async (status: RecordStatus, context: string) => {
    if (status === record.status) return;

    setIsMutating(true);
    try {
      await recordService.admin.updateStatus(record.id, status);
    } catch (error) {
      errorHandlingService.handle(error, context);
    } finally {
      setIsMutating(false);
    }
  };

  const saveNote = async () => {
    setIsMutating(true);
    try {
      await recordService.admin.updateNote(record.id, noteDraft);
      setActivePanel(null);
    } catch (error) {
      errorHandlingService.handle(error, "메모 저장에 실패했습니다");
    } finally {
      setIsMutating(false);
    }
  };

  const handleNoteKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void saveNote();
    }
    if (event.key === "Escape") closeNotePanel();
  };

  const actionRow = isPending ? (
    <div className="flex gap-2">
      <Button type="button" variant="success" size="sm" className="flex-1" disabled={isMutating} onClick={() => void updateStatus("approved", "기록 승인에 실패했습니다")}>
        승인
      </Button>
      <Button type="button" variant="outline" size="sm" className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10" disabled={isMutating} onClick={() => void updateStatus("rejected", "기록 거부에 실패했습니다")}>
        거부
      </Button>
      <Button type="button" variant="ghost" size="icon" aria-label="메모 편집" disabled={isMutating} onClick={toggleNotePanel}>
        <PenLine aria-hidden="true" />
      </Button>
    </div>
  ) : (
    <div className="flex gap-1 rounded-md bg-muted/50 p-1">
      <Button type="button" variant="ghost" size="sm" className={cn("flex-1", activePanel === "note" && "bg-background shadow-xs")} disabled={isMutating} onClick={toggleNotePanel}>
        메모
      </Button>
      <Button type="button" variant="ghost" size="sm" className={cn("flex-1", activePanel === "status" && "bg-background shadow-xs")} disabled={isMutating} onClick={() => setActivePanel(activePanel === "status" ? null : "status")}>
        상태 변경
      </Button>
    </div>
  );

  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-card p-3">
      {participantName ? <p className="text-xs font-semibold">{participantName}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-lg font-bold tracking-tight">{formatMsToClock(record.value)}</span>
        <div className="flex items-center gap-1.5">
          <RecordStatusBadge status={record.status} />
          <RecordSourceBadge source={record.source} />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-1.5 text-xs text-muted-foreground">
        <span>{dateTimeFormatter.format(record.createdAt)}</span>
        {record.note ? <><span aria-hidden="true">·</span><span>{record.note}</span></> : null}
      </div>
      {(!isPending || activePanel === null) ? actionRow : null}
      {activePanel === "note" ? (
        <div className="flex flex-col gap-2 border-t pt-3">
          <label className="text-xs font-semibold" htmlFor={`record-note-${record.id}`}>메모</label>
          <Textarea id={`record-note-${record.id}`} value={noteDraft} disabled={isMutating} onChange={(event) => setNoteDraft(event.target.value)} onKeyDown={handleNoteKeyDown} />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">Ctrl+Enter 저장 · Esc 취소</span>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" disabled={isMutating} onClick={closeNotePanel}>취소</Button>
              <Button type="button" size="sm" disabled={isMutating} onClick={() => void saveNote()}>저장</Button>
            </div>
          </div>
        </div>
      ) : null}
      {activePanel === "status" ? (
        <div className="flex flex-col gap-2 border-t pt-3">
          <p className="text-xs font-semibold">상태 변경</p>
          <div className="flex gap-1">
            {statusOptions.map((status) => (
              <Button key={status} type="button" variant="outline" size="sm" className={cn("flex-1", status === record.status && selectedStatusClassNames[status])} disabled={isMutating} onClick={() => void updateStatus(status, "기록 상태 변경에 실패했습니다")}>
                {getRecordStatusLabel(status)}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
