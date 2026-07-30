import * as React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui";

import { type Division, DivisionFormSchema,type DivisionFormValues } from "../model";
import { divisionService } from "../model/division-service";

import { DivisionFormFields } from "./division-create-dialog";

interface DivisionEditDialogProps {
  division: Division;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DivisionEditDialog({ division, open, onOpenChange }: DivisionEditDialogProps) {
  const form = useForm<DivisionFormValues>({ resolver: zodResolver(DivisionFormSchema), defaultValues: division });
  const description = form.watch("description");
  const timeLimit = form.watch("timeLimit");

  React.useEffect(() => {
    if (open) form.reset({ name: division.name, description: division.description, timeLimit: division.timeLimit });
  }, [division, form, open]);

  const onSubmit = async (value: DivisionFormValues) => {
    try {
      await divisionService.admin.update(division, value);
      onOpenChange(false);
    } catch {
      form.setError("root", { message: "부문 정보를 저장하지 못했습니다. 다시 시도해주세요." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>부문 수정</DialogTitle>
          <DialogDescription>부문 정보를 수정해주세요.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3.5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <DivisionFormFields form={form} idPrefix="division-edit" description={description} timeLimit={timeLimit} />
          {form.formState.errors.root ? (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
