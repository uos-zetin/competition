import { useEffect } from "react";
import { useParams } from "react-router";

import { CircleAlert, ClipboardList, Clock, FileCheck2, Plus } from "lucide-react";

import { counterService } from "@/entities/counter";
import { manualRecordService } from "@/entities/manual-record";
import { useAdminAuthorization } from "@/features/auth";
import { CounterControlPanel, CounterMonitorPanel } from "@/features/counter-admin-control";
import { errorHandlingService } from "@/features/error-handling";
import { ManualRecordAggregationPanel } from "@/features/manual-record-aggregation";
import { ProgressMonitorPanel,progressService } from "@/features/progress";
import { RecordReviewList, RecordReviewSummary } from "@/features/record-review";
import { TimerControlPanel } from "@/features/timer-control";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { CurrentRunnerStrip } from "./current-runner-strip";
import { ManualRecordForm } from "./manual-record-form";
import { RunnerRequiredCard } from "./runner-required-card";

export function ControllerPage() {
  const isAuthorized = useAdminAuthorization();
  const { counterId } = useParams();
  const counter = counterService.use.counterState(counterId ?? "");
  const progress = progressService.use.progress();
  const runner = progress?.runner ?? null;
  const division = progress?.division ?? null;

  useEffect(() => {
    if (!isAuthorized || !counterId) return;
    void counterService.connection.connect(counterId).catch((error) => errorHandlingService.handle(error, "계수기 연결에 실패했습니다"));
    return () => { void counterService.connection.disconnect(counterId); };
  }, [counterId, isAuthorized]);

  useEffect(() => {
    const participantId = runner?.participant.id;
    if (!participantId) return;
    void manualRecordService.load(participantId).catch((error) => errorHandlingService.handle(error, "수동 계수 기록을 불러오는데 실패했습니다"));
  }, [runner?.participant.id]);

  if (!isAuthorized) return null;

  if (!counterId) {
    return (
      <PageContainer className="py-8 sm:py-10">
        <section className="flex flex-col items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-10 text-center">
          <CircleAlert className="size-6 text-destructive" aria-hidden="true" />
          <h2 className="font-bold">오류</h2>
          <p className="text-sm text-muted-foreground">계수기 ID가 제공되지 않았습니다.</p>
        </section>
      </PageContainer>
    );
  }

  return (
    <>
      <AppHeader title={`컨트롤러 — ${counter?.name ?? counterId}`} showBackButton backPath="/counter" />
      <PageContainer maxWidth="full" padding="md" className="py-8 sm:py-10">
        <p className="mb-7 text-[0.9375rem] text-muted-foreground">실시간 계수기 제어 및 모니터링</p>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 2xl:columns-4">
          <div className="mb-5 break-inside-avoid"><CounterControlPanel counterId={counterId} /></div>
          <div className="mb-5 break-inside-avoid"><ProgressMonitorPanel counterId={counterId} /></div>
          <div className="mb-5 break-inside-avoid"><CounterMonitorPanel counterId={counterId} /></div>
          <div className="mb-5 break-inside-avoid">
            {runner && division ? <TimerControlPanel participantId={runner.participant.id} timerLogs={runner.timerLogs} timeLimitMs={division.timeLimit * 1_000} /> : <RunnerRequiredCard icon={Clock} title="타이머 제어" description="참가자가 배정되면 타이머를 제어할 수 있습니다." />}
          </div>
          {runner ? <div className="mb-5 break-inside-avoid"><CurrentRunnerStrip runner={runner} /></div> : null}
          <div className="mb-5 break-inside-avoid">
            {runner ? <ManualRecordAggregationPanel participantId={runner.participant.id} /> : <RunnerRequiredCard icon={ClipboardList} title="수동 계수 기록 취합" description="참가자가 배정되면 기록을 취합할 수 있습니다." />}
          </div>
          <div className="mb-5 break-inside-avoid">
            {runner ? <ManualRecordForm participantId={runner.participant.id} /> : <RunnerRequiredCard icon={Plus} title="기록 수동 추가" description="참가자가 배정되면 기록을 추가할 수 있습니다." />}
          </div>
          <div className="mb-5 break-inside-avoid">
            {runner ? <section className="overflow-hidden rounded-xl border bg-card shadow-sm"><header className="border-b px-4 py-3"><div className="flex items-center gap-2 text-sm font-bold"><FileCheck2 className="size-4 text-muted-foreground" aria-hidden="true" />기록 리뷰</div></header><div className="flex flex-col gap-4 p-4"><RecordReviewSummary records={runner.records} /><RecordReviewList records={runner.records} /></div></section> : <RunnerRequiredCard icon={FileCheck2} title="기록 리뷰" description="참가자가 배정되면 기록을 검토할 수 있습니다." />}
          </div>
        </div>
      </PageContainer>
    </>
  );
}
