import { useEffect, useState } from "react";

import { Link2, Plug } from "lucide-react";

import { Button, ConfirmDialog, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import { ConnectionStatusBadge } from "@/entities/counter";
import { DivisionStatusBadge } from "@/entities/division";
// Error handling is the architecture's designated cross-cutting feature exception.
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-cross-slice-dependency
import { errorHandlingService } from "@/features/error-handling/model";

import { counterAdminControlService } from "../model";

interface CounterControlPanelProps {
  counterId: string;
}

export function CounterControlPanel({ counterId }: CounterControlPanelProps) {
  const [selectedCompetitionId, setSelectedCompetitionId] = useState("");
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const counter = counterAdminControlService.use.counter(counterId);
  const isConnected = counterAdminControlService.use.isConnected(counterId);
  const competitions = counterAdminControlService.use.competitions();
  const divisions = counterAdminControlService.use.divisionsForSelectedCompetition();
  const connectedDivision = counterAdminControlService.use.connectedDivision(counter?.divisionId ?? "");

  useEffect(() => {
    void counterAdminControlService.load.competitions().catch((error: unknown) => {
      errorHandlingService.handle(error, "대회 목록을 불러오는데 실패했습니다");
    });
  }, []);

  useEffect(() => {
    const divisionId = counter?.divisionId;
    if (!divisionId || connectedDivision) return;

    void counterAdminControlService.load.connectedDivision(divisionId).catch((error: unknown) => {
      errorHandlingService.handle(error, "부문 정보를 불러오는데 실패했습니다");
    });
  }, [connectedDivision, counter?.divisionId]);

  const handleCompetitionChange = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    setSelectedDivisionId("");
    void counterAdminControlService.load.divisionsByCompetition(competitionId).catch((error: unknown) => {
      errorHandlingService.handle(error, "부문 목록을 불러오는데 실패했습니다");
    });
  };

  const handleConnect = async () => {
    if (!counter || !selectedDivisionId) return;
    try {
      await counterAdminControlService.control.connectDivision(counterId, selectedDivisionId);
    } catch (error) {
      errorHandlingService.handle(error, "부문 연결에 실패했습니다");
    }
  };

  const handleDisconnect = async () => {
    try {
      await counterAdminControlService.control.disconnectDivision(counterId);
    } catch (error) {
      errorHandlingService.handle(error, "부문 연결 해제에 실패했습니다");
    }
  };

  const divisionId = counter?.divisionId;

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Plug className="size-4 text-muted-foreground" aria-hidden="true" />
          계수기 제어
        </div>
        <p className="mt-1 pl-6 text-xs text-muted-foreground">부문 연결과 상태를 관리합니다</p>
      </header>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold">연결 상태</span>
          <ConnectionStatusBadge connected={isConnected} />
        </div>
        <div className="h-px bg-border" />
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <p>
            ID <b className="font-mono font-semibold text-foreground">{counter?.id ?? counterId}</b>
          </p>
          <p>
            이름 <b className="font-semibold text-foreground">{counter?.name ?? "-"}</b>
          </p>
        </div>
        {divisionId ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">연결된 부문</p>
                <p className="truncate text-sm font-semibold">{connectedDivision?.name ?? `부문 ${divisionId}`}</p>
              </div>
              {connectedDivision ? <DivisionStatusBadge status={connectedDivision.status} /> : null}
            </div>
            <Button type="button" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => setDisconnectOpen(true)}>
              부문 연결 해제
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold" htmlFor={`${counterId}-competition`}>
                대회
              </label>
              <Select value={selectedCompetitionId} onValueChange={handleCompetitionChange} disabled={!counter}>
                <SelectTrigger id={`${counterId}-competition`}>
                  <SelectValue placeholder="대회를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {competitions.map((competition) => (
                    <SelectItem key={competition.id} value={competition.id}>
                      {competition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold" htmlFor={`${counterId}-division`}>
                부문
              </label>
              <Select value={selectedDivisionId} onValueChange={setSelectedDivisionId} disabled={!counter || !selectedCompetitionId}>
                <SelectTrigger id={`${counterId}-division`}>
                  <SelectValue placeholder="부문을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division.id} value={division.id}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" disabled={!counter || !selectedDivisionId} onClick={() => void handleConnect()}>
              <Link2 className="size-4" aria-hidden="true" />
              부문 연결
            </Button>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        variant="destructive"
        title="부문 연결 해제"
        message="부문 연결을 해제하시겠습니까?"
        confirmLabel="확인"
        onConfirm={handleDisconnect}
      />
    </section>
  );
}
