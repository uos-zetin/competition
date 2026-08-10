import { useEffect, useState } from "react";

import { FileText, Plus } from "lucide-react";

import { Button } from "@/shared/ui";
import {
  type Competition,
  CompetitionDeleteDialog,
  CompetitionFormDialog,
  competitionService,
} from "@/entities/competition";
import { useAdminAuthorization } from "@/features/auth";
import { CsvImportDialog } from "@/features/csv-to-competition";
import { errorHandlingService } from "@/features/error-handling";
import { AdminNavShell } from "@/widgets/admin-layout";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { CompetitionList } from "./competition-list";

export function AdminCompetitionsPage() {
  const isAuthorized = useAdminAuthorization();
  const competitions = competitionService.use.competitions();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCompetition, setDeletingCompetition] = useState<Competition>();
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthorized) return;
    void competitionService.load().catch((error) => errorHandlingService.handle(error, "대회 목록을 불러오는데 실패했습니다"));
  }, [isAuthorized]);

  const openCreateDialog = () => {
    setEditingCompetition(undefined);
    setFormDialogOpen(true);
  };

  const openEditDialog = (competition: Competition) => {
    setEditingCompetition(competition);
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (competition: Competition) => {
    setDeletingCompetition(competition);
    setDeleteDialogOpen(true);
  };

  if (!isAuthorized) return null;

  return (
    <>
      <AppHeader title="관리자 페이지" showBackButton backPath="/" />
      <PageContainer maxWidth="full" padding="md" className="py-8 sm:py-10">
        <AdminNavShell activeSection="competitions">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.375rem] font-bold">대회 관리</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">대회를 생성, 수정, 삭제할 수 있습니다</p>
            </div>
            <div className="flex shrink-0 gap-2.5">
              <Button type="button" variant="outline" onClick={() => setCsvDialogOpen(true)}>
                <FileText aria-hidden="true" />CSV로 가져오기
              </Button>
              <Button type="button" onClick={openCreateDialog}>
                <Plus aria-hidden="true" />대회 생성
              </Button>
            </div>
          </div>
          <CompetitionList competitions={competitions} onEdit={openEditDialog} onDelete={openDeleteDialog} onCreate={openCreateDialog} />
        </AdminNavShell>
      </PageContainer>
      <CompetitionFormDialog competition={editingCompetition} open={formDialogOpen} onOpenChange={setFormDialogOpen} />
      {deletingCompetition ? (
        <CompetitionDeleteDialog competition={deletingCompetition} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      ) : null}
      <CsvImportDialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen} />
    </>
  );
}
