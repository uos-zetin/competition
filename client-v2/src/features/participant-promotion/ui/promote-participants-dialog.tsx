import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/ui";
import { DivisionFormSchema, type DivisionFormValues, divisionService, formatTimeLimit } from "@/entities/division";
import { participantService } from "@/entities/participant";

import { type ItemOutcome, participantPromotionService, type PromotionResult } from "../model";

type Props = { competitionId: string; open: boolean; onOpenChange: (open: boolean) => void };
type Step = "source" | "order" | "division" | "processing" | "result";

function outcomeLabel(outcome: ItemOutcome<unknown>) {
  return outcome.status === "success" ? "생성 완료" : outcome.status === "failed" ? "실패" : "건너뜀";
}

function outcomeError(outcome: ItemOutcome<unknown>) {
  return outcome.status === "failed" ? outcome.error : outcome.status === "skipped" ? outcome.reason : "";
}

function getOrderError(participantId: string, order: Record<string, number>, selectedIds: string[]) {
  const value = order[participantId];
  if (!Number.isInteger(value) || value < 1 || value > 500) return "순서는 1 이상 500 이하여야 합니다.";
  return selectedIds.filter((id) => order[id] === value).length > 1
    ? "같은 순서를 두 명에게 지정할 수 없습니다."
    : undefined;
}

