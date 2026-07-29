import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/socket.io": {
        target: process.env.VITE_SERVER_URL || "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
      "/socket": {
        target: process.env.VITE_SERVER_URL || "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
      "/api": {
        target: process.env.VITE_SERVER_URL || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      "/socket.io": {
        target: process.env.VITE_SERVER_URL || "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
      "/socket": {
        target: process.env.VITE_SERVER_URL || "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
      "/api": {
        target: process.env.VITE_SERVER_URL || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
