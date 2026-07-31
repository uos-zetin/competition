import { describe, expect, it } from "vitest";

import {
  AuthenticationError,
  AuthorizationError,
  ClientError,
  NetworkError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "@/shared/api";

import { classifyError } from "../error-classifier";

describe("classifyError", () => {
  it.each([
    [new AuthenticationError("세션 종료"), { displayType: "modal", actionType: "redirect", clearAuth: true, title: "인증 만료", message: "세션 종료", statusCode: 401 }],
    [new AuthorizationError("권한 없음"), { displayType: "modal", actionType: "redirect", clearAuth: false, title: "접근 권한 없음", message: "권한 없음", statusCode: 403 }],
    [new ValidationError("이름을 입력하세요"), { displayType: "toast", actionType: "none", title: "입력값 오류", message: "이름을 입력하세요", statusCode: 422 }],
    [new NotFoundError("대회 없음"), { displayType: "toast", actionType: "none", title: "리소스 없음", message: "대회 없음", statusCode: 404 }],
    [new ServerError("internal"), { displayType: "toast", actionType: "none", title: "서버 오류", message: "서버에 일시적인 문제가 발생했습니다", statusCode: 500 }],
    [new NetworkError("연결 끊김"), { displayType: "toast", actionType: "none", title: "네트워크 오류", message: "연결 끊김", statusCode: 0 }],
  ])("classifies API error %#", (error, expected) => {
    expect(classifyError(error)).toMatchObject(expected);
  });

  it("uses conflict-specific guidance for client errors", () => {
    expect(classifyError(new ClientError("카운터가 아직 등록되지 않았습니다", 409))).toMatchObject({
      title: "작업 불가",
      description: "현재 상태에서는 해당 작업을 수행할 수 없습니다.",
    });
    expect(classifyError(new ClientError("잘못된 요청", 400))).toMatchObject({
      title: "요청 오류",
      description: "요청 내용을 확인해주세요.",
    });
  });

  it.each([new Error("unexpected"), "string error"])('falls back for non-API errors: %#', (error) => {
    expect(classifyError(error)).toMatchObject({
      displayType: "toast",
      actionType: "none",
      statusCode: 0,
      title: "오류 발생",
      message: "예기치 못한 오류가 발생했습니다.",
    });
  });
});
