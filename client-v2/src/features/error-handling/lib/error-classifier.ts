import {
  AuthenticationError,
  AuthorizationError,
  ClientError,
  NetworkError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "@/shared/api";

import type { ErrorHandlingConfig } from "../model/types";

export function classifyError(error: unknown): ErrorHandlingConfig {
  if (error instanceof AuthenticationError) {
    return {
      displayType: "modal",
      statusCode: error.statusCode,
      title: "인증 만료",
      message: error.message || "로그인이 만료되었습니다. 다시 로그인해주세요.",
      actionType: "redirect",
      redirectPath: "/",
      clearAuth: true,
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      displayType: "modal",
      statusCode: error.statusCode,
      title: "접근 권한 없음",
      message: error.message || "해당 기능에 접근할 권한이 없습니다.",
      actionType: "redirect",
      redirectPath: "/",
      clearAuth: false,
    };
  }

  if (error instanceof ValidationError) {
    return {
      displayType: "toast",
      statusCode: error.statusCode,
      title: "입력값 오류",
      message: error.message || "입력값을 확인해주세요.",
      description: "입력값을 확인해주세요.",
      actionType: "none",
    };
  }

  if (error instanceof NotFoundError) {
    return {
      displayType: "toast",
      statusCode: error.statusCode,
      title: "리소스 없음",
      message: error.message || "요청한 정보를 찾을 수 없습니다.",
      actionType: "none",
    };
  }

  if (error instanceof ServerError) {
    return {
      displayType: "toast",
      statusCode: error.statusCode,
      title: "서버 오류",
      message: "서버에 일시적인 문제가 발생했습니다",
      description: "잠시 후 다시 시도해주세요.",
      actionType: "none",
    };
  }

  if (error instanceof ClientError) {
    const isConflict = error.statusCode === 409;
    return {
      displayType: "toast",
      statusCode: error.statusCode,
      title: isConflict ? "작업 불가" : "요청 오류",
      message: error.message,
      description: isConflict ? "현재 상태에서는 해당 작업을 수행할 수 없습니다." : "요청 내용을 확인해주세요.",
      actionType: "none",
    };
  }

  if (error instanceof NetworkError) {
    return {
      displayType: "toast",
      statusCode: 0,
      title: "네트워크 오류",
      message: error.message || "네트워크 연결을 확인해주세요.",
      actionType: "none",
    };
  }

  return {
    displayType: "toast",
    statusCode: 0,
    title: "오류 발생",
    message: "예기치 못한 오류가 발생했습니다.",
    actionType: "none",
  };
}
