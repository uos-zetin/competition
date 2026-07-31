import type { RecordCreateDto, RecordDto, RecordSourceDto, RecordStatusDto } from "../api/types";
import type { Record, RecordForm, RecordSource, RecordStatus } from "../model/types";

export function parseRecordSourceDto(source: RecordSourceDto): RecordSource {
  switch (source) {
    case "stopwatch":
    case "manual":
    case "other":
      return source;
  }
}

export function parseRecordStatusDto(status: RecordStatusDto): RecordStatus {
  switch (status) {
    case "pending":
    case "approved":
    case "rejected":
      return status;
  }
}

export function parseRecordDto(dto: RecordDto): Record {
  return {
    ...dto,
    source: parseRecordSourceDto(dto.source),
    status: parseRecordStatusDto(dto.status),
    createdAt: new Date(dto.createdAt),
  };
}

export function parseRecordForm(form: RecordForm): RecordCreateDto {
  return { value: form.value, source: form.source, note: form.note };
}
