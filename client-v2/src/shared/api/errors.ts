import type { ApiErrorResponse } from "./types";

/**
 * API 에러 기본 클래스
 */
export abstract class ApiError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly originalResponse?: ApiErrorResponse;

  constructor(message: string, statusCode: number, type: string, originalResponse?: ApiErrorResponse) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.originalResponse = originalResponse;
  }
}

/**
 * 서버 에러 (5xx)
 */
export class ServerError extends ApiError {
  constructor(
    message: string,
    statusCode: number = 500,
    type: string = "SERVER_ERROR",
    originalResponse?: ApiErrorResponse
  ) {
    super(message, statusCode, type, originalResponse);
    this.name = "ServerError";
  }
}

/**
 * 클라이언트 에러 (4xx)
 */
export class ClientError extends ApiError {
  constructor(
    message: string,
    statusCode: number = 400,
    type: string = "CLIENT_ERROR",
    originalResponse?: ApiErrorResponse
  ) {
    super(message, statusCode, type, originalResponse);
    this.name = "ClientError";
  }
}

/**
 * 네트워크 에러 (연결 실패, 타임아웃 등)
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * 인증 에러 (401)
 */
export class AuthenticationError extends ClientError {
  constructor(message: string = "인증이 필요합니다", originalResponse?: ApiErrorResponse) {
    super(message, 401, "AUTHENTICATION_ERROR", originalResponse);
    this.name = "AuthenticationError";
  }
}

/**
 * 권한 에러 (403)
 */
export class AuthorizationError extends ClientError {
  constructor(message: string = "권한이 없습니다", originalResponse?: ApiErrorResponse) {
    super(message, 403, "AUTHORIZATION_ERROR", originalResponse);
    this.name = "AuthorizationError";
  }
}

/**
 * 리소스 없음 에러 (404)
 */
export class NotFoundError extends ClientError {
  constructor(message: string = "리소스를 찾을 수 없습니다", originalResponse?: ApiErrorResponse) {
    super(message, 404, "NOT_FOUND_ERROR", originalResponse);
    this.name = "NotFoundError";
  }
}

/**
 * 검증 에러 (422)
 */
export class ValidationError extends ClientError {
  constructor(message: string = "입력값이 올바르지 않습니다", originalResponse?: ApiErrorResponse) {
    super(message, 422, "VALIDATION_ERROR", originalResponse);
    this.name = "ValidationError";
  }
}

/**
 * HTTP 상태 코드와 에러 응답을 기반으로 적절한 에러 객체 생성
 */
export function createApiError(status: number, errorResponse?: ApiErrorResponse, fallbackMessage?: string): ApiError {
  const errorMessage = errorResponse?.message || fallbackMessage || `HTTP ${status}`;
  const errorType = errorResponse?.type || "UNKNOWN_ERROR";

  switch (status) {
    case 401:
      return new AuthenticationError(errorMessage, errorResponse);
    case 403:
      return new AuthorizationError(errorMessage, errorResponse);
    case 404:
      return new NotFoundError(errorMessage, errorResponse);
    case 422:
      return new ValidationError(errorMessage, errorResponse);
    default:
      if (status >= 400 && status < 500) {
        return new ClientError(errorMessage, status, errorType, errorResponse);
      }
      return new ServerError(errorMessage, status, errorType, errorResponse);
  }
}
