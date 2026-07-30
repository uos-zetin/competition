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

import { type CompetitionForm, CompetitionFormSchema } from "../model";
import { competitionService } from "../model/competition-service";

interface CompetitionCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompetitionCreateDialog({ open, onOpenChange }: CompetitionCreateDialogProps) {
  const form = useForm<CompetitionForm>({
    resolver: zodResolver(CompetitionFormSchema),
    defaultValues: { name: "", description: "" },
  });
  const description = form.watch("description");

  React.useEffect(() => {
    if (open) form.reset({ name: "", description: "" });
  }, [form, open]);

  const onSubmit = async (value: CompetitionForm) => {
    try {
      await competitionService.admin.create(value);
      form.reset();
      onOpenChange(false);
    } catch {
      form.setError("root", { message: "대회를 생성하지 못했습니다. 다시 시도해주세요." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 대회 생성</DialogTitle>
          <DialogDescription>새로운 대회를 만들어주세요.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <div className="grid gap-1.5">
            <Label htmlFor="competition-name">
              대회명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="competition-name"
              placeholder="대회명을 입력하세요"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="competition-description">설명 (선택사항)</Label>
            <Textarea
              id="competition-description"
              maxLength={1000}
              placeholder="대회 설명을 입력하세요 (선택사항)"
              aria-invalid={Boolean(form.formState.errors.description)}
              {...form.register("description")}
            />
            <p className="text-right text-xs text-muted-foreground">{description.length}/1000자</p>
            {form.formState.errors.description ? (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
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
              {form.formState.isSubmitting ? "생성 중..." : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
