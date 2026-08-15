import { progressService } from "@/features/progress";

export function DivisionInfo() {
  const division = progressService.use.division();
  return <p className="text-[clamp(1.3rem,4.6cqi,4rem)] font-extrabold tracking-tight">{division?.name ?? "—"}</p>;
}
