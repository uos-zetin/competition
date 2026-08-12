import { Timer } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-hidden="true">
        <Timer className="size-[1.4rem]" />
      </div>
      <span className="text-[0.95rem] font-bold tracking-[0.01em]">계수기 시스템</span>
    </div>
  );
}
