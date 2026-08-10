import { MessageSquare } from "lucide-react";

import type { Runner } from "@/features/progress";

export function CurrentRunnerStrip({ runner }: { runner: Runner }) {
  return (
    <section className="flex flex-wrap items-center gap-x-3.5 gap-y-2 rounded-lg border bg-muted/35 px-3.5 py-2.5">
      <span className="text-[0.8125rem] font-bold">{runner.participant.name}</span>
      <span className="text-xs text-muted-foreground">{runner.participant.teamName}</span>
      {runner.participant.comment ? (
        <span className="ml-auto inline-flex items-center gap-1 border-l pl-3 text-[0.7rem] text-muted-foreground">
          <MessageSquare className="size-3" aria-hidden="true" />
          {runner.participant.comment}
        </span>
      ) : null}
    </section>
  );
}
