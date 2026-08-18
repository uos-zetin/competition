import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { counterService } from "@/entities/counter";
import { type ManualRecordForm, manualRecordService } from "@/entities/manual-record";
import type { Participant } from "@/entities/participant";
import { errorHandlingService } from "@/features/error-handling";
import { progressService } from "@/features/progress";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { selectRecentSubmissions } from "../lib/select-recent-submissions";
import { useManualCounterAuthorization } from "../lib/use-manual-counter-authorization";

import { RecentSubmissionsList } from "./recent-submissions-list";
import { StopwatchPanel } from "./stopwatch-panel";
import { SubmitPanel } from "./submit-panel";

export function ManualCounterPage() {
  const isAuthorized = useManualCounterAuthorization();
  const navigate = useNavigate();
  const { counterId } = useParams();
  const counter = counterService.use.counterState(counterId ?? "");
  const manualRecords = manualRecordService.use.manualRecords();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);
  const [pinnedParticipant, setPinnedParticipant] = useState<Participant | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [recorderName, setRecorderName] = useState("");
  const [submittedRecordIds, setSubmittedRecordIds] = useState<string[]>([]);
  const [successToken, setSuccessToken] = useState(0);

  useEffect(() => {
    if (!counterId) void navigate("/counter");
  }, [counterId, navigate]);

  useEffect(() => {
    if (!isAuthorized || !counterId) return;
    void counterService.connection
      .connect(counterId)
      .catch((error: unknown) => errorHandlingService.handle(error, "계수기 연결에 실패했습니다"));
    return () => {
      void counterService.connection
        .disconnect(counterId)
        .catch((error: unknown) => errorHandlingService.handle(error, "계수기 연결 해제에 실패했습니다"));
    };
  }, [counterId, isAuthorized]);

  const recentSubmissions = useMemo(
    () => selectRecentSubmissions(manualRecords, submittedRecordIds),
    [manualRecords, submittedRecordIds]
  );
  const hasCompletedRun = startedAt !== null && stoppedAt !== null;
  const canSubmit = recorderName.trim().length > 0 && hasCompletedRun && pinnedParticipant !== null;
  const hint = !recorderName.trim()
    ? "기록자 이름을 입력하세요."
    : !hasCompletedRun
      ? "스톱워치 측정을 완료하세요."
      : !pinnedParticipant
        ? "현재 진행 중인 참가자가 없습니다."
        : "측정한 기록을 전송할 수 있습니다.";

  const resetStopwatch = () => {
    setStartedAt(null);
    setStoppedAt(null);
    setPinnedParticipant(null);
  };
  const startStopwatch = async () => {
    if (!counter?.divisionId) return;
    setIsStarting(true);
    try {
      const progress = await progressService.load.byDivision(counter.divisionId);
      if (!progress.runner) {
        errorHandlingService.handle(new Error("현재 진행 중인 참가자가 없습니다"), "측정을 시작할 수 없습니다");
        return;
      }
      setPinnedParticipant(progress.runner.participant);
      setStartedAt(Date.now());
      setStoppedAt(null);
    } catch (error) {
      errorHandlingService.handle(error, "측정 대상 조회에 실패했습니다");
    } finally {
      setIsStarting(false);
    }
  };
  const stopStopwatch = () => setStoppedAt(Date.now());
  const submit = async () => {
    if (!pinnedParticipant || startedAt === null || stoppedAt === null) return;
    const form: ManualRecordForm = { value: stoppedAt - startedAt, recorderName: recorderName.trim() };
    try {
      const record = await manualRecordService.admin.create(pinnedParticipant.id, form);
      setSubmittedRecordIds((ids) => [...ids, record.id]);
      setSuccessToken((token) => token + 1);
      resetStopwatch();
    } catch (error) {
      errorHandlingService.handle(error, "기록 제출에 실패했습니다");
    }
  };

  if (!isAuthorized || !counterId) return <p className="grid h-dvh place-items-center">로딩 중...</p>;

  return (
    <>
      <AppHeader title="수동 계수" showBackButton backPath="/counter" />
      <PageContainer maxWidth="md" padding="md" className="py-6 sm:py-8">
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          <p className="px-1 text-sm text-muted-foreground">
            계수기: <strong className="font-semibold text-foreground">{counter?.name ?? counterId}</strong>
          </p>
          <StopwatchPanel
            startedAt={startedAt}
            stoppedAt={stoppedAt}
            disableStart={!counter?.divisionId}
            isStarting={isStarting}
            onStart={() => void startStopwatch()}
            onStop={stopStopwatch}
            onReset={resetStopwatch}
          />
          <SubmitPanel
            recorderName={recorderName}
            onRecorderNameChange={setRecorderName}
            canSubmit={canSubmit}
            hint={hint}
            onSubmit={() => void submit()}
            successToken={successToken}
            successMessage="기록을 전송했습니다."
          />
          <RecentSubmissionsList records={recentSubmissions} />
        </div>
      </PageContainer>
    </>
  );
}
