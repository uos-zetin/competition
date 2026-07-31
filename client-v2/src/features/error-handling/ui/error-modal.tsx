import { useNavigate } from "react-router";

import { AlertTriangle } from "lucide-react";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui";

import { runAuthExpiredHandler, useErrorModalStore } from "../model";

export function ErrorModalHost() {
  const activeError = useErrorModalStore((state) => state.activeError);
  const close = useErrorModalStore((state) => state.close);
  const navigate = useNavigate();

  if (activeError?.displayType !== "modal") {
    return null;
  }

  const handleConfirm = () => {
    if (activeError.clearAuth) {
      runAuthExpiredHandler();
    }
    close();
    if (activeError.actionType === "redirect" && activeError.redirectPath) {
      void navigate(activeError.redirectPath);
    }
  };

  return (
    <Dialog open onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
            <DialogTitle>{activeError.title}</DialogTitle>
          </div>
          <DialogDescription>{activeError.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handleConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
