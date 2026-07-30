import { ShieldCheck, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui";

import type { User } from "../model";

import { UserRoleBadge } from "./user-role-badge";

interface UserCardProps {
  user: User;
  onEditRoles: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserCard({ user, onEditRoles, onDelete }: UserCardProps) {
  return (
    <article className="w-full rounded-xl border bg-card p-[18px_20px] text-card-foreground transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">{user.name}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.roles.length === 0 ? <UserRoleBadge /> : user.roles.map((role) => <UserRoleBadge key={role} role={role} />)}
          </div>
        </div>
        <div className="ml-2 flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="권한 수정" onClick={() => onEditRoles(user)}>
            <ShieldCheck />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive"
            aria-label="삭제"
            onClick={() => onDelete(user)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  );
}
