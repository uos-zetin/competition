import * as React from "react";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/shared/lib";

import { Button } from "./button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  message: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  message,
  confirmLabel,
  cancelLabel = "취소",
  variant = "default",
  onConfirm,
  isSubmitting,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const submitting = isSubmitting ?? isConfirming;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border bg-background p-6 shadow-lg">
          <div className="flex flex-col gap-1.5">
            <AlertDialog.Title className="text-base font-bold">{title}</AlertDialog.Title>
            {description ? (
              <AlertDialog.Description className="text-sm text-muted-foreground">{description}</AlertDialog.Description>
            ) : null}
          </div>
          <div className="flex gap-3 text-sm leading-6">
            {variant === "destructive" ? <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" /> : null}
            <p className={cn(variant === "destructive" && "text-foreground")}>{message}</p>
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <Button type="button" variant={variant} disabled={submitting} onClick={() => void handleConfirm()}>
              {submitting ? "처리 중..." : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
