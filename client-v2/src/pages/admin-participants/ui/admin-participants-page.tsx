import { useState } from "react";
import { useSearchParams } from "react-router";

import { Plus, UsersRound } from "lucide-react";

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import { competitionService } from "@/entities/competition";
import { divisionService } from "@/entities/division";
import {
  type Participant,
  ParticipantDeleteDialog,
  ParticipantFormDialog,
} from "@/entities/participant";
import { useAdminAuthorization } from "@/features/auth";
import { AdminNavShell } from "@/widgets/admin-layout";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { DivisionParticipantsSection } from "./division-participants-section";

export function AdminParticipantsPage() {
  const isAuthorized = useAdminAuthorization();
  const [searchParams, setSearchParams] = useSearchParams();
  const competitionId = searchParams.get("competitionId") ?? "";
  const competitions = competitionService.use.competitions();
  const divisions = divisionService.use.divisionsByCompetition(competitionId);
  const selectedCompetitionName = competitions.find((competition) => competition.id === competitionId)?.name ?? "알 수 없는 대회";
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant>();
  const [defaultDivisionId, setDefaultDivisionId] = useState<string>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingParticipant, setDeletingParticipant] = useState<Participant>();

  const openCreateDialog = (divisionId?: string) => {
    setEditingParticipant(undefined);
    setDefaultDivisionId(divisionId);
    setFormDialogOpen(true);
  };

  const openEditDialog = (participant: Participant) => {
    setDefaultDivisionId(undefined);
    setEditingParticipant(participant);
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (participant: Participant) => {
    setDeletingParticipant(participant);
    setDeleteDialogOpen(true);
  };

  if (!isAuthorized) return null;

  return (
    <>
      <AppHeader title="관리자 페이지" showBackButton backPath="/" />
      <PageContainer maxWidth="full" padding="md" className="py-8 sm:py-10">
        <AdminNavShell activeSection="participants">
          <div className="mb-[1.375rem] flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.375rem] font-bold">참가자 관리</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">참가자를 생성, 수정, 삭제할 수 있습니다</p>
            </div>
            <Button type="button" disabled={!competitionId} onClick={() => openCreateDialog()}>
              <Plus aria-hidden="true" />참가자 추가
            </Button>
          </div>

          <section className="mb-[1.375rem] flex flex-col gap-2.5 rounded-xl border bg-card px-5 py-4">
            <label className="text-[0.8125rem] font-medium" htmlFor="competition-select">대회 선택</label>
            <Select value={competitionId} onValueChange={(id) => setSearchParams(id ? { competitionId: id } : {})}>
              <SelectTrigger id="competition-select" className="h-9 max-w-md hover:border-primary">
                <SelectValue placeholder="대회를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                {competitions.map((competition) => (
                  <SelectItem key={competition.id} value={competition.id}>{competition.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {competitionId ? <p className="text-[0.8125rem] font-medium text-primary">선택된 대회: {selectedCompetitionName}</p> : null}
          </section>

          {!competitionId ? (
            <EmptyState title="대회를 선택해주세요" description="먼저 대회를 선택한 후 참가자를 관리할 수 있습니다." />
          ) : divisions.length === 0 ? (
            <EmptyState title="부문이 없습니다" description="선택된 대회에 아직 부문이 없습니다. 먼저 부문을 생성해주세요." />
          ) : (
            <div className="flex flex-col gap-9">
              {divisions.map((division) => (
                <DivisionParticipantsSection
                  key={division.id}
                  division={division}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  onCreateInDivision={openCreateDialog}
                />
              ))}
            </div>
          )}
        </AdminNavShell>
      </PageContainer>
      <ParticipantFormDialog
        divisions={divisions.map((division) => ({ id: division.id, name: division.name }))}
        participant={editingParticipant}
        defaultDivisionId={defaultDivisionId}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
      />
      {deletingParticipant ? (
        <ParticipantDeleteDialog participant={deletingParticipant} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      ) : null}
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center">
      <div className="mb-3 flex size-[3.25rem] items-center justify-center rounded-full bg-primary/10 text-primary">
        <UsersRound className="size-[26px]" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
