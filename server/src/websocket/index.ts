import { WebSocket, WebSocketServer } from 'ws';
import { createServer, Server } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { MarketData } from '../types/market';

// Load environment variables
config();

interface Client {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
  heartbeat: Date;
  pingTimeout?: NodeJS.Timeout;
  marketDataInterval?: NodeJS.Timeout;
}

class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, Client>;
  private httpServer: Server;
  private readonly PING_INTERVAL = 30000; // 30 seconds
  private readonly PING_TIMEOUT = 5000; // 5 seconds

  constructor(port: number) {
    this.httpServer = createServer();
    this.wss = new WebSocketServer({ server: this.httpServer });
    this.clients = new Map();

    this.httpServer.listen(port, () => {
      console.log(`WebSocket server is running on port ${port}`);
    });

    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = uuidv4();
      const client: Client = {
        id: clientId,
        ws,
        subscriptions: new Set(),
        heartbeat: new Date()
      };

      this.clients.set(clientId, client);
      console.log(`Client connected: ${clientId}`);

      this.setupPingPong(client);
      this.setupMessageHandling(client);
      this.setupDisconnectHandling(client);
    });
  }

  private setupPingPong(client: Client): void {
    // Send ping to client every PING_INTERVAL
    setInterval(() => {
      if (!client.ws || client.ws.readyState !== WebSocket.OPEN) return;

      client.ws.ping();

      // Set up timeout for pong response
      client.pingTimeout = setTimeout(() => {
        if (client.ws) {
          client.ws.terminate();
        }
      }, this.PING_TIMEOUT);
    }, this.PING_INTERVAL);

    // Handle pong response from client
    client.ws.on('pong', () => {
      client.heartbeat = new Date();
      if (client.pingTimeout) {
        clearTimeout(client.pingTimeout);
      }
    });
  }

  private setupMessageHandling(client: Client): void {
    client.ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        await this.handleMessage(client, data);
      } catch (error) {
        console.error('Error handling message:', error);
        this.sendError(client, 'Invalid message format');
      }
    });
  }

  private setupDisconnectHandling(client: Client): void {
    client.ws.on('close', () => {
      this.handleDisconnect(client);
    });

    client.ws.on('error', (error) => {
      console.error(`WebSocket error for client ${client.id}:`, error);
      this.handleDisconnect(client);
    });
  }

  private handleDisconnect(client: Client): void {
    // Clear intervals and timeouts
    if (client.marketDataInterval) {
      clearInterval(client.marketDataInterval);
    }
    if (client.pingTimeout) {
      clearTimeout(client.pingTimeout);
    }

    // Remove client from clients map
    this.clients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  private async handleMessage(client: Client, data: any): Promise<void> {
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

  private async handleSubscribe(client: Client, data: any): Promise<void> {
    const { symbol, timeframe } = data;
    const subscriptionKey = `${symbol}-${timeframe}`;

    if (client.subscriptions.has(subscriptionKey)) {
      return;
    }

    client.subscriptions.add(subscriptionKey);

    // Set up market data interval
    client.marketDataInterval = setInterval(async () => {
      try {
        const marketData = await this.fetchMarketData(symbol, timeframe);
        this.sendMarketData(client, marketData);
      } catch (error) {
        console.error('Error fetching market data:', error);
        this.sendError(client, 'Error fetching market data');
      }
    }, 1000); // Update every second
  }

  private async handleUnsubscribe(client: Client, data: any): Promise<void> {
    const { symbol, timeframe } = data;
    const subscriptionKey = `${symbol}-${timeframe}`;

    client.subscriptions.delete(subscriptionKey);

    if (client.marketDataInterval) {
      clearInterval(client.marketDataInterval);
    }
  }

  private async fetchMarketData(symbol: string, timeframe: string): Promise<MarketData> {
    // Implement market data fetching logic here
    return {
      symbol,
      timeframe,
      timestamp: new Date(),
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0
    };
  }

  private sendMarketData(client: Client, data: MarketData): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'marketData',
        data
      }));
    }
  }

  private sendError(client: Client, message: string): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'error',
        message
      }));
    }
  }
}

export default WebSocketManager;
