import { useMemo, useState } from "react";

import { CircleAlert, Clock, Pause, Play } from "lucide-react";

import { Button, Input, TimeDisplay } from "@/shared/ui";
import { formatMsToTime, getStatus, integrateLogs, useCountdownTimer } from "@/entities/timer";
// Error handling is the architecture's designated cross-cutting feature exception.
// eslint-disable-next-line fsd/forbidden-imports, fsd/no-cross-slice-dependency
import { errorHandlingService } from "@/features/error-handling";

import { timerControlService } from "../model";

interface TimerControlPanelProps {
  participantId: string;
  timerLogs: Parameters<typeof integrateLogs>[1];
  timeLimitMs: number;
}

export function TimerControlPanel({ participantId, timerLogs, timeLimitMs }: TimerControlPanelProps) {
  const [customValue, setCustomValue] = useState("");
  const timerState = useMemo(() => integrateLogs(timeLimitMs, timerLogs), [timeLimitMs, timerLogs]);
  const remainingMs = useCountdownTimer(timerState);
  const status = getStatus(timerState);

  const handleStart = async () => {
    try {
      await timerControlService.control.start(participantId);
    } catch (error) {
      errorHandlingService.handle(error, "타이머 시작에 실패했습니다");
    }
  };

  const handleStop = async () => {
    try {
      await timerControlService.control.stop(participantId);
    } catch (error) {
      errorHandlingService.handle(error, "타이머 정지에 실패했습니다");
    }
  };

  const handleAdjust = async (type: "add" | "sub", value: number) => {
    try {
      await timerControlService.control.adjust(participantId, type, value);
    } catch (error) {
      errorHandlingService.handle(error, "시간 조정에 실패했습니다");
    }
  };

  const handleCustomAdjust = () => {
    const value = Number.parseInt(customValue, 10);
    if (Number.isNaN(value) || value === 0) {
      errorHandlingService.handle(new Error("Invalid time adjustment"), "올바른 시간 값을 입력해주세요 (0이 아닌 숫자)");
      return;
    }

    void handleAdjust(value > 0 ? "add" : "sub", Math.abs(value) * 1_000);
    setCustomValue("");
  };

  const statusContent = {
    stopped: {
      icon: Clock,
      label: "정지",
      className: "border-border bg-muted text-muted-foreground",
    },
    running: {
      icon: Play,
      label: "실행 중",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    finished: {
      icon: CircleAlert,
      label: "시간 종료",
      className: "border-destructive/30 bg-destructive/10 text-destructive",
    },
  }[status];
  const StatusIcon = statusContent.icon;

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
          타이머 제어
        </div>
      </header>
      <div className="flex flex-col gap-4 p-4">
        <TimeDisplay value={formatMsToTime(remainingMs)} />
        <div className="flex justify-center">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${statusContent.className}`}>
            {status === "running" ? <span className="size-1.5 animate-pulse rounded-full bg-current motion-reduce:animate-none" /> : null}
            <StatusIcon className="size-3.5" aria-hidden="true" />
            {statusContent.label}
          </span>
        </div>
        <div className="grid grid-cols-3 divide-x rounded-lg border bg-muted/30 text-center">
          <div className="min-w-0 px-2 py-2.5">
            <p className="text-[11px] text-muted-foreground">제한 시간</p>
            <p className="mt-1 truncate text-xs font-semibold tabular-nums">{formatMsToTime(timeLimitMs)}</p>
          </div>
          <div className="min-w-0 px-2 py-2.5">
            <p className="text-[11px] text-muted-foreground">누적 시간</p>
            <p className="mt-1 truncate text-xs font-semibold tabular-nums">{formatMsToTime(timerState.accumulatedMs)}</p>
          </div>
          <div className="min-w-0 px-2 py-2.5">
            <p className="text-[11px] text-muted-foreground">시간 조정</p>
            <p className="mt-1 truncate text-xs font-semibold tabular-nums">
              {timerState.offsetMs >= 0 ? "+" : "-"}
              {formatMsToTime(Math.abs(timerState.offsetMs))}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" disabled={timerState.startedAt !== null} onClick={() => void handleStart()}>
            <Play aria-hidden="true" />
            시작
          </Button>
          <Button type="button" variant="destructive" disabled={timerState.startedAt === null} onClick={() => void handleStop()}>
            <Pause aria-hidden="true" />
            정지
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button type="button" variant="outline" onClick={() => void handleAdjust("sub", 10_000)}>
            −10초
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleAdjust("sub", 1_000)}>
            −1초
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleAdjust("add", 1_000)}>
            +1초
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleAdjust("add", 10_000)}>
            +10초
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="±s (예: 50, -30)"
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            aria-label="직접 시간 조정(초)"
          />
          <Button type="button" variant="outline" disabled={!customValue || customValue === "0"} onClick={handleCustomAdjust}>
            적용
          </Button>
        </div>
      </div>
    </section>
  );
}
