import { createBrowserRouter, Navigate, type RouteObject } from "react-router";

import { LoadingPage } from "@/pages/loading";

import { RootLayout } from "./root-layout";

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    HydrateFallback: LoadingPage,
    children: [
      {
        path: "/",
        lazy: async () => {
          const { HomePage } = await import("@/pages/home");
          return { Component: HomePage };
        },
      },
      {
        path: "/counter",
        lazy: async () => {
          const { CounterSelectorPage } = await import("@/pages/counter-selector");
          return { Component: CounterSelectorPage };
        },
      },
      {
        path: "/counter/:counterId/controller",
        lazy: async () => {
          const { ControllerPage } = await import("@/pages/controller");
          return { Component: ControllerPage };
        },
      },
      {
        path: "/counter/:counterId/timer",
        lazy: async () => {
          const { TimerPage } = await import("@/pages/timer");
          return { Component: TimerPage };
        },
      },
      {
        path: "/counter/:counterId/manual-counter",
        lazy: async () => {
          const { ManualCounterPage } = await import("@/pages/manual-counter");
          return { Component: ManualCounterPage };
        },
      },
      {
        path: "/admin",
        lazy: async () => {
          const { AdminDashboardPage } = await import("@/pages/admin-dashboard");
          return { Component: AdminDashboardPage };
        },
      },
      {
        path: "/admin/competitions",
        lazy: async () => {
          const { AdminCompetitionsPage } = await import("@/pages/admin-competitions");
          return { Component: AdminCompetitionsPage };
        },
      },
      {
        path: "/admin/divisions",
        lazy: async () => {
          const { AdminDivisionsPage, adminDivisionsLoader } = await import("@/pages/admin-divisions");
          return { Component: AdminDivisionsPage, loader: adminDivisionsLoader };
        },
      },
      {
        path: "/admin/participants",
        lazy: async () => {
          const { AdminParticipantsPage, adminParticipantsLoader } = await import("@/pages/admin-participants");
          return { Component: AdminParticipantsPage, loader: adminParticipantsLoader };
        },
      },
      {
        path: "/admin/records",
        lazy: async () => {
          const { AdminRecordsPage, adminRecordsLoader } = await import("@/pages/admin-records");
          return { Component: AdminRecordsPage, loader: adminRecordsLoader };
        },
      },
      {
        path: "/admin/users",
        lazy: async () => {
          const { AdminUsersPage } = await import("@/pages/admin-users");
          return { Component: AdminUsersPage };
        },
      },
      {
        path: "/dashboard",
        lazy: async () => {
          const { DashboardPage } = await import("@/pages/dashboard");
          return { Component: DashboardPage };
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
