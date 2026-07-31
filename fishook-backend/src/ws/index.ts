import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

let wss: WebSocketServer;

export function initWsServer(server: Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const webhookId = url.searchParams.get("webhook_id");

    if (webhookId) {
      (ws as WebSocket & { webhookId?: string }).webhookId = webhookId;
    }

    ws.on("close", () => {});
  });

  return wss;
}

export function getWsServer() {
  if (!wss) throw new Error("WebSocket server not initialized. Call initWsServer() first.");

    return {
    broadcast(webhookId: string, data: unknown) {
      const message = JSON.stringify(data);

      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          (client as WebSocket & { webhookId?: string }).webhookId === webhookId
        ) {
          client.send(message);
        }
      });
    },
  };
}
