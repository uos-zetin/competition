import { Timer } from "lucide-react";

import { LoginForm } from "@/features/auth";

export function HomeLoginScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-hidden="true">
            <Timer className="size-[1.4rem]" />
          </div>
          <span className="text-[0.95rem] font-bold tracking-[0.01em]">계수기 시스템</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
