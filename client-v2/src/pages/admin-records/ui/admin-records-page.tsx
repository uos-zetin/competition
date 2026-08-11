import { useState } from "react";
import { useSearchParams } from "react-router";

import { BarChart3 } from "lucide-react";

import { competitionService } from "@/entities/competition";
import { divisionService } from "@/entities/division";
import { participantService } from "@/entities/participant";
import { recordService, type RecordStatus } from "@/entities/record";
import { useAdminAuthorization } from "@/features/auth";
import { groupRecordsByParticipant, RecordReviewSummary } from "@/features/record-review";
import { AdminNavShell } from "@/widgets/admin-layout";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { ParticipantRecordGroupItem } from "./participant-record-group";
import { RecordFilterCard } from "./record-filter-card";

export function AdminRecordsPage() {
  const isAuthorized = useAdminAuthorization();
  const [searchParams, setSearchParams] = useSearchParams();
  const competitionId = searchParams.get("competitionId") ?? "";
  const divisionId = searchParams.get("divisionId") ?? "";
  const statusParam = searchParams.get("status");
  const status: RecordStatus | "" =
    statusParam === "pending" || statusParam === "approved" || statusParam === "rejected" ? statusParam : "";
  const competitions = competitionService.use.competitions();
  const divisions = divisionService.use.divisionsByCompetition(competitionId);
  const allParticipants = participantService.use.participants();
  const allRecords = recordService.use.records();
  const [expandedParticipantId, setExpandedParticipantId] = useState<string | null>(null);

  const competitionParticipants = allParticipants.filter((participant) =>
    divisions.some((division) => division.id === participant.divisionId)
  );
  const filteredParticipants = divisionId
    ? competitionParticipants.filter((participant) => participant.divisionId === divisionId)
    : competitionParticipants;
  const participantIds = new Set(filteredParticipants.map((participant) => participant.id));
  const filteredRecords = allRecords.filter(
    (record) => participantIds.has(record.participantId) && (!status || record.status === status)
  );
  const groups = groupRecordsByParticipant(filteredRecords, filteredParticipants);

  const updateSearchParams = (next: { competitionId?: string; divisionId?: string; status?: RecordStatus | "" }) => {
    setExpandedParticipantId(null);

    const params = new URLSearchParams(searchParams);
    const values = { competitionId, divisionId, status, ...next };

    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    setSearchParams(params);
  };

  if (!isAuthorized) return null;

  return (
    <>
      <AppHeader title="관리자 페이지" showBackButton backPath="/" />
      <PageContainer maxWidth="full" padding="md" className="py-8 sm:py-10">
        <AdminNavShell activeSection="records">
          <div className="mb-[1.375rem]">
            <h2 className="text-[1.375rem] font-bold">기록 관리</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">경기 기록을 확인하고 승인·거부할 수 있습니다</p>
          </div>
          <RecordFilterCard
            competitions={competitions}
            divisions={divisions}
            competitionId={competitionId}
            divisionId={divisionId}
            status={status}
            onCompetitionChange={(id) => updateSearchParams({ competitionId: id, divisionId: "", status: "" })}
            onDivisionChange={(id) => updateSearchParams({ divisionId: id })}
            onStatusChange={(nextStatus) => updateSearchParams({ status: nextStatus })}
          />
          {!competitionId ? (
            <EmptyState title="대회를 선택해주세요" description="먼저 대회를 선택한 후 기록을 관리할 수 있습니다." />
          ) : groups.length === 0 ? (
            <EmptyState title="기록이 없습니다" description="선택된 부문과 상태에 해당하는 기록이 없습니다." />
          ) : (
            <>
              <div className="mb-[1.375rem]">
                <RecordReviewSummary records={filteredRecords} />
              </div>
              <div className="flex flex-col gap-2.5">
                {groups.map((group) => (
                  <ParticipantRecordGroupItem
                    key={group.participant.id}
                    group={group}
                    divisionName={
                      divisions.find((division) => division.id === group.participant.divisionId)?.name ??
                      "알 수 없는 부문"
                    }
                    isExpanded={expandedParticipantId === group.participant.id}
                    onToggle={() =>
                      setExpandedParticipantId((current) =>
                        current === group.participant.id ? null : group.participant.id
                      )
                    }
                  />
                ))}
              </div>
            </>
          )}
        </AdminNavShell>
      </PageContainer>
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <BarChart3 className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
