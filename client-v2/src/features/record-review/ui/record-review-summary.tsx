import { cn } from "@/shared/lib";
import type { Record } from "@/entities/record";

interface RecordReviewSummaryProps {
  records: Record[];
}

export function RecordReviewSummary({ records }: RecordReviewSummaryProps) {
  const total = records.length;
  const pending = records.filter((record) => record.status === "pending").length;
  const approved = records.filter((record) => record.status === "approved").length;
  const rejected = records.filter((record) => record.status === "rejected").length;
  const stats = [
    { label: "전체", value: total, className: "text-foreground" },
    { label: "대기", value: pending, className: "text-amber-700 dark:text-amber-300" },
    { label: "승인", value: approved, className: "text-emerald-700 dark:text-emerald-300" },
    { label: "거부", value: rejected, className: "text-red-700 dark:text-red-300" },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg border sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.label} className={cn("bg-card px-3 py-2.5 text-center", index > 0 && "border-l", index === 2 && "max-sm:border-l-0 max-sm:border-t", index === 3 && "max-sm:border-t")}>
          <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          <p className={`mt-0.5 text-lg font-bold ${stat.className}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
