import * as React from "react";
import { type DefaultValues, useForm } from "react-hook-form";

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
import { type Division, DivisionFormSchema, type DivisionFormValues, MAX_TIME_LIMIT_SECONDS } from "../model";
import { divisionService } from "../model/division-service";

type DivisionFormDialogProps =
  | { division: Division; open: boolean; onOpenChange: (open: boolean) => void }
  | {
      division?: undefined;
      competitionId: string;
      competitionName: string;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    };

function getDefaultValues(division?: Division): DefaultValues<DivisionFormValues> {
  return division
    ? { name: division.name, description: division.description, timeLimit: division.timeLimit }
    : { name: "", description: "", timeLimit: 90 };
}

export function DivisionFormDialog(props: DivisionFormDialogProps) {
  const { division, open, onOpenChange } = props;
  const isEditing = division !== undefined;
  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(DivisionFormSchema),
    defaultValues: getDefaultValues(division),
  });
  const description = form.watch("description") ?? "";
  const timeLimit = form.watch("timeLimit");

  React.useEffect(() => {
    if (open) form.reset(getDefaultValues(division));
  }, [division, form, open]);

  const onSubmit = async (value: DivisionFormValues) => {
    try {
      if (division) await divisionService.admin.update(division, value);
      else await divisionService.admin.create(props.competitionId, value);
      form.reset();
      onOpenChange(false);
    } catch {
      form.setError("root", {
        message: isEditing
          ? "부문 정보를 저장하지 못했습니다. 다시 시도해주세요."
          : "부문을 생성하지 못했습니다. 다시 시도해주세요.",
      });
    }
  };
  const descriptionText = isEditing
    ? "부문 정보를 수정해주세요."
    : `'${props.competitionName}'에 새로운 부문을 만들어주세요.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "부문 수정" : "새 부문 생성"}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <div className="grid gap-1.5">
            <Label htmlFor="division-name">
              부문명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="division-name"
              placeholder="부문명을 입력하세요"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="division-description">설명 (선택사항)</Label>
            <Textarea
              id="division-description"
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
            <Label htmlFor="division-time-limit">
              제한시간 (초) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="division-time-limit"
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
          {form.formState.errors.root ? (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (isEditing ? "저장 중..." : "생성 중...") : isEditing ? "저장" : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
