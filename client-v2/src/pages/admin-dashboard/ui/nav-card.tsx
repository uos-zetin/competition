import { Link } from "react-router";

import { ChevronRight, type LucideIcon } from "lucide-react";

type NavCardProps = {
  id: "dashboard" | "competitions" | "divisions" | "participants" | "records" | "users";
  icon: LucideIcon;
  title: string;
  description?: string;
  to: string;
};

const accentClasses: Record<NavCardProps["id"], string> = {
  dashboard: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  competitions: "bg-uos-blue-light/20 text-uos-blue group-hover:bg-uos-blue-light group-hover:text-white",
  divisions: "bg-uos-emerald/15 text-uos-emerald group-hover:bg-uos-emerald group-hover:text-white",
  participants: "bg-violet-500/15 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
  records: "bg-amber-400/20 text-amber-700 group-hover:bg-amber-500 group-hover:text-white",
  users: "bg-slate-500/15 text-slate-600 group-hover:bg-slate-600 group-hover:text-white",
};

export function NavCard({ id, icon: Icon, title, description, to }: NavCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3.5 rounded-lg border bg-card p-5 text-card-foreground transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg"
    >
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-md transition-colors ${accentClasses[id]}`}>
        <Icon className="size-[22px]" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2.5 pt-0.5">
        <div className="min-w-0">
          <h3 className="text-[0.9375rem] font-bold">{title}</h3>
          {description ? <p className="mt-1 text-[0.8125rem] leading-snug text-muted-foreground">{description}</p> : null}
        </div>
        <ChevronRight className="size-[18px] shrink-0 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
      </div>
    </Link>
  );
}
