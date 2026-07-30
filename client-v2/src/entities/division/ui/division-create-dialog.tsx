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
  Textarea,
} from "@/shared/ui";

import { formatTimeLimit } from "../lib/format";
import { DivisionFormSchema, type DivisionFormValues, MAX_TIME_LIMIT_SECONDS } from "../model";
import { divisionService } from "../model/division-service";

interface DivisionCreateDialogProps {
  competitionId: string;
  competitionName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: DivisionFormValues = { name: "", description: "", timeLimit: 90 };

export function DivisionCreateDialog({
  competitionId,
  competitionName,
  open,
  onOpenChange,
}: DivisionCreateDialogProps) {
  const form = useForm<DivisionFormValues>({ resolver: zodResolver(DivisionFormSchema), defaultValues });
  const description = form.watch("description");
  const timeLimit = form.watch("timeLimit");

  React.useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [form, open]);

  const onSubmit = async (value: DivisionFormValues) => {
    try {
      await divisionService.admin.create(competitionId, value);
      form.reset(defaultValues);
      onOpenChange(false);
    } catch {
      form.setError("root", { message: "부문을 생성하지 못했습니다. 다시 시도해주세요." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 부문 생성</DialogTitle>
          <DialogDescription>'{competitionName}'에 새로운 부문을 만들어주세요.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <DivisionFormFields form={form} idPrefix="division" description={description} timeLimit={timeLimit} />
          {form.formState.errors.root ? (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "생성 중..." : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DivisionFormFields({
  form,
  idPrefix,
  description,
  timeLimit,
}: {
  form: ReturnType<typeof useForm<DivisionFormValues>>;
  idPrefix: string;
  description: string;
  timeLimit: number;
}) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-name`}>
          부문명 <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${idPrefix}-name`}
          placeholder="부문명을 입력하세요"
          aria-invalid={Boolean(form.formState.errors.name)}
          {...form.register("name")}
        />
        {form.formState.errors.name ? (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-description`}>설명 (선택사항)</Label>
        <Textarea
          id={`${idPrefix}-description`}
          maxLength={1000}
          placeholder="부문 설명을 입력하세요 (선택사항)"
          aria-invalid={Boolean(form.formState.errors.description)}
          {...form.register("description")}
        />
        <p className="text-right text-xs text-muted-foreground">{description.length}/1000자</p>
        {form.formState.errors.description ? (
          <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
        ) : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-time-limit`}>
          제한시간 (초) <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${idPrefix}-time-limit`}
          type="number"
          min={1}
          max={MAX_TIME_LIMIT_SECONDS}
          aria-invalid={Boolean(form.formState.errors.timeLimit)}
          {...form.register("timeLimit", { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground">
          ≈ {Number.isFinite(timeLimit) ? formatTimeLimit(timeLimit) : "-"}
        </p>
        {form.formState.errors.timeLimit ? (
          <p className="text-xs text-destructive">{form.formState.errors.timeLimit.message}</p>
        ) : null}
      </div>
    </>
  );
}
