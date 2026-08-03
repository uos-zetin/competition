import { createSocketChannel, sessionStore } from "@/shared/api";
import { env } from "@/shared/config/env";

import { parseProgressDto } from "../lib/parse-dto";

import type { ProgressChannel, ProgressDto } from "./types";

export function createProgressChannel(): ProgressChannel {
  const channel = createSocketChannel<ProgressDto>({
    url: `${env.serverUrl}/socket/divisions/progress`,
    queryKey: "divisionId",
    getSessionKey: () => sessionStore.getSessionKey(),
    parseMessage: (raw) => raw as ProgressDto,
  });
  return {
    connect: (divisionId) => channel.connect(divisionId),
    disconnect: () => channel.disconnect(),
    subscribe: (handler) => channel.subscribe((dto) => handler(parseProgressDto(dto))),
  };
}
