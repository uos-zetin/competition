import { io, type Socket } from "socket.io-client";

export interface SocketChannel<TMessage> {
  connect(id: string): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(handler: (message: TMessage) => void): () => void;
}

export interface CreateSocketChannelOptions<TMessage> {
  url: string;
  queryKey: string;
  getSessionKey: () => string | null;
  parseMessage: (raw: unknown) => TMessage;
}

export class ConnectionCancelledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionCancelledError";
  }
}

export function createSocketChannel<TMessage>({
  url,
  queryKey,
  getSessionKey,
  parseMessage,
}: CreateSocketChannelOptions<TMessage>): SocketChannel<TMessage> {
  let socket: Socket | null = null;
  const handlers = new Set<(message: TMessage) => void>();
  let connectionToken = 0;
  let pendingReject: ((error: Error) => void) | null = null;
  let teardownInFlight: Promise<void> | null = null;

  const cleanupSocket = (): Promise<void> => {
    const socketToClean = socket;
    socket = null;
    if (!socketToClean) return teardownInFlight ?? Promise.resolve();
    const teardown = (teardownInFlight ?? Promise.resolve()).then(() => {
      if (!socketToClean) return;
      socketToClean.removeAllListeners();
      socketToClean.disconnect();
    });
    const trackedTeardown = teardown.finally(() => {
      if (teardownInFlight === trackedTeardown) teardownInFlight = null;
    });
    teardownInFlight = trackedTeardown;
    return trackedTeardown;
  };

  const connect = (id: string): Promise<void> => {
    connectionToken += 1;
    const token = connectionToken;
    pendingReject?.(new ConnectionCancelledError("superseded by a newer connect() call"));
    pendingReject = null;
    const teardown = socket || teardownInFlight ? cleanupSocket() : null;

    return new Promise((resolve, reject) => {
      pendingReject = reject;
      const startConnection = () => {
        if (token !== connectionToken) return;
        const sessionKey = getSessionKey();
        const nextSocket = io(url, {
          forceNew: true,
          query: { [queryKey]: id },
          extraHeaders: sessionKey ? { authorization: `Session ${sessionKey}` } : undefined,
        });
        socket = nextSocket;

        nextSocket.on("connect", () => {
          if (token !== connectionToken) return;
          pendingReject = null;
          resolve();
        });
        nextSocket.on("connect_error", (error: Error) => {
          if (token !== connectionToken) return;
          pendingReject = null;
          reject(error);
        });
        nextSocket.on("disconnect", (reason: string) => {
          console.warn("Socket disconnected:", reason);
        });
        nextSocket.on("error", (error: unknown) => {
          console.warn("Socket error:", error);
        });
        nextSocket.on("message", (raw: unknown) => {
          const message = parseMessage(raw);
          handlers.forEach((handler) => handler(message));
        });
      };
      if (teardown) void teardown.then(startConnection);
      else startConnection();
    });
  };

  const disconnect = async (): Promise<void> => {
    connectionToken += 1;
    pendingReject?.(new ConnectionCancelledError("socket channel disconnected"));
    pendingReject = null;
    await cleanupSocket();
  };

  const subscribe = (handler: (message: TMessage) => void): (() => void) => {
    handlers.add(handler);
    return () => handlers.delete(handler);
  };

  return { connect, disconnect, subscribe };
}
