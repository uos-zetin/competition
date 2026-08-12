import { Badge } from "@/shared/ui";
import type { Participant } from "@/entities/participant";
import type { Runner } from "@/features/progress";

type ProgressNowCardProps = {
  runner: Runner | null;
  nextRunners: Participant[] | null;
};

export function ProgressNowCard({ runner, nextRunners }: ProgressNowCardProps) {
  return (
    <section className="mb-4">
      <h2 className="mb-3 text-base font-bold">진행 현황</h2>
      <div className="rounded-xl border bg-card p-5">
        {runner ? (
          <div className="mb-4 flex flex-col items-start gap-1.5 rounded-[0.6rem] border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />진행 중
            </Badge>
            <strong className="text-[0.95rem]">{runner.participant.name}</strong>
            <span className="-mt-1 text-[0.8rem] text-muted-foreground">{runner.participant.teamName || "개인 참가"}</span>
          </div>
        ) : null}
        <p className="mb-2 text-[0.6875rem] font-bold tracking-wider text-muted-foreground">다음 순서</p>
        {nextRunners?.length ? (
          <div className="flex flex-col gap-2.5">
            {nextRunners.map((participant, index) => (
              <div key={participant.id} className="flex items-center gap-2.5 text-[0.8125rem]">
                <span className="inline-flex h-[1.4rem] min-w-[3.1rem] items-center justify-center rounded-[0.35rem] border px-2 text-[0.6875rem] font-bold text-muted-foreground">
                  {index + 1}번째
                </span>
                <span>{participant.name}</span>
                <span className="text-muted-foreground">· {participant.teamName || "개인 참가"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">다음 참가자가 없습니다</p>
        )}
      </div>
    </section>
  );
}
