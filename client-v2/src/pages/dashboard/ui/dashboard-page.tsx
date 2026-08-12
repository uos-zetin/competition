import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { competitionService } from "@/entities/competition";
import { divisionService } from "@/entities/division";
import { participantService } from "@/entities/participant";
import { recordService } from "@/entities/record";
import { progressService } from "@/features/progress";
import { PageContainer } from "@/widgets/layout";

import { formatTopRecords } from "../lib/format-top-records";

import { AllDivisionsView } from "./all-divisions-view";
import { CompetitionSummaryCard } from "./competition-summary-card";
import { DashboardFilterCard } from "./dashboard-filter-card";
import { DashboardHeader } from "./dashboard-header";
import { EmptyState } from "./empty-state";
import { NoteStrip } from "./note-strip";
import { ProgressNowCard } from "./progress-now-card";
import { TopRecordsList } from "./top-records-list";

const POLL_INTERVAL_MS = 15_000;

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const competitionId = searchParams.get("competitionId") ?? "";
  const divisionId = searchParams.get("divisionId") ?? "";
  const competitions = competitionService.use.competitions();
  const divisions = divisionService.use.divisionsByCompetition(competitionId);
  const participants = participantService.use.participants();
  const records = recordService.use.records();
  const runner = progressService.use.runner();
  const nextRunners = progressService.use.nextRunners();
  const competition = competitions.find((item) => item.id === competitionId);
  const division = divisions.find((item) => item.id === divisionId);

  const loadDashboard = useCallback(async () => {
    try {
      await competitionService.load();
      if (!competitionId) {
        setLastUpdatedAt(new Date());
        return;
      }

      const loadedDivisions = await divisionService.load(competitionId);
      const targetDivisions = divisionId ? loadedDivisions.filter((item) => item.id === divisionId) : loadedDivisions;
      await Promise.all(
        targetDivisions.flatMap((item) => [recordService.load.topByDivision(item.id), participantService.load(item.id)])
      );
      const selectedDivision = targetDivisions.find((item) => item.id === divisionId);
      if (selectedDivision?.status === "ongoing") await progressService.load.byDivision(selectedDivision.id);
      setLastUpdatedAt(new Date());
    } catch (error: unknown) {
      console.error("Failed to load dashboard data", error);
    }
  }, [competitionId, divisionId]);

  useEffect(() => {
    void Promise.resolve().then(loadDashboard);
    const intervalId = window.setInterval(() => void loadDashboard(), POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [loadDashboard]);

  const updateSearchParams = (next: { competitionId?: string; divisionId?: string }) => {
    const params = new URLSearchParams(searchParams);
    const values = { competitionId, divisionId, ...next };
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    setSearchParams(params);
  };

  const recordsByDivision = useMemo(() => {
    const rows = new Map<string, ReturnType<typeof formatTopRecords>>();
    for (const item of divisions) {
      const divisionParticipants = participants.filter((participant) => participant.divisionId === item.id);
      rows.set(item.id, formatTopRecords(records, divisionParticipants, "mini"));
    }
    return rows;
  }, [divisions, participants, records]);
  const selectedRecords = useMemo(
    () => formatTopRecords(records, participants.filter((participant) => participant.divisionId === divisionId), "full"),
    [divisionId, participants, records]
  );

  return (
    <PageContainer maxWidth="2xl" padding="md" className="py-5 sm:py-8">
      <DashboardHeader lastUpdatedAt={lastUpdatedAt} />
      <DashboardFilterCard
        competitions={competitions}
        divisions={divisions}
        competitionId={competitionId}
        divisionId={divisionId}
        onCompetitionChange={(id) => updateSearchParams({ competitionId: id, divisionId: "" })}
        onDivisionChange={(id) => updateSearchParams({ divisionId: id })}
      />
      {!competitionId || !competition ? (
        <EmptyState icon="🏁" title="대회를 선택해주세요" description="위에서 대회를 선택하시면 실시간 순위와 기록을 확인할 수 있습니다" />
      ) : !divisionId ? (
        <>
          <CompetitionSummaryCard competition={competition} />
          <AllDivisionsView divisions={divisions} recordsByDivision={recordsByDivision} onSelectDivision={(id) => updateSearchParams({ divisionId: id })} />
        </>
      ) : !division ? (
        <EmptyState icon="🏁" title="부문을 찾을 수 없습니다" description="다른 부문을 선택해주세요" />
      ) : (
        <>
          <CompetitionSummaryCard competition={competition} division={division} />
          {division.status === "ready" ? (
            <EmptyState icon="⏳" title="아직 시작 전인 부문입니다" description="경기가 시작되면 진행 현황과 최고 기록이 표시됩니다" variant="sub" />
          ) : (
            <>
              {division.status === "ongoing" ? <ProgressNowCard runner={runner} nextRunners={nextRunners} /> : <NoteStrip />}
              <section>
                <div className="mb-3">
                  <h2 className="text-base font-bold">{division.status === "closed" ? "최종 기록" : "최고 기록"}</h2>
                  {division.status === "ongoing" ? <p className="mt-0.5 text-xs text-muted-foreground">완주한 참가자만 표시됩니다</p> : null}
                </div>
                <div className="rounded-xl border bg-card px-5 py-1.5">
                  <TopRecordsList records={selectedRecords} variant="full" />
                </div>
              </section>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
