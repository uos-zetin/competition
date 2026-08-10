import { type FormEvent,useState } from "react";

import { Plus } from "lucide-react";

import { Button, Input } from "@/shared/ui";
import { RecordFormSchema, recordService } from "@/entities/record";
import { errorHandlingService } from "@/features/error-handling";

export function ManualRecordForm({ participantId }: { participantId: string }) {
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const form = RecordFormSchema.parse({ value: Number(value), source: "other", note });
      setIsSubmitting(true);
      await recordService.admin.create(participantId, form);
      setValue("");
      setNote("");
    } catch (error) {
      errorHandlingService.handle(error, "계수 기록 추가에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Plus className="size-4 text-muted-foreground" aria-hidden="true" />
          기록 수동 추가
        </div>
      </header>
      <form className="flex flex-col gap-4 p-4" onSubmit={(event) => void handleSubmit(event)}>
        <label className="flex flex-col gap-2 text-xs font-semibold" htmlFor="manual-record-value">
          기록값 (밀리초)
          <Input id="manual-record-value" type="number" min="0" step="1" required placeholder="예: 15340 (15.34초)" value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <label className="flex flex-col gap-2 text-xs font-semibold" htmlFor="manual-record-note">
          메모 (선택사항)
          <Input id="manual-record-note" maxLength={500} placeholder="기록에 대한 설명" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <Button type="submit" variant="success" disabled={isSubmitting}>
          계수 기록 추가
        </Button>
      </form>
    </section>
  );
}
