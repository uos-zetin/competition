import { cn } from "@/shared/lib";

export type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  fullScreen?: boolean;
};

const spinnerSizeClasses = {
  sm: "size-6 border-[3px]",
  md: "size-8 border-4",
  lg: "size-12 border-4",
  xl: "size-16 border-[5px]",
} as const;

export function LoadingSpinner({ size = "md", message = "", fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center gap-3" role="status">
      <div className={cn("animate-spin rounded-full border-border border-t-primary motion-reduce:[animation-duration:3s]", spinnerSizeClasses[size])} />
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <span className="sr-only">로딩 중</span>
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">{content}</div>;
  }

  return content;
}
