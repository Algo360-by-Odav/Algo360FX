import WebSocket, { Server } from 'ws';
import { WebSocketClient, BaseMessage } from '../types/websocket';

class WebSocketBase {
  protected clients: Map<string, WebSocketClient>;
  protected server: Server;

  constructor(server: Server) {
    this.clients = new Map();
    this.server = server;
    this.setupWebSocket();
  }

  protected setupWebSocket(): void {
    this.server.on('connection', (ws: WebSocket) => {
      const client: WebSocketClient = {
        ws,
        id: this.generateClientId(),
        subscriptions: new Set(),
        heartbeat: new Date()
      };

      this.clients.set(client.id, client);
      this.setupClientHandlers(client);
    });

    setInterval(() => {
      this.checkHeartbeats();
    }, 30000);
  }

  protected setupClientHandlers(client: WebSocketClient): void {
    client.ws.on('message', async (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString()) as BaseMessage;
        await this.handleMessage(client, message);
      } catch (error) {
        this.sendError(client, error.message);
      }
    });

    client.ws.on('close', () => {
      this.handleDisconnect(client);
    });

    client.ws.on('pong', () => {
      if (this.clients.has(client.id)) {
        this.clients.get(client.id)!.heartbeat = new Date();
      }
    });
  }

  protected generateClientId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  protected handleDisconnect(client: WebSocketClient): void {
    this.clients.delete(client.id);
  }

  protected sendError(client: WebSocketClient, message: string): void {
    client.ws.send(JSON.stringify({ type: 'error', message }));
  }

  protected async handleMessage(client: WebSocketClient, data: BaseMessage): Promise<void> {
    throw new Error('Method not implemented');
  }

  protected checkHeartbeats(): void {
    const now = new Date();
    for (const [clientId, client] of this.clients.entries()) {
      if (now.getTime() - client.heartbeat.getTime() > 30000) {
        client.ws.terminate();
        this.clients.delete(clientId);
      }
    }
  }

  public isHealthy(): boolean {
    return this.server?.clients?.size !== undefined;
  }

  public getMetrics(): { connections: number } {
    return {
      connections: this.server?.clients?.size || 0
    };
  }
}

export default WebSocketBase;
