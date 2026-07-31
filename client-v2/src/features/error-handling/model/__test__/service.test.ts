import { describe, expect, it, vi } from "vitest";

import { AuthenticationError, AuthorizationError, ValidationError } from "@/shared/api";

import { createErrorHandlingService } from "../service";

describe("createErrorHandlingService", () => {
  it("notifies only for a validation error", () => {
    const notify = vi.fn();
    const openModal = vi.fn();
    createErrorHandlingService({ notify, openModal }).handle(new ValidationError("입력 오류"));

    expect(notify).toHaveBeenCalledOnce();
    expect(openModal).not.toHaveBeenCalled();
  });

  it("opens an authentication modal that clears auth", () => {
    const notify = vi.fn();
    const openModal = vi.fn();
    createErrorHandlingService({ notify, openModal }).handle(new AuthenticationError());

    expect(notify).not.toHaveBeenCalled();
    expect(openModal).toHaveBeenCalledWith(expect.objectContaining({ clearAuth: true }));
  });

  it("opens an authorization modal without clearing auth", () => {
    const openModal = vi.fn();
    createErrorHandlingService({ notify: vi.fn(), openModal }).handle(new AuthorizationError());

    expect(openModal).toHaveBeenCalledWith(expect.objectContaining({ clearAuth: false }));
  });
});
