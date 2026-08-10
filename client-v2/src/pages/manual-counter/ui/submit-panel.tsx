import { useEffect, useState } from "react";

import { CheckCircle2, Send } from "lucide-react";

import { Button, Input, Label } from "@/shared/ui";

type SubmitPanelProps = {
  recorderName: string;
  onRecorderNameChange: (value: string) => void;
  canSubmit: boolean;
  hint: string;
  onSubmit: () => void;
  successToken: number;
  successMessage: string;
};

export function SubmitPanel({ recorderName, onRecorderNameChange, canSubmit, hint, onSubmit, successToken, successMessage }: SubmitPanelProps) {
  const [dismissedToken, setDismissedToken] = useState(0);

  useEffect(() => {
    if (successToken === 0) return;
    const timer = window.setTimeout(() => setDismissedToken(successToken), 3_200);
    return () => window.clearTimeout(timer);
  }, [successToken]);

  const isSuccessVisible = successToken !== 0 && dismissedToken !== successToken;

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="border-b px-4 py-3 text-sm font-bold">기록 전송</header>
      <div className="space-y-4 p-4">
        {isSuccessVisible ? <div className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white"><CheckCircle2 className="size-4" aria-hidden="true" />{successMessage}</div> : null}
        <div className="space-y-2"><Label htmlFor="recorder-name">기록자 이름</Label><Input id="recorder-name" value={recorderName} onChange={(event) => onRecorderNameChange(event.target.value)} placeholder="이름을 입력하세요" /></div>
        <p className="text-xs text-muted-foreground">{hint}</p>
        <Button type="button" className="w-full" onClick={onSubmit} disabled={!canSubmit}><Send aria-hidden="true" />기록 전송</Button>
      </div>
    </section>
  );
}
