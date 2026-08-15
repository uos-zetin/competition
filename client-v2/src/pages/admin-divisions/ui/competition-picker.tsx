import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import type { Competition } from "@/entities/competition";

type CompetitionPickerProps = {
  competitions: Competition[];
  value: string;
  onChange: (id: string) => void;
};

export function CompetitionPicker({ competitions, value, onChange }: CompetitionPickerProps) {
  return (
    <section className="mb-[1.375rem] flex flex-col gap-2.5 rounded-xl border bg-card px-5 py-4">
      <label className="text-[0.8125rem] font-medium" htmlFor="competition-select">
        대회 선택
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="competition-select" className="h-9 max-w-md hover:border-primary">
          <SelectValue placeholder="대회를 선택하세요" />
        </SelectTrigger>
        <SelectContent className="w-[var(--radix-select-trigger-width)]">
          {competitions.map((competition) => (
            <SelectItem key={competition.id} value={competition.id}>
              {competition.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
