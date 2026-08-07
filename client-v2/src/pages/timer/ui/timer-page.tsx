import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { counterService } from "@/entities/counter";
import { useAdminAuthorization } from "@/features/auth";
import { progressService } from "@/features/progress";

import { CountdownClock } from "./countdown-clock";
import { CurrentRecordPanel } from "./current-record-panel";
import { DivisionInfo } from "./division-info";
import { NextRunnerPanel } from "./next-runner-panel";
import { RunnerInfo } from "./runner-info";
import { SponsorPanel } from "./sponsor-panel";
import { StopwatchClock } from "./stopwatch-clock";
import { TimerHeader } from "./timer-header";
import { TopRecordPanel } from "./top-record-panel";

export function TimerPage() {
  const isAuthorized = useAdminAuthorization();
  const navigate = useNavigate();
  const { counterId } = useParams();
  const counter = counterService.use.counterState(counterId ?? "");
  const division = progressService.use.division();

  useEffect(() => {
    if (!counterId) void navigate("/counter");
  }, [counterId, navigate]);
  useEffect(() => {
    if (!isAuthorized || !counterId) return;
    void counterService.connection
      .connect(counterId)
      .catch((error: unknown) => console.error("Failed to connect counter", error));
    return () => {
      void counterService.connection
        .disconnect(counterId)
        .catch((error: unknown) => console.error("Failed to disconnect counter", error));
    };
  }, [counterId, isAuthorized]);
  useEffect(() => {
    if (!isAuthorized || !counter?.divisionId) return;
    void progressService.connection
      .connect(counter.divisionId)
      .catch((error: unknown) => console.error("Failed to connect progress", error));
    return () => {
      void progressService.connection
        .disconnect()
        .catch((error: unknown) => console.error("Failed to disconnect progress", error));
    };
  }, [counter?.divisionId, isAuthorized]);

  if (!isAuthorized || !counterId) return <p className="grid h-dvh place-items-center">로딩 중...</p>;
  const dashboardUrl = division
    ? `${window.location.origin}/dashboard?competitionId=${division.competitionId}`
    : window.location.href;
  return (
    <main className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden bg-background">
      <TimerHeader />
      <div className="@container grid min-h-0 grid-rows-[auto_1fr] gap-[clamp(.4rem,1cqi,1rem)] p-[clamp(.5rem,1.5cqi,1.4rem)]">
        <section className="grid min-w-0 grid-cols-2">
          <div className="flex min-w-0 flex-col items-center justify-center p-2 text-center">
            <DivisionInfo />
          </div>
          <div className="flex min-w-0 flex-col items-center justify-center p-2 text-center">
            <RunnerInfo />
          </div>
          <div className="flex min-w-0 items-center justify-center p-2">
            <CountdownClock />
          </div>
          <div className="flex min-w-0 items-center justify-center p-2">
            <StopwatchClock counterId={counterId} />
          </div>
        </section>
        <section className="grid min-h-0 grid-cols-[1fr_2fr_1fr_1.2fr] gap-[clamp(.35rem,.8cqi,.75rem)]">
          <NextRunnerPanel />
          <TopRecordPanel />
          <CurrentRecordPanel />
          <SponsorPanel dashboardUrl={dashboardUrl} />
        </section>
      </div>
    </main>
  );
}
