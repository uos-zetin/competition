import { Link } from "react-router";

import type { ReactNode } from "react";

import { Button } from "@/shared/ui";

type HomeActionCardProps = {
  icon: ReactNode;
  iconAccent: "counter" | "admin";
  title: string;
  description: string;
  to: string;
  disabled?: boolean;
  ctaLabel: string;
};

const iconAccentClasses = {
  counter: "bg-uos-blue text-white",
  admin: "bg-uos-emerald text-white",
} as const;

export function HomeActionCard({ icon, iconAccent, title, description, to, disabled = false, ctaLabel }: HomeActionCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-3.5">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-md ${iconAccentClasses[iconAccent]}`} aria-hidden="true">
          {icon}
        </div>
        <div>
          <h3 className="mb-0.5 text-[1.05rem] font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {disabled ? (
        <Button disabled variant="secondary" className="w-full">
          관리자 권한 필요
        </Button>
      ) : (
        <Button asChild className="w-full">
          <Link to={to}>{ctaLabel}</Link>
        </Button>
      )}
    </article>
  );
}
