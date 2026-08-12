import { Outlet, useNavigation } from "react-router";

import { ErrorModalHost, ErrorToastHost } from "@/features/error-handling";
import { LoadingPage } from "@/pages/loading";

const LOADING_MESSAGES: Record<string, string> = {
  "/admin/divisions": "부문 정보를 불러오는 중입니다...",
  "/admin/participants": "참가자 정보를 불러오는 중입니다...",
  "/admin/records": "기록을 불러오는 중입니다...",
};

export function RootLayout() {
  const navigation = useNavigation();
  const message = LOADING_MESSAGES[navigation.location?.pathname ?? ""];

  return (
    <>
      {navigation.state === "idle" ? <Outlet /> : <LoadingPage message={message} />}
      <ErrorModalHost />
      <ErrorToastHost />
    </>
  );
}
