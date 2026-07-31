import { useEffect, useState } from "react";

import { env } from "@/shared/config/env";
import { Button } from "@/shared/ui";
import { UserRoleBadge, userService } from "@/entities/user";

import { authService } from "../model/auth-service";

function getRoleLabel(roleCount: number, isAdministrator: boolean): string {
  if (isAdministrator) return "관리자";
  return roleCount > 0 ? "계수자" : "역할 없음";
}

export function AuthDebugWidget() {
  const [expanded, setExpanded] = useState(false);
  const { user, isAuthenticated } = authService.use.auth();
  const users = userService.use.users();

  useEffect(() => {
    if (env.useMocks) void userService.load.all();
  }, []);

  if (!env.useMocks) return null;

  const roleLabel = getRoleLabel(user?.roles.length ?? 0, user?.roles.includes("administrator") ?? false);

  if (!expanded) {
    return (
      <button
        type="button"
        className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm font-medium shadow-md"
        onClick={() => setExpanded(true)}
      >
        <span className={isAuthenticated ? "size-2 rounded-full bg-emerald-500" : "size-2 rounded-full bg-muted-foreground"} />
        {user ? `${user.name} · ${roleLabel}` : "로그아웃 상태"}
      </button>
    );
  }

  return (
    <section className="fixed right-4 bottom-4 z-50 w-80 rounded-xl border bg-card p-4 shadow-lg">
      <button type="button" className="mb-4 text-left text-sm font-bold" onClick={() => setExpanded(false)}>
        인증 디버그
      </button>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-bold">{user?.name.slice(0, 1) ?? "-"}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{user?.name ?? "로그아웃 상태"}</p>
          {user ? <p className="truncate font-mono text-xs text-muted-foreground">{user.id}</p> : null}
        </div>
      </div>
      <hr className="my-4 border-border" />
      <p className="mb-2 text-xs font-semibold text-muted-foreground">MOCK 사용자로 전환</p>
      <div className="grid gap-1">
        {users.map((item) => {
          const active = item.id === user?.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm ${active ? "bg-secondary" : "hover:bg-muted"}`}
              onClick={() => authService.debug.switchToMockUser(item)}
            >
              <span className="font-medium">{item.name}</span>
              <span className="flex flex-wrap justify-end gap-1">
                {item.roles.length > 0 ? item.roles.map((role) => <UserRoleBadge key={role} role={role} />) : <UserRoleBadge />}
              </span>
            </button>
          );
        })}
      </div>
      <hr className="my-4 border-border" />
      <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => void authService.auth.logout()}>
        로그아웃 상태로 전환
      </Button>
    </section>
  );
}
