import { useEffect } from "react";
import { useNavigate } from "react-router";

import { authService } from "../model/auth-service";

export function useAdminAuthorization(): boolean {
  const { user, isAuthenticated } = authService.use.auth();
  const navigate = useNavigate();
  const isAdministrator = user?.roles.includes("administrator") ?? false;
  const isAuthorized = isAuthenticated && isAdministrator;

  useEffect(() => {
    if (!isAuthorized) void navigate("/");
  }, [isAuthorized, navigate]);

  return isAuthorized;
}
