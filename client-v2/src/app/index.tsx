import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { AuthDebugWidget } from "@/features/auth";
import { AppErrorBoundary } from "@/features/error-handling";

import { router } from "./routing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
    <AuthDebugWidget />
  </StrictMode>
);
