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

  const cleanupSocket = () => {
    if (!socket) return;
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  };

  const connect = (id: string): Promise<void> => {
    connectionToken += 1;
    const token = connectionToken;
    pendingReject?.(new Error("superseded by a newer connect() call"));
    pendingReject = null;
    cleanupSocket();

    return new Promise((resolve, reject) => {
      pendingReject = reject;
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
      nextSocket.on("message", (raw: unknown) => {
        const message = parseMessage(raw);
        handlers.forEach((handler) => handler(message));
      });
    });
  };

  const disconnect = async (): Promise<void> => {
    connectionToken += 1;
    pendingReject?.(new Error("socket channel disconnected"));
    pendingReject = null;
    cleanupSocket();
  };

  const subscribe = (handler: (message: TMessage) => void): (() => void) => {
    handlers.add(handler);
    return () => handlers.delete(handler);
  };

  return { connect, disconnect, subscribe };
}
