import { RefreshCw } from "lucide-react";

import { cn, formatRelativeTimeKo } from "@/shared/lib";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import type { CounterState } from "@/entities/counter";

import { CounterRunTag } from "./counter-run-tag";

type CounterPickerFieldProps = {
  counters: CounterState[];
  getDivisionName: (divisionId: string | null) => string;
  value: string;
  onChange: (counterId: string) => void;
  isLoading: boolean;
  isRefreshing: boolean;
  lastFetchedAt: Date | null;
  onRefresh: () => void;
};

export function CounterPickerField({
  counters,
  getDivisionName,
  value,
  onChange,
  isLoading,
  isRefreshing,
  lastFetchedAt,
  onRefresh,
}: CounterPickerFieldProps) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <label className="text-[0.8125rem] font-semibold" htmlFor="counter-selector">
          계수기 선택
        </label>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto gap-1 px-1 text-xs text-primary hover:bg-transparent hover:text-primary/70"
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} aria-hidden="true" />
            새로고침
          </Button>
          {lastFetchedAt ? (
            <span className="text-xs text-muted-foreground">마지막 조회: {formatRelativeTimeKo(lastFetchedAt)}</span>
          ) : null}
        </div>
      </div>
      {!isLoading && counters.length === 0 ? (
        <p className="py-5 text-center text-sm text-muted-foreground">사용 가능한 계수기가 없습니다</p>
      ) : (
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger id="counter-selector" className="h-11 hover:border-primary">
            <SelectValue placeholder={isLoading ? "계수기 목록을 불러오는 중…" : "계수기를 선택하세요"} />
          </SelectTrigger>
          <SelectContent className="w-[var(--radix-select-trigger-width)]">
            <p className="px-2 py-1.5 text-[0.6875rem] font-semibold tracking-[0.04em] text-muted-foreground">
              사용 가능한 계수기
            </p>
            {counters.map((counter) => (
              <SelectItem key={counter.id} value={counter.id} className="py-2 pr-8">
                <div className="flex w-full min-w-0 items-center justify-between gap-3 pr-2">
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-medium">{counter.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {getDivisionName(counter.divisionId)}
                    </p>
                  </div>
                  <CounterRunTag startedAt={counter.startedAt} stoppedAt={counter.stoppedAt} />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
