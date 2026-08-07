import type { ReactNode } from "react";

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      <h2 className="border-b bg-muted px-[clamp(.5rem,1.2cqi,1rem)] py-[clamp(.25rem,.6cqi,.5rem)] text-center text-[clamp(.7rem,1.35cqi,1.1rem)] font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}