export function PromoteParticipantsDialog({ competitionId, open, onOpenChange }: Props) {
  const divisions = divisionService.use.divisionsByCompetition(competitionId);
  const [step, setStep] = useState<Step>("source");
  const [sourceDivisionId, setSourceDivisionId] = useState("");
  const sourceDivision = divisions.find((division) => division.id === sourceDivisionId);
  const participants = participantService.use.byDivision(sourceDivisionId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [order, setOrder] = useState<Record<string, number>>({});
  const [result, setResult] = useState<PromotionResult>();
  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(DivisionFormSchema),
    defaultValues: { name: "", description: "", timeLimit: 90 },
  });

  const reset = () => {
    setStep("source");
    setSourceDivisionId("");
    setSelectedIds([]);
    setOrder({});
    setResult(undefined);
    form.reset({ name: "", description: "", timeLimit: 90 });
  };
  const close = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  useEffect(() => {
    if (!open || !sourceDivisionId) return;
    void participantService.load(sourceDivisionId);
  }, [open, sourceDivisionId]);

  const selectSourceDivision = (id: string) => {
    setSourceDivisionId(id);
    setSelectedIds([]);
    setOrder({});
  };
  const toggleParticipant = (participantId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...current, participantId] : current.filter((currentId) => currentId !== participantId)
    );
  };
  const selectAll = (checked: boolean) =>
    setSelectedIds(checked ? participants.map((participant) => participant.id) : []);
  const selectedParticipants = participants
    .filter((participant) => selectedIds.includes(participant.id))
    .sort((a, b) => a.orderRaw - b.orderRaw);
  const hasOrderErrors = selectedParticipants.some((participant) => getOrderError(participant.id, order, selectedIds));
  const beginOrderStep = () => {
    if (!sourceDivision || selectedIds.length === 0) return;
    setOrder(Object.fromEntries(selectedParticipants.map((participant, index) => [participant.id, index + 1])));
    setStep("order");
  };
  const beginDivisionForm = () => {
    if (!sourceDivision || hasOrderErrors) return;
    form.reset({ name: "", description: "", timeLimit: sourceDivision.timeLimit });
    setStep("division");
  };
  const submit = async (newDivision: DivisionFormValues) => {
    if (selectedParticipants.length === 0 || hasOrderErrors) {
      setStep("source");
      return;
    }
    const sourceParticipants = selectedParticipants.map((participant) => ({
      participant,
      orderRaw: order[participant.id],
    }));
    setStep("processing");
    setResult(await participantPromotionService.run({ competitionId, newDivision, sourceParticipants }));
    setStep("result");
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>기존 참가자로 새 부문 만들기</DialogTitle>
          <DialogDescription>소스 부문 · 참가자 선택 · 순서 지정 · 새 부문 정보 · 결과</DialogDescription>
        </DialogHeader>
        {step === "source" && (
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="promotion-source-division">소스 부문</Label>
              <Select value={sourceDivisionId} onValueChange={selectSourceDivision}>
                <SelectTrigger id="promotion-source-division">
                  <SelectValue placeholder="참가자를 선택할 부문을 고르세요" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division.id} value={division.id}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {sourceDivisionId && (
              <div className="space-y-2 rounded-lg border p-3">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Checkbox
                    checked={participants.length > 0 && selectedIds.length === participants.length}
                    onCheckedChange={(checked) => selectAll(checked === true)}
                  />
                  전체 선택 ({selectedIds.length}/{participants.length})
                </label>
                {participants.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">이 부문에 등록된 참가자가 없습니다.</p>
                ) : (
                  <ul className="divide-y rounded-md border">
                    {participants.map((participant) => (
                      <li key={participant.id}>
                        <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm">
                          <Checkbox
                            checked={selectedIds.includes(participant.id)}
                            onCheckedChange={(checked) => toggleParticipant(participant.id, checked === true)}
                          />
                          <span className="min-w-0 flex-1">
                            <b>
                              {participant.orderRaw}. {participant.name}
                            </b>{" "}
                            <span className="text-muted-foreground">
                              · {participant.teamName} · {participant.robotName}
                            </span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => close(false)}>
                취소
              </Button>
              <Button type="button" disabled={!sourceDivisionId || selectedIds.length === 0} onClick={beginOrderStep}>
                다음
              </Button>
            </DialogFooter>
          </div>
        )}
        {step === "order" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">새 부문에서 사용할 참가 순서를 지정하세요.</p>
            <ul className="divide-y rounded-md border">
              {[...selectedParticipants]
                .sort((a, b) => order[a.id] - order[b.id])
                .map((participant) => {
                  const error = getOrderError(participant.id, order, selectedIds);
                  return (
                    <li key={participant.id} className="grid grid-cols-[1fr_6rem] items-center gap-3 px-3 py-2.5">
                      <div className="min-w-0 text-sm">
                        <p className="truncate font-semibold">{participant.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {participant.teamName} · {participant.robotName}
                        </p>
                      </div>
                      <div className="grid gap-1">
                        <Input
                          id={`promotion-order-${participant.id}`}
                          type="number"
                          min={1}
                          max={500}
                          value={order[participant.id]}
                          aria-label="순서"
                          aria-invalid={Boolean(error)}
                          onChange={(event) =>
                            setOrder((current) => ({ ...current, [participant.id]: Number(event.target.value) }))
                          }
                        />
                        {error && <p className="text-xs text-destructive">{error}</p>}
                      </div>
                    </li>
                  );
                })}
            </ul>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep("source")}>
                이전
              </Button>
              <Button type="button" disabled={hasOrderErrors} onClick={beginDivisionForm}>
                다음
              </Button>
            </DialogFooter>
          </div>
        )}
        {step === "division" && sourceDivision && (
          <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(submit)(event)}>
            <p className="rounded-md bg-muted p-3 text-sm">
              <b>{sourceDivision.name}</b>에서 선택한 참가자 {selectedIds.length}명을 복사합니다. 원래 부문의 참가자와
              기록은 그대로 유지됩니다.
            </p>
            <div className="grid gap-1.5">
              <Label htmlFor="promotion-division-name">
                새 부문명 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="promotion-division-name"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="promotion-division-description">설명 (선택사항)</Label>
              <Textarea
                id="promotion-division-description"
                maxLength={1000}
                aria-invalid={Boolean(form.formState.errors.description)}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="promotion-division-time-limit">
                제한시간 (초) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="promotion-division-time-limit"
                type="number"
                min={1}
                max={5999}
                aria-invalid={Boolean(form.formState.errors.timeLimit)}
                {...form.register("timeLimit", { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                소스 부문의 제한시간({formatTimeLimit(sourceDivision.timeLimit)})으로 미리 채웠습니다.
              </p>
              {form.formState.errors.timeLimit && (
                <p className="text-xs text-destructive">{form.formState.errors.timeLimit.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep("order")}>
                이전
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                새 부문 만들기
              </Button>
            </DialogFooter>
          </form>
        )}
        {step === "processing" && (
          <div className="space-y-3 py-6 text-center text-sm text-muted-foreground">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
            </div>
            새 부문과 참가자를 만들고 있습니다.
          </div>
        )}
        {step === "result" && result && (
          <div className="space-y-4 text-sm">
            <p className="font-semibold">처리 결과</p>
            <p>
              부문: {outcomeLabel(result.division)} · 참가자:{" "}
              {result.participants.filter((item) => item.outcome.status === "success").length}/
              {result.participants.length}명 생성
            </p>
            {result.division.status !== "success" && (
              <p className="text-destructive">{outcomeError(result.division)}</p>
            )}
            <ul className="divide-y rounded-md border">
              {result.participants.map(({ source, outcome }) => (
                <li key={source.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span>{source.name}</span>
                  <span className={outcome.status === "success" ? "text-emerald-700" : "text-destructive"}>
                    {outcomeLabel(outcome)}
                    {outcome.status !== "success" ? ` · ${outcomeError(outcome)}` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <DialogFooter>
              <Button type="button" onClick={() => close(false)}>
                닫기
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
