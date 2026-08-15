import { formatTimeShort } from "@/shared/lib";

type DashboardHeaderProps = {
  lastUpdatedAt: Date | null;
};

export function DashboardHeader({ lastUpdatedAt }: DashboardHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-1.5">
      <h1 className="text-[1.375rem] font-extrabold tracking-tight">📊 실시간 대시보드</h1>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm text-muted-foreground">완주한 참가자의 최고 기록과 진행 상황을 확인하세요</p>
        {lastUpdatedAt ? (
          <time className="font-mono text-xs tabular-nums text-muted-foreground">
            마지막 업데이트 {formatTimeShort(lastUpdatedAt)}
          </time>
        ) : null}
      </div>
    </header>
  );
}
