import { useEffect, useState } from "react";

import { Plus, UsersRound } from "lucide-react";

import { Button } from "@/shared/ui";
import {
  type User,
  UserCard,
  UserCreateDialog,
  UserDeleteDialog,
  UserEditRolesDialog,
  userService,
} from "@/entities/user";
import { useAdminAuthorization } from "@/features/auth";
import { errorHandlingService } from "@/features/error-handling";
import { AdminNavShell } from "@/widgets/admin-layout";
import { AppHeader, PageContainer } from "@/widgets/layout";

export function AdminUsersPage() {
  const isAuthorized = useAdminAuthorization();
  const users = userService.use.users();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthorized) return;
    void userService.load.all().catch((error) => errorHandlingService.handle(error, "사용자 목록을 불러오는데 실패했습니다"));
  }, [isAuthorized]);

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  if (!isAuthorized) return null;

  return (
    <>
      <AppHeader title="관리자 페이지" showBackButton backPath="/" />
      <PageContainer maxWidth="full" padding="md" className="py-8 sm:py-10">
        <AdminNavShell activeSection="users">
          <div className="mb-[1.375rem] flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.375rem] font-bold">사용자 관리</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">사용자를 생성, 권한 수정, 삭제할 수 있습니다</p>
            </div>
            <Button type="button" onClick={() => setCreateDialogOpen(true)}>
              <Plus aria-hidden="true" />사용자 추가
            </Button>
          </div>

          {users.length === 0 ? (
            <EmptyState
              title="사용자가 없습니다"
              description="새로운 사용자를 생성해보세요."
              onCreate={() => setCreateDialogOpen(true)}
            />
          ) : (
            <div className="flex flex-col gap-[0.9rem]">
              {users.map((user) => (
                <UserCard key={user.id} user={user} onEditRoles={openEditDialog} onDelete={openDeleteDialog} />
              ))}
            </div>
          )}
        </AdminNavShell>
      </PageContainer>
      <UserCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      {editingUser ? <UserEditRolesDialog user={editingUser} open={editDialogOpen} onOpenChange={setEditDialogOpen} /> : null}
      {deletingUser ? <UserDeleteDialog user={deletingUser} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} /> : null}
    </>
  );
}

function EmptyState({ title, description, onCreate }: { title: string; description: string; onCreate: () => void }) {
  return (
    <section className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center">
      <div className="mb-3 flex size-[3.25rem] items-center justify-center rounded-full bg-primary/10 text-primary">
        <UsersRound className="size-[26px]" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onCreate}>
        <Plus aria-hidden="true" />첫 번째 사용자 생성하기
      </Button>
    </section>
  );
}
