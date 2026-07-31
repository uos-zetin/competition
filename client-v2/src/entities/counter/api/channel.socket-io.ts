import { createSocketChannel } from "@/shared/api";
import { env } from "@/shared/config/env";

import type { CounterChannel, CounterDto } from "./types";

export function createCounterChannel(getSessionKey: () => string | null): CounterChannel {
  return createSocketChannel<CounterDto>({
    url: `${env.serverUrl}/socket/counters`,
    queryKey: "deviceId",
    getSessionKey,
    parseMessage: (raw) => raw as CounterDto,
  });
}
