import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/shared/lib";

export function ConnectionStatusBadge({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        connected
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
      )}
    >
      {connected ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
      {connected ? "연결됨" : "연결 안됨"}
    </span>
  );
}
