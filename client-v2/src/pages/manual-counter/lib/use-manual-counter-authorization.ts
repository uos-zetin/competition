import { useEffect } from "react";
import { useNavigate } from "react-router";

import { authService } from "@/features/auth";

export function useManualCounterAuthorization(): boolean {
  const { user, isAuthenticated } = authService.use.auth();
  const navigate = useNavigate();
  const isAuthorized = isAuthenticated && Boolean(user?.roles.includes("administrator") || user?.roles.includes("manualRecorder"));

  useEffect(() => {
    if (!isAuthorized) void navigate("/");
  }, [isAuthorized, navigate]);

  return isAuthorized;
}
