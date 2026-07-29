import { createBrowserRouter, type RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <div>client-v2</div>,
  },
];

export const router = createBrowserRouter(routes);
