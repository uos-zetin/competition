export const env = {
  useMocks: import.meta.env.VITE_USE_MOCKS === "true",
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "",
};
