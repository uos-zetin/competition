import { ClipboardCheck } from "lucide-react";

import { formatMsToClock, formatRelativeTimeKo } from "@/shared/lib";
import type { ManualRecord } from "@/entities/manual-record";

export function RecentSubmissionsList({ records }: { records: ManualRecord[] }) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center gap-2 border-b px-4 py-3 text-sm font-bold"><ClipboardCheck className="size-4 text-muted-foreground" aria-hidden="true" />이번 세션에 보낸 기록</header>
      {records.length === 0 ? <p className="px-4 py-6 text-center text-sm text-muted-foreground">아직 전송한 기록이 없습니다.</p> : <ul className="divide-y">{records.map((record) => <li key={record.id} className="px-4 py-3"><p className="font-bold tabular-nums">{formatMsToClock(record.value)}</p><p className="mt-0.5 text-xs text-muted-foreground">{record.recorderName} · {formatRelativeTimeKo(record.createdAt)}</p></li>)}</ul>}
    </section>
  );
}
