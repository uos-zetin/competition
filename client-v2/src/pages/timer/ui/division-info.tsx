import { progressService } from "@/features/progress";

export function DivisionInfo() {
  const division = progressService.use.division();
  return <p className="text-[clamp(1rem,3cqi,2.6rem)] font-extrabold tracking-tight">{division?.name ?? "—"}</p>;
}
