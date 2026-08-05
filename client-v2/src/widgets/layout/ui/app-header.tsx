import { useNavigate } from "react-router";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/shared/ui";
import { authService } from "@/features/auth";

export type AppHeaderProps = {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  showLogout?: boolean;
};

export function AppHeader({ title, showBackButton = false, backPath = "/", showLogout = true }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user } = authService.use.auth();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3.5 text-card-foreground sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {showBackButton ? (
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              void navigate(backPath);
            }}
          >
            <ChevronLeft className="size-[18px]" aria-hidden="true" />
            뒤로
          </button>
        ) : null}
        <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-3.5">
        {user ? (
          <p className="hidden text-sm text-muted-foreground sm:block">
            안녕하세요, <strong className="font-semibold text-foreground">{user.name}</strong>님
          </p>
        ) : null}
        {showLogout ? (
          <Button type="button" variant="destructive" size="sm" onClick={() => void authService.auth.logout()}>
            로그아웃
          </Button>
        ) : null}
      </div>
    </header>
  );
}
