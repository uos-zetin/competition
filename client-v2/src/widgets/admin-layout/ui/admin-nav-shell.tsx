import { Link } from "react-router";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

import { adminNavItems, type AdminNavSection } from "./admin-nav-items";

export type { AdminNavSection } from "./admin-nav-items";

type AdminNavShellProps = {
  activeSection: AdminNavSection;
  children: ReactNode;
};

const dashboardItem = adminNavItems[0];
const managementItems = adminNavItems.slice(1);

function getNavItemClassName(isActive: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  );
}

export function AdminNavShell({ activeSection, children }: AdminNavShellProps) {
  return (
    <div className="flex flex-col items-stretch lg:flex-row lg:items-stretch">
      <nav aria-label="관리자 메뉴" className="hidden w-[228px] shrink-0 flex-col gap-0.5 border-r bg-card p-3 lg:flex">
        <Link
          to={dashboardItem.href}
          className={getNavItemClassName(activeSection === dashboardItem.id)}
          aria-current={activeSection === dashboardItem.id ? "page" : undefined}
        >
          <dashboardItem.icon className="size-[17px] shrink-0" aria-hidden="true" />
          {dashboardItem.label}
        </Link>
        <div className="mx-0.5 my-2 h-px bg-border" />
        <p className="px-2.5 pb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">관리 기능</p>
        {managementItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <Link key={item.id} to={item.href} className={getNavItemClassName(isActive)} aria-current={isActive ? "page" : undefined}>
              <Icon className="size-[17px] shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav aria-label="관리자 메뉴" className="flex gap-1.5 overflow-x-auto border-b bg-card p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="min-w-0 flex-1 p-5 sm:p-7 lg:pb-10">{children}</main>
    </div>
  );
}
