import { beforeEach, describe, expect, it } from "vitest";

import { useErrorModalStore } from "../store.zustand";

const modalError = {
  displayType: "modal" as const,
  statusCode: 401,
  title: "인증 만료",
  message: "로그인이 만료되었습니다.",
  actionType: "redirect" as const,
  redirectPath: "/",
  clearAuth: true,
};

describe("useErrorModalStore", () => {
  beforeEach(() => useErrorModalStore.getState().clearAll());

  it("opens, closes, and clears the active modal error", () => {
    useErrorModalStore.getState().open(modalError);
    expect(useErrorModalStore.getState().activeError).toEqual(modalError);

    useErrorModalStore.getState().close();
    expect(useErrorModalStore.getState().activeError).toBeNull();

    useErrorModalStore.getState().open(modalError);
    useErrorModalStore.getState().clearAll();
    expect(useErrorModalStore.getState().activeError).toBeNull();
  });
});
