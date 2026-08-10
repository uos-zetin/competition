import type { LucideIcon } from "lucide-react";

export function RunnerRequiredCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          {title}
        </div>
      </header>
      <div className="flex flex-col items-center gap-1 rounded-b-xl px-3 py-5 text-center text-xs text-muted-foreground">
        <Icon className="size-5 opacity-55" aria-hidden="true" />
        <p className="font-semibold text-foreground">현재 참가자가 없습니다</p>
        <p>{description}</p>
      </div>
    </section>
  );
}
