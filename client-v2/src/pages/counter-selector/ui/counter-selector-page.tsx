import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Settings } from "lucide-react";

import { counterService } from "@/entities/counter";
import { divisionService } from "@/entities/division";
import { authService } from "@/features/auth";
import { errorHandlingService } from "@/features/error-handling";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { getUnresolvedDivisionIds } from "../lib/get-unresolved-division-ids";

import { CounterFeatureList } from "./counter-feature-list";
import { CounterPickerField } from "./counter-picker-field";

export function CounterSelectorPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = authService.use.auth();
  const counters = counterService.use.counters();
  const divisions = divisionService.use.divisions();
  const [selectedCounterId, setSelectedCounterId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const resolveDivisions = useCallback(async () => {
    const knownDivisionIds = new Set(divisions.map((division) => division.id));
    await Promise.allSettled(
      getUnresolvedDivisionIds(counters, knownDivisionIds).map((divisionId) => divisionService.loadById(divisionId))
    );
  }, [counters, divisions]);

  const loadCounters = useCallback(async () => {
    try {
      await counterService.load.all();
      setLastFetchedAt(new Date());
    } catch (error) {
      errorHandlingService.handle(error, "계수기 목록을 불러오는데 실패했습니다");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadInitialCounters = async () => {
      await loadCounters();
      setIsLoading(false);
    };
    void loadInitialCounters();
  }, [isAuthenticated, loadCounters]);

  useEffect(() => {
    if (isAuthenticated) void resolveDivisions();
  }, [isAuthenticated, resolveDivisions]);

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    void loadCounters().finally(() => setIsRefreshing(false));
  }, [isRefreshing, loadCounters]);

  const selectedCounter = counters.find((counter) => counter.id === selectedCounterId);
  const divisionNames = useMemo(() => new Map(divisions.map((division) => [division.id, division.name])), [divisions]);
  const isAdministrator = user?.roles.includes("administrator") ?? false;
  const isManualRecorder = user?.roles.includes("manualRecorder") ?? false;

  if (!isAuthenticated) return null;

  return (
    <>
      <AppHeader title="계수기 선택" showBackButton backPath="/" />
      <PageContainer maxWidth="md" padding="md" className="py-8 sm:py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-card shadow-sm">
          <section className="p-5 sm:p-6">
            <p className="text-[0.9375rem] text-muted-foreground">
              작업할 계수기를 선택한 후 원하는 기능에 접근할 수 있습니다
            </p>
          </section>
          <div className="divide-y divide-border">
            <section className="p-5 sm:p-6">
              <CounterPickerField
                counters={counters}
                getDivisionName={(divisionId) => {
                  if (!divisionId) return "미배정";
                  return `${divisionNames.get(divisionId) ?? divisionId} 연결됨`;
                }}
                value={selectedCounterId}
                onChange={setSelectedCounterId}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                lastFetchedAt={lastFetchedAt}
                onRefresh={handleRefresh}
              />
            </section>
            {selectedCounter ? (
              <section className="p-5 sm:p-6">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Settings className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-semibold">선택된 계수기: {selectedCounter.name}</p>
                    <p className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">ID: {selectedCounter.id}</p>
                  </div>
                </div>
              </section>
            ) : null}
            <section className="p-5 sm:p-6">
              <CounterFeatureList
                isAdministrator={isAdministrator}
                isManualRecorder={isManualRecorder}
                selectedCounterId={selectedCounterId}
                onNavigate={(feature) => void navigate(`/counter/${selectedCounterId}/${feature}`)}
              />
            </section>
            <section className="p-5 sm:p-6">
              <p className="text-[0.8125rem] font-semibold">사용 가능한 기능:</p>
              <ul className="mt-2.5 grid gap-1.5 text-[0.8125rem] text-muted-foreground">
                {isAdministrator ? (
                  <>
                    <li className="flex gap-1.5">
                      <span className="font-bold text-primary">•</span>컨트롤러: 경기 진행 및 제어
                    </li>
                    <li className="flex gap-1.5">
                      <span className="font-bold text-primary">•</span>타이머: 경기 시간 표시
                    </li>
                    <li className="flex gap-1.5">
                      <span className="font-bold text-primary">•</span>수동 계수: 수동 기록 입력
                    </li>
                  </>
                ) : isManualRecorder ? (
                  <li className="flex gap-1.5">
                    <span className="font-bold text-primary">•</span>수동 계수: 수동 기록 입력
                  </li>
                ) : (
                  <li className="flex gap-1.5">
                    <span className="font-bold text-primary">•</span>사용 가능한 기능이 없습니다
                  </li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
