import { Component, type ErrorInfo, type ReactNode } from "react";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/shared/ui";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  public state: AppErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("[error-handling] render error", error, errorInfo);
    }
  }

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <section className="flex max-w-md flex-col items-center text-center">
          <AlertTriangle className="mb-5 size-12 text-destructive" aria-hidden="true" />
          <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            예상하지 못한 오류가 발생했습니다. 새로고침하거나 처음으로 돌아가 다시 시도해주세요.
          </p>
          <div className="mt-6 flex gap-2">
            <Button type="button" onClick={() => window.location.reload()}>
              새로고침
            </Button>
            <Button type="button" variant="outline" onClick={() => (window.location.href = "/")}>
              처음으로
            </Button>
          </div>
        </section>
      </main>
    );
  }
}
