import { authService } from "@/features/auth";

import { HomeDashboard } from "./home-dashboard";
import { HomeLoginScreen } from "./home-login-screen";

export function HomePage() {
  const { user, isAuthenticated } = authService.use.auth();

  return isAuthenticated ? <HomeDashboard user={user} /> : <HomeLoginScreen />;
}
