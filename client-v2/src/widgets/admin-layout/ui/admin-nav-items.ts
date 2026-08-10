import { Award, BarChart3, LayoutDashboard, List, type LucideIcon, UserCog, Users } from "lucide-react";

export type AdminNavSection = "dashboard" | "competitions" | "divisions" | "participants" | "records" | "users";

export type AdminNavItem = {
  id: AdminNavSection;
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { id: "dashboard", label: "대시보드", href: "/admin", icon: LayoutDashboard },
  { id: "competitions", label: "대회 관리", href: "/admin/competitions", icon: Award },
  { id: "divisions", label: "부문 관리", href: "/admin/divisions", icon: List },
  { id: "participants", label: "참가자 관리", href: "/admin/participants", icon: Users },
  { id: "records", label: "기록 관리", href: "/admin/records", icon: BarChart3 },
  { id: "users", label: "사용자 관리", href: "/admin/users", icon: UserCog },
];
