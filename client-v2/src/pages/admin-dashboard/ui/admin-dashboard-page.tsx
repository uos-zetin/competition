import { useAdminAuthorization } from "@/features/auth";
import { adminNavItems, AdminNavShell } from "@/widgets/admin-layout";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { NavCard } from "./nav-card";

export function AdminDashboardPage() {
  const isAuthorized = useAdminAuthorization();

  if (!isAuthorized) return null;

  return (
    <>
      <AppHeader title="관리자 페이지" showBackButton backPath="/" />
      <PageContainer maxWidth="full" padding="md" className="py-8 sm:py-10">
        <AdminNavShell activeSection="dashboard">
          <div className="mb-7">
            <h2 className="text-[1.375rem] font-bold">대시보드</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">원하는 관리 기능을 선택하세요</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminNavItems.slice(1).map((item) => (
              <NavCard key={item.id} id={item.id} icon={item.icon} title={item.label} description={item.description} to={item.href} />
            ))}
          </div>
        </AdminNavShell>
      </PageContainer>
    </>
  );
}
