import { type ReactNode, useState } from "react";
import { useSearchParams } from "react-router";

import { List, Plus } from "lucide-react";

import { Button } from "@/shared/ui";
import { competitionService } from "@/entities/competition";
import {
  type Division,
  DivisionCard,
  DivisionDeleteDialog,
  DivisionFormDialog,
  divisionService,
} from "@/entities/division";
import { useAdminAuthorization } from "@/features/auth";
import { PromoteParticipantsDialog } from "@/features/participant-promotion";
import { AdminNavShell } from "@/widgets/admin-layout";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { CompetitionPicker } from "./competition-picker";

type CreatingForCompetition = {
  id: string;
  name: string;
};

export function AdminDivisionsPage() {
  const isAuthorized = useAdminAuthorization();
  const [searchParams, setSearchParams] = useSearchParams();
  const competitionId = searchParams.get("competitionId") ?? "";
  const competitions = competitionService.use.competitions();
  const divisions = divisionService.use.divisionsByCompetition(competitionId);
  const selectedCompetitionName =
    competitions.find((competition) => competition.id === competitionId)?.name ?? "알 수 없는 대회";
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [creatingForCompetition, setCreatingForCompetition] = useState<CreatingForCompetition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDivision, setDeletingDivision] = useState<Division | null>(null);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);

  const openCreateDialog = () => {
    if (!competitionId) return;

    setEditingDivision(null);
    setCreatingForCompetition({ id: competitionId, name: selectedCompetitionName });
    setFormDialogOpen(true);
  };

  const openEditDialog = (division: Division) => {
    setEditingDivision(division);
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (division: Division) => {
    setDeletingDivision(division);
    setDeleteDialogOpen(true);
  };

  if (!isAuthorized) return null;

  return (
    <>
      <AppHeader title="관리자 페이지" showBackButton backPath="/" />
      <PageContainer maxWidth="full" padding="md" className="py-8 sm:py-10">
        <AdminNavShell activeSection="divisions">
          <div className="mb-[1.375rem] flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.375rem] font-bold">부문 관리</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">부문을 생성, 수정, 삭제할 수 있습니다</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={!competitionId} onClick={openCreateDialog}>
                <Plus aria-hidden="true" />
                부문 생성
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!competitionId || divisions.length <= 1}
                onClick={() => setPromotionDialogOpen(true)}
              >
                기존 부문에서 선택해서 만들기
              </Button>
            </div>
          </div>

          <CompetitionPicker
            competitions={competitions}
            value={competitionId}
            onChange={(id) => setSearchParams(id ? { competitionId: id } : {})}
          />

          {!competitionId ? (
            <EmptyState title="대회를 선택해주세요" description="먼저 대회를 선택한 후 부문을 관리할 수 있습니다." />
          ) : divisions.length === 0 ? (
            <EmptyState
              title="부문이 없습니다"
              description="선택된 대회에 아직 부문이 없습니다. 새로운 부문을 생성해보세요."
              action={
                <Button type="button" variant="outline" onClick={openCreateDialog}>
                  <Plus aria-hidden="true" />첫 번째 부문 생성하기
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col gap-3.5">
              {divisions.map((division) => (
                <DivisionCard
                  key={division.id}
                  division={division}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>
          )}
        </AdminNavShell>
      </PageContainer>
      {editingDivision ? (
        <DivisionFormDialog division={editingDivision} open={formDialogOpen} onOpenChange={setFormDialogOpen} />
      ) : creatingForCompetition ? (
        <DivisionFormDialog
          competitionId={creatingForCompetition.id}
          competitionName={creatingForCompetition.name}
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
        />
      ) : null}
      {deletingDivision ? (
        <DivisionDeleteDialog division={deletingDivision} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      ) : null}
      {competitionId ? (
        <PromoteParticipantsDialog
          competitionId={competitionId}
          open={promotionDialogOpen}
          onOpenChange={setPromotionDialogOpen}
        />
      ) : null}
    </>
  );
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <section className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <List className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
