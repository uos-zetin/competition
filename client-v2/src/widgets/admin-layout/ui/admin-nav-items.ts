import { Award, BarChart3, LayoutDashboard, List, type LucideIcon, UserCog, Users } from "lucide-react";

export type AdminNavSection = "dashboard" | "competitions" | "divisions" | "participants" | "records" | "users";

export type AdminNavItem = {
  id: AdminNavSection;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const adminNavItems: AdminNavItem[] = [
  { id: "dashboard", label: "대시보드", href: "/admin", icon: LayoutDashboard },
  { id: "competitions", label: "대회 관리", href: "/admin/competitions", icon: Award, description: "대회를 생성하고 설정합니다" },
  { id: "divisions", label: "부문 관리", href: "/admin/divisions", icon: List, description: "경연 부문을 구성합니다" },
  { id: "participants", label: "참가자 관리", href: "/admin/participants", icon: Users, description: "참가자를 등록하고 관리합니다" },
  { id: "records", label: "기록 관리", href: "/admin/records", icon: BarChart3, description: "기록을 확인하고 검토합니다" },
  { id: "users", label: "사용자 관리", href: "/admin/users", icon: UserCog, description: "사용자 계정과 권한을 관리합니다" },
];
