import { Clock, Play, Timer } from "lucide-react";

import { Button } from "@/shared/ui";

type CounterFeatureListProps = {
  isAdministrator: boolean;
  isManualRecorder: boolean;
  selectedCounterId: string;
  onNavigate: (feature: "controller" | "timer" | "manual-counter") => void;
};

const featureClassName =
  "h-auto w-full justify-start gap-4 px-4 py-3.5 text-left hover:border-primary hover:bg-muted hover:text-foreground";

export function CounterFeatureList({
  isAdministrator,
  isManualRecorder,
  selectedCounterId,
  onNavigate,
}: CounterFeatureListProps) {
  const disabled = !selectedCounterId;

  if (!isAdministrator && !isManualRecorder) {
    return (
      <div className="py-7 text-center text-muted-foreground">
        <p className="mb-1.5 text-[0.9375rem] font-medium text-foreground">
          현재 권한으로는 사용할 수 있는 기능이 없습니다.
        </p>
        <p className="text-[0.8125rem]">관리자에게 문의하여 적절한 권한을 부여받으세요.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5">
      {isAdministrator ? (
        <>
          <FeatureButton
            icon={<Play className="size-5" />}
            accent="bg-primary/10 text-primary"
            title="컨트롤러"
            description="경기 진행 및 제어"
            disabled={disabled}
            onClick={() => onNavigate("controller")}
          />
          <FeatureButton
            icon={<Clock className="size-5" />}
            accent="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            title="타이머"
            description="타이머 표시 화면"
            disabled={disabled}
            onClick={() => onNavigate("timer")}
          />
        </>
      ) : null}
      {isAdministrator || isManualRecorder ? (
        <FeatureButton
          icon={<Timer className="size-5" />}
          accent="bg-amber-500/10 text-amber-700 dark:text-amber-300"
          title="수동 계수"
          description="수동으로 기록 입력"
          disabled={disabled}
          onClick={() => onNavigate("manual-counter")}
        />
      ) : null}
    </div>
  );
}

function FeatureButton({
  icon,
  accent,
  title,
  description,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
  description: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="outline" className={featureClassName} disabled={disabled} onClick={onClick}>
      <span className={`flex size-10 shrink-0 items-center justify-center rounded ${accent}`} aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="block text-[0.9375rem] font-semibold">{title}</span>
        <span className="mt-0.5 block text-[0.8125rem] font-normal text-muted-foreground">{description}</span>
      </span>
    </Button>
  );
}
