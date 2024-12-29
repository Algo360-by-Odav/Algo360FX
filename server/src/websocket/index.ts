import WebSocket, { Server } from 'ws';
import { TimeFrame } from '../types/market';
import { WebSocketClient } from '../types/websocket';

class WebSocketManager {
  private wss: Server;
  private clients: Map<string, WebSocketClient>;

  constructor(server: Server) {
    this.wss = server;
    this.clients = new Map();

    this.wss.on('connection', (ws: WebSocket) => {
      const client: WebSocketClient = {
        ws,
        id: Math.random().toString(36).substring(7),
        subscriptions: new Set<string>(),
        heartbeat: new Date()
      };

      this.clients.set(client.id, client);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(client, data);
        } catch (error) {
          this.sendError(client, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(client);
      });
    });

    setInterval(() => {
      this.checkHeartbeats();
    }, 30000);
  }

  private async handleMessage(client: WebSocketClient, data: any): Promise<void> {
    switch (data.type) {
      case 'subscribe':
        await this.handleSubscribe(client, data);
        break;
      case 'unsubscribe':
        await this.handleUnsubscribe(client, data);
        break;
      default:
        this.sendError(client, 'Unknown message type');
    }
  }

  private async handleSubscribe(client: WebSocketClient, data: any): Promise<void> {
    const { symbol, timeframe } = data;
    const timeframeEnum = TimeFrame[timeframe as keyof typeof TimeFrame];

    if (!Object.values(TimeFrame).includes(timeframeEnum)) {
      this.sendError(client, 'Invalid timeframe');
      return;
    }

    const subscriptionKey = `${symbol}-${timeframe}`;

    if (client.subscriptions.has(subscriptionKey)) {
      return;
    }

    client.subscriptions.add(subscriptionKey);
    client.heartbeat = new Date();

    // Set up market data interval
    setInterval(async () => {
      try {
        const marketData = await this.fetchMarketData(symbol, timeframe);
        this.sendMarketData(client, marketData);
      } catch (error) {
        console.error('Error fetching market data:', error);
        this.sendError(client, 'Failed to fetch market data');
      }
    }, 1000); // Update every second
  }

  private async handleUnsubscribe(client: WebSocketClient, data: any): Promise<void> {
    const { symbol, timeframe } = data;
    const timeframeEnum = TimeFrame[timeframe as keyof typeof TimeFrame];

    if (!Object.values(TimeFrame).includes(timeframeEnum)) {
      this.sendError(client, 'Invalid timeframe');
      return;
    }

    const subscriptionKey = `${symbol}-${timeframe}`;

    client.subscriptions.delete(subscriptionKey);
    client.heartbeat = new Date();
  }

  private handleDisconnect(client: WebSocketClient): void {
    this.clients.delete(client.id);
  }

  private async fetchMarketData(symbol: string, timeframe: string): Promise<any> {
    // Implement market data fetching logic here
    const open = 0;
    const high = 0;
    const low = 0;
    const close = 0;
    const volume = 0;

    const marketData = {
      symbol,
      timeframe,
      timestamp: new Date(),
      open,
      high,
      low,
      close,
      volume
    };

    return marketData;
  }

  private sendMarketData(client: WebSocketClient, data: any): void {
    client.ws.send(JSON.stringify({ type: 'marketData', data }));
  }

  private sendError(client: WebSocketClient, message: string): void {
    client.ws.send(JSON.stringify({ type: 'error', data: { message } }));
  }

  private checkHeartbeats(): void {
    const now = new Date();
    this.clients.forEach((client, id) => {
      if (now.getTime() - client.heartbeat.getTime() > 300000) { // 5 minutes
        client.ws.terminate();
        this.handleDisconnect(client);
      }
    });
  }
}

import { Server } from 'http';
import { TradingWebSocket } from './trading';
import { OptimizationWebSocket } from './optimization';

export function initializeWebSockets(server: Server) {
  const tradingWs = new TradingWebSocket(server);
  const optimizationWs = new OptimizationWebSocket(server);

  return {
    tradingWs,
    optimizationWs
  };
}

export type { WebSocketClient } from '../types/websocket';

export default WebSocketManager;
