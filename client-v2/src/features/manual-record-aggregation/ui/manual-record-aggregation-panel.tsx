import { useMemo, useState } from "react";

import { Check, ClipboardList, LoaderCircle } from "lucide-react";

import { cn,formatMsToClock, formatRelativeTimeKo } from "@/shared/lib";
import { Button, ConfirmDialog } from "@/shared/ui";
import { manualRecordService } from "@/entities/manual-record";
// Error handling is the architecture's designated cross-cutting feature exception.
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-cross-slice-dependency
import { errorHandlingService } from "@/features/error-handling";

import { aggregateManualRecords } from "../lib/aggregate-manual-records";
import { manualRecordAggregationService } from "../model";

interface ManualRecordAggregationPanelProps {
  participantId: string;
}

export function ManualRecordAggregationPanel({ participantId }: ManualRecordAggregationPanelProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isRegistering, setIsRegistering] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const manualRecords = manualRecordAggregationService.use.byParticipant(participantId);
  const selectedRecords = useMemo(
    () => manualRecords.filter((manualRecord) => selectedIds.has(manualRecord.id)),
    [manualRecords, selectedIds]
  );
  const result = useMemo(() => aggregateManualRecords(selectedRecords), [selectedRecords]);

  const toggleRecord = (recordId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(recordId)) next.delete(recordId);
      else next.add(recordId);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.size === manualRecords.length ? new Set() : new Set(manualRecords.map((record) => record.id)));
  };

  const handleRegister = async () => {
    if (!result) return;

    setIsRegistering(true);
    try {
      await manualRecordAggregationService.register(participantId, result);
      setSelectedIds(new Set());
    } catch (error) {
      errorHandlingService.handle(error, "수동 계수 기록 등록에 실패했습니다");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClear = async () => {
    try {
      await manualRecordService.admin.clear(participantId);
      setSelectedIds(new Set());
    } catch (error) {
      errorHandlingService.handle(error, "수동 계수 기록 삭제에 실패했습니다");
    }
  };

  const allSelected = manualRecords.length > 0 && selectedIds.size === manualRecords.length;

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <ClipboardList className="size-4 text-muted-foreground" aria-hidden="true" />
          수동 계수 기록 취합
        </div>
        {manualRecords.length > 0 ? (
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="sm" disabled={isRegistering} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteConfirmOpen(true)}>
              기록 삭제
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={isRegistering} onClick={toggleAll}>
              {allSelected ? "모두 해제" : "모두 선택"}
            </Button>
          </div>
        ) : null}
      </header>
      {manualRecords.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-7 text-center text-muted-foreground">
          <ClipboardList className="size-7 opacity-55" aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">아직 수동 계수 기록이 없습니다</p>
          <p className="max-w-xs text-xs leading-5">계수기 또는 수동 계수 페이지에서 전송된 기록이 모이면 여기서 골라 취합할 수 있어요.</p>
        </div>
      ) : (
        <div className={cn("flex flex-col gap-3 p-4", isRegistering && "opacity-70")}>
          <div className="flex max-h-42 flex-col gap-1.5 overflow-y-auto pr-0.5">
            {manualRecords.map((manualRecord) => {
              const checked = selectedIds.has(manualRecord.id);
              const selected = checked;
              return (
                <label key={manualRecord.id} className={cn("flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5", selected && "border-blue-500/30 bg-blue-500/10", isRegistering && "cursor-not-allowed")}>
                  <span className="relative size-4 shrink-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isRegistering}
                      onChange={() => toggleRecord(manualRecord.id)}
                      className="size-4 appearance-none rounded-[5px] border-2 border-muted-foreground/50 bg-background checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                    />
                    {checked ? <Check className="pointer-events-none absolute inset-0 size-4 text-primary-foreground" strokeWidth={3} aria-hidden="true" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold tabular-nums">{formatMsToClock(manualRecord.value)}</span>
                    <span className="flex gap-1 text-[11px] text-muted-foreground">
                      {manualRecord.recorderName}<span className="text-border">·</span>{formatRelativeTimeKo(manualRecord.createdAt)}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {result ? (
            <div className="flex flex-col gap-2 border-t border-dashed pt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold tracking-wide text-muted-foreground">취합 결과</span>
                <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-bold", result.mode === "median" ? "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300")}>
                  {result.mode === "median" ? "중간값" : "평균값"}
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight tabular-nums">{formatMsToClock(result.value)}</p>
              <p className="rounded-md border bg-muted/50 px-2.5 py-2 text-xs leading-5 text-muted-foreground tabular-nums">
                <b className="font-sans text-foreground">정렬 {result.sortedValues.length}개</b> {result.sortedValues.map(formatMsToClock).join(" · ")} → {result.mode === "median" ? "가운데 값 사용" : `가운데 두 값 (${result.contributingValues.map(formatMsToClock).join(" + ")}) ÷ 2`}
              </p>
              <Button type="button" disabled={isRegistering} onClick={() => void handleRegister()}>
                {isRegistering ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
                {isRegistering ? "등록 중..." : "기록으로 등록"}
              </Button>
            </div>
          ) : (
            <p className="border-t border-dashed pt-3 text-center text-xs text-muted-foreground">취합할 기록을 선택하세요</p>
          )}
        </div>
      )}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        variant="destructive"
        title="수동 계수 기록 삭제"
        description="되돌릴 수 없습니다"
        message={`이 참가자의 수동 계수 기록 ${manualRecords.length}개를 모두 삭제합니다.`}
        confirmLabel="삭제"
        onConfirm={handleClear}
      />
    </section>
  );
}
