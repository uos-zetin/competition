import { Settings, Timer } from "lucide-react";

import type { User } from "@/entities/user";
import { AppHeader, PageContainer } from "@/widgets/layout";

import { HomeActionCard } from "./home-action-card";

type HomeDashboardProps = {
  user: User | null;
};

export function HomeDashboard({ user }: HomeDashboardProps) {
  const isAdmin = user?.roles.includes("administrator") ?? false;

  return (
    <>
      <AppHeader title="계수기 시스템" />
      <PageContainer maxWidth="lg" padding="md" className="py-8 sm:py-10">
        <div className="mb-10 text-center">
          <h2 className="mb-1.5 text-2xl font-bold">대시보드</h2>
          <p className="text-[0.95rem] text-muted-foreground">원하는 기능을 선택하세요</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <HomeActionCard
            icon={<Timer className="size-6" />}
            iconAccent="counter"
            title="계수기 선택"
            description="타이머 시작 및 기록 관리"
            to="/counter"
            ctaLabel="계수기 선택하기"
          />
          <HomeActionCard
            icon={<Settings className="size-6" />}
            iconAccent="admin"
            title="관리자 페이지"
            description="시스템 관리 및 설정"
            to="/admin"
            disabled={!isAdmin}
            ctaLabel={isAdmin ? "관리자 페이지 이동" : "관리자 권한 필요"}
          />
        </div>
      </PageContainer>
    </>
  );
}
