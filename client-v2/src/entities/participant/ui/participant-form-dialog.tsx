import * as React from "react";
import { type DefaultValues, useForm, type UseFormReturn } from "react-hook-form";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/ui";

import { type DivisionOption, type Participant, type ParticipantForm, ParticipantFormSchema } from "../model";
import { participantService } from "../model/participant-service";

import { useOrderConflict } from "./use-order-conflict";

interface ParticipantFormDialogProps {
  divisions: DivisionOption[];
  participant?: Participant;
  defaultDivisionId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getDefaultValues(participant?: Participant, defaultDivisionId?: string): DefaultValues<ParticipantForm> {
  return participant
    ? {
        divisionId: participant.divisionId,
        name: participant.name,
        teamName: participant.teamName,
        robotName: participant.robotName,
        comment: participant.comment,
        orderRaw: participant.orderRaw,
      }
    : { divisionId: defaultDivisionId ?? "", name: "", teamName: "", robotName: "", comment: "", orderRaw: undefined };
}

function ParticipantFormFields({
  form,
  divisions,
  divisionDisabled,
}: {
  form: UseFormReturn<ParticipantForm>;
  divisions: DivisionOption[];
  divisionDisabled: boolean;
}) {
  const errors = form.formState.errors;
  const comment = form.watch("comment") ?? "";
  const fieldError = (message?: string) => (message ? <p className="text-xs text-destructive">{message}</p> : null);

  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="participant-division">
          부문 <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.watch("divisionId")}
          disabled={divisionDisabled}
          onValueChange={(divisionId) => void form.setValue("divisionId", divisionId, { shouldValidate: true })}
        >
          <SelectTrigger id="participant-division" aria-invalid={Boolean(errors.divisionId)}>
            <SelectValue placeholder="부문을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((division) => (
              <SelectItem key={division.id} value={division.id}>
                {division.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldError(errors.divisionId?.message)}
      </div>
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <div className="grid gap-1.5">
          <Label htmlFor="participant-name">
            참가자명 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="participant-name"
            placeholder="참가자명을 입력하세요"
            aria-invalid={Boolean(errors.name)}
            {...form.register("name")}
          />
          {fieldError(errors.name?.message)}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="participant-order">
            순서 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="participant-order"
            type="number"
            min={1}
            max={500}
            placeholder="순서를 입력하세요"
            aria-invalid={Boolean(errors.orderRaw)}
            {...form.register("orderRaw", { valueAsNumber: true })}
          />
          {fieldError(errors.orderRaw?.message)}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="participant-team">
          팀명 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="participant-team"
          placeholder="팀명을 입력하세요"
          aria-invalid={Boolean(errors.teamName)}
          {...form.register("teamName")}
        />
        {fieldError(errors.teamName?.message)}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="participant-robot">
          로봇명 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="participant-robot"
          placeholder="로봇명을 입력하세요"
          aria-invalid={Boolean(errors.robotName)}
          {...form.register("robotName")}
        />
        {fieldError(errors.robotName?.message)}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="participant-comment">코멘트 (선택사항)</Label>
        <Textarea
          id="participant-comment"
          maxLength={500}
          placeholder="코멘트를 입력하세요 (선택사항)"
          aria-invalid={Boolean(errors.comment)}
          {...form.register("comment")}
        />
        <p className="text-right text-xs text-muted-foreground">{comment.length}/500자</p>
        {fieldError(errors.comment?.message)}
      </div>
    </>
  );
}

export function ParticipantFormDialog({
  divisions,
  participant,
  defaultDivisionId,
  open,
  onOpenChange,
}: ParticipantFormDialogProps) {
  const isEditing = participant !== undefined;
  const form = useForm<ParticipantForm>({
    resolver: zodResolver(ParticipantFormSchema),
    defaultValues: getDefaultValues(participant, defaultDivisionId),
  });
  const divisionId = form.watch("divisionId");
  const orderRaw = form.watch("orderRaw");
  const conflict = useOrderConflict({ divisionId, orderRaw, excludeParticipantId: participant?.id });

  React.useEffect(() => {
    if (open) form.reset(getDefaultValues(participant, defaultDivisionId));
  }, [defaultDivisionId, form, open, participant]);

  React.useEffect(() => {
    if (conflict) {
      const divisionName = divisions.find((division) => division.id === divisionId)?.name ?? "선택한 부문";
      form.setError("orderRaw", {
        type: "duplicate",
        message: `'${divisionName}'에 이미 순번 ${orderRaw}을 쓰는 참가자가 있습니다.`,
      });
    } else if (form.getFieldState("orderRaw").error?.type === "duplicate") {
      form.clearErrors("orderRaw");
    }
  }, [conflict, divisionId, divisions, form, orderRaw]);

  const onSubmit = async (value: ParticipantForm) => {
    try {
      if (participant) await participantService.admin.update({ ...participant, ...value });
      else await participantService.admin.create(value);
      form.reset();
      onOpenChange(false);
    } catch {
      form.setError("root", {
        message: isEditing
          ? "참가자 정보를 저장하지 못했습니다. 다시 시도해주세요."
          : "참가자를 생성하지 못했습니다. 다시 시도해주세요.",
      });
    }
  };

  const title = isEditing ? "참가자 수정" : "새 참가자 생성";
  const description = isEditing ? "참가자 정보를 수정하세요." : "새로운 참가자를 추가해주세요.";
  const submitLabel = isEditing ? "저장" : "생성";
  const submittingLabel = isEditing ? "저장 중..." : "생성 중...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <ParticipantFormFields
            form={form}
            divisions={divisions}
            divisionDisabled={!isEditing && Boolean(defaultDivisionId)}
          />
          {form.formState.errors.root ? (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting || Boolean(conflict)}>
              {form.formState.isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
