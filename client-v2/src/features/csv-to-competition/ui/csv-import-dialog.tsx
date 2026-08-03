import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@/shared/ui";
import { MAX_TIME_LIMIT_SECONDS } from "@/entities/division";

import { OPTIONAL_HEADERS, REQUIRED_HEADERS } from "../lib/parse-csv";
import { csvImportService } from "../model/csv-import-service";
import type {
  CsvImportEdits,
  CsvImportRunResult,
  CsvParseError,
  CsvParseResult,
  DivisionSettingInput,
} from "../model/types";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };
type Step = "upload" | "competition" | "divisions" | "processing" | "result";

function outcomeLabel(status: string) {
  return status === "success" ? "생성 완료" : status === "failed" ? "실패" : "건너뜀";
}
function outcomeError(outcome: { status: string; error?: string; reason?: string }) {
  return outcome.error ?? outcome.reason ?? "";
}
const participantFieldLabels = {
  name: "이름",
  teamName: "소속",
  robotName: "로봇 이름",
  orderRaw: "참가 순번",
  comment: "하고 싶은 말",
} as const;

export function CsvImportDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<CsvParseResult>();
  const [parseError, setParseError] = useState<CsvParseError>();
  const [description, setDescription] = useState("");
  const [settings, setSettings] = useState<DivisionSettingInput[]>([]);
  const [result, setResult] = useState<CsvImportRunResult>();
  const [busy, setBusy] = useState(false);
  const [edits, setEdits] = useState<CsvImportEdits>({});
  const reset = () => {
    setStep("upload");
    setParsed(undefined);
    setParseError(undefined);
    setDescription("");
    setSettings([]);
    setResult(undefined);
    setEdits({});
  };
  const close = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    try {
      const value = await csvImportService.parse(file);
      setParsed(value);
      setParseError(undefined);
      setStep("competition");
    } catch (cause) {
      setParseError(cause as CsvParseError);
    }
  };
  const beginSettings = () => {
    if (!parsed) return;
    setSettings(parsed.divisionGroups.map((group) => ({ groupId: group.groupId, description: "", timeLimit: 180 })));
    setStep("divisions");
  };
  const run = async () => {
    if (!parsed) return;
    setBusy(true);
    setStep("processing");
    setResult(await csvImportService.run(parsed, { competitionDescription: description, divisionSettings: settings }));
    setStep("result");
    setBusy(false);
  };
  const retry = async () => {
    if (!parsed || !result) return;
    setBusy(true);
    setStep("processing");
    setResult(
      await csvImportService.retry(
        result,
        parsed,
        { competitionDescription: description, divisionSettings: settings },
        edits
      )
    );
    setStep("result");
    setBusy(false);
  };
  const updateParticipant = (rowId: string, field: string, value: string) =>
    setEdits((current) => ({
      ...current,
      participantFields: {
        ...current.participantFields,
        [rowId]: { ...current.participantFields?.[rowId], [field]: value },
      },
    }));
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CSV로 대회 만들기</DialogTitle>
          <DialogDescription>업로드 · 대회 정보 · 부문 설정 · 결과</DialogDescription>
        </DialogHeader>
        {step === "upload" && (
          <div className="space-y-4">
            <Label
              htmlFor="csv-file"
              className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center"
            >
              CSV 파일을 선택하거나 여기에 놓으세요
              <Input
                id="csv-file"
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(event) => {
                  void upload(event.target.files?.[0]);
                }}
              />
            </Label>
            <div className="rounded-md bg-muted p-3 text-xs">
              <p className="font-semibold">CSV 형식 안내</p>
              <p>필수 열: {REQUIRED_HEADERS.join(", ")}</p>
              <p>선택 열: {OPTIONAL_HEADERS.join(", ")}</p>
              {parseError && (
                <p className="mt-2 text-destructive">
                  {parseError.message}
                  {parseError.missingHeaders ? `: ${parseError.missingHeaders.join(", ")}` : ""}
                  {parseError.invalidRowNumbers ? ` (행 ${parseError.invalidRowNumbers.join(", ")})` : ""}
                </p>
              )}
            </div>
          </div>
        )}
        {step === "competition" && parsed && (
          <div className="space-y-4">
            <div className="rounded-md border p-4 text-sm">
              <p>
                <b>대회명:</b> {parsed.competitionName}
              </p>
              <p>
                <b>참가자:</b> {parsed.totalParticipantCount}명 · <b>부문:</b> {parsed.divisionGroups.length}개
              </p>
              <p className="mt-2 text-muted-foreground">
                {parsed.divisionGroups.map((group) => group.divisionName).join(", ")}
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="competition-description">대회 설명</Label>
              <Textarea
                id="competition-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="대회 설명을 입력하세요"
              />
            </div>
          </div>
        )}
        {step === "divisions" && parsed && (
          <div className="space-y-3">
            {parsed.divisionGroups.map((group, index) => (
              <div className="rounded-md border p-3" key={group.groupId}>
                <p className="mb-2 text-sm font-semibold">
                  {group.divisionName}{" "}
                  <span className="font-normal text-muted-foreground">({group.participants.length}명)</span>
                </p>
                <div className="grid gap-1.5">
                  <Label htmlFor={`division-description-${group.groupId}`} className="text-xs">
                    설명
                  </Label>
                  <Textarea
                    id={`division-description-${group.groupId}`}
                    value={settings[index]?.description ?? ""}
                    onChange={(event) =>
                      setSettings((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, description: event.target.value } : item
                        )
                      )
                    }
                  />
                </div>
                <div className="mt-2 grid gap-1.5">
                  <Label htmlFor={`division-time-limit-${group.groupId}`} className="text-xs">
                    제한 시간(초, 최대 {MAX_TIME_LIMIT_SECONDS})
                  </Label>
                  <Input
                    id={`division-time-limit-${group.groupId}`}
                    type="number"
                    min={1}
                    max={MAX_TIME_LIMIT_SECONDS}
                    value={settings[index]?.timeLimit ?? 180}
                    onChange={(event) =>
                      setSettings((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, timeLimit: Number(event.target.value) } : item
                        )
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {step === "processing" && parsed && (
          <div className="space-y-4">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
            </div>
            <p className="text-sm font-semibold">대회 정보를 등록하고 있습니다</p>
            <ul className="space-y-2 rounded-md border p-4 text-sm text-muted-foreground">
              <li>진행 중 · 대회 생성</li>
              <li>대기 중 · {parsed.divisionGroups.length}개 부문 생성</li>
              <li>대기 중 · {parsed.totalParticipantCount}명 참가자 생성</li>
            </ul>
            <p className="text-xs text-muted-foreground">등록이 끝나면 결과를 안내합니다. 창을 닫지 마세요.</p>
          </div>
        )}
        {step === "result" && result && (
          <div className="space-y-4 text-sm">
            <p className="font-semibold">처리 결과</p>
            <p>
              대회: {outcomeLabel(result.competition.status)} · 부문:{" "}
              {result.divisions.filter((item) => item.outcome.status === "success").length}/{result.divisions.length} ·
              참가자: {result.participants.filter((item) => item.outcome.status === "success").length}/
              {result.participants.length}
            </p>
            {result.competition.status === "failed" && (
              <div className="grid gap-1.5">
                <Label htmlFor="failed-competition-name">대회 이름</Label>
                <Input
                  id="failed-competition-name"
                  value={edits.competitionName ?? parsed?.competitionName ?? ""}
                  onChange={(event) => setEdits((value) => ({ ...value, competitionName: event.target.value }))}
                />
                <span className="text-destructive">{result.competition.error}</span>
              </div>
            )}
            {result.divisions
              .filter((item) => item.outcome.status !== "success")
              .map((item) => (
                <div className="grid gap-1.5" key={item.groupId}>
                  <Label htmlFor={`failed-division-name-${item.groupId}`}>부문 이름</Label>
                  <Input
                    id={`failed-division-name-${item.groupId}`}
                    value={edits.divisionNames?.[item.groupId] ?? item.divisionName}
                    onChange={(event) =>
                      setEdits((value) => ({
                        ...value,
                        divisionNames: { ...value.divisionNames, [item.groupId]: event.target.value },
                      }))
                    }
                  />
                  <span className="text-destructive">{outcomeError(item.outcome)}</span>
                </div>
              ))}
            {result.participants
              .filter((item) => item.outcome.status !== "success")
              .map((item) => (
                <div className="rounded-md border border-destructive/30 p-3" key={item.row.rowId}>
                  <p className="mb-2">
                    참가자 {item.row.name}: <span className="text-destructive">{outcomeError(item.outcome)}</span>
                  </p>
                  {(["name", "teamName", "robotName", "orderRaw", "comment"] as const).map((field) => (
                    <div className="mb-1 grid gap-1.5" key={field}>
                      <Label className="text-xs" htmlFor={`failed-participant-${item.row.rowId}-${field}`}>
                        {participantFieldLabels[field]}
                      </Label>
                      <Input
                        id={`failed-participant-${item.row.rowId}-${field}`}
                        value={edits.participantFields?.[item.row.rowId]?.[field] ?? item.row[field]}
                        onChange={(event) => updateParticipant(item.row.rowId, field, event.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            {result.participants.every((item) => item.outcome.status === "success") &&
              result.divisions.every((item) => item.outcome.status === "success") &&
              result.competition.status === "success" && (
                <p className="rounded-md bg-emerald-500/10 p-3 text-emerald-700">
                  대회, 부문, 참가자 등록이 모두 완료되었습니다.
                </p>
              )}
            <p className="text-xs text-muted-foreground">
              값을 수정한 항목은 수정된 값으로, 그대로 둔 항목은 같은 값으로 다시 시도합니다.
            </p>
          </div>
        )}
        <DialogFooter>
          {(step === "competition" || step === "divisions") && (
            <Button variant="outline" onClick={() => setStep(step === "competition" ? "upload" : "competition")}>
              이전
            </Button>
          )}
          {step === "competition" && <Button onClick={beginSettings}>다음</Button>}
          {step === "divisions" && (
            <Button
              onClick={() => {
                void run();
              }}
              disabled={busy}
            >
              가져오기
            </Button>
          )}
          {step === "result" && (
            <>
              <Button variant="outline" onClick={() => close(false)}>
                닫기
              </Button>
              {!result ||
              result.competition.status !== "success" ||
              result.divisions.some((item) => item.outcome.status !== "success") ||
              result.participants.some((item) => item.outcome.status !== "success") ? (
                <Button
                  onClick={() => {
                    void retry();
                  }}
                  disabled={busy}
                >
                  재시도
                </Button>
              ) : null}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
