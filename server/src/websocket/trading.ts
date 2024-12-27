import { Server as SocketServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';
import { config } from 'dotenv';
import { MarketData } from '../types/market';

// Load environment variables
config();

interface TradingClient {
  id: string;
  socket: Socket;
  subscriptions: Set<string>;
  lastActivity: Date;
  marketDataInterval?: NodeJS.Timeout;
}

class TradingWebSocket {
  private io: SocketServer;
  private clients: Map<string, TradingClient>;
  private readonly ACTIVITY_TIMEOUT = 300000; // 5 minutes

  constructor(server: Server) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.clients = new Map();
    console.log('Trading WebSocket server initialized');

    this.setupSocketServer();
    this.startActivityCheck();
  }

  private setupSocketServer(): void {
    this.io.on('connection', (socket) => {
      const clientId = uuidv4();
      const client: TradingClient = {
        id: clientId,
        socket,
        subscriptions: new Set(),
        lastActivity: new Date()
      };

      this.clients.set(clientId, client);
      console.log(`Trading client connected: ${clientId}`);

      this.setupMessageHandling(client);
      this.setupDisconnectHandling(client);
    });
  }

  private setupMessageHandling(client: TradingClient): void {
    client.socket.on('subscribe', async (data: { symbol: string; timeframe: string }) => {
      try {
        await this.handleSubscribe(client, data);
      } catch (error) {
        console.error('Error handling subscribe:', error);
        this.sendError(client, 'Failed to subscribe to market data');
      }
    });

    client.socket.on('unsubscribe', (data: { symbol: string; timeframe: string }) => {
      this.handleUnsubscribe(client, data);
    });

    client.socket.on('placeOrder', (data: any) => {
      this.handlePlaceOrder(client, data);
    });

    client.socket.on('cancelOrder', (data: { orderId: string }) => {
      this.handleCancelOrder(client, data);
    });
  }

  private setupDisconnectHandling(client: TradingClient): void {
    client.socket.on('disconnect', () => {
      this.handleDisconnect(client);
    });

    client.socket.on('error', (error: Error) => {
      console.error(`Socket error for client ${client.id}:`, error);
      this.handleDisconnect(client);
    });
  }

  private async handleSubscribe(client: TradingClient, data: { symbol: string; timeframe: string }): Promise<void> {
    const { symbol, timeframe } = data;
    const subscriptionKey = `${symbol}-${timeframe}`;

    if (client.subscriptions.has(subscriptionKey)) {
      return;
    }

    client.subscriptions.add(subscriptionKey);
    client.lastActivity = new Date();

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

  private handleUnsubscribe(client: TradingClient, data: { symbol: string; timeframe: string }): void {
    const { symbol, timeframe } = data;
    const subscriptionKey = `${symbol}-${timeframe}`;

    client.subscriptions.delete(subscriptionKey);
    client.lastActivity = new Date();

    if (client.marketDataInterval) {
      clearInterval(client.marketDataInterval);
    }
  }

  private handlePlaceOrder(client: TradingClient, order: any): void {
    // Implement order placement logic here
    const orderId = uuidv4();
    client.lastActivity = new Date();

    this.sendOrderUpdate(client, {
      id: orderId,
      status: 'PENDING',
      ...order
    });
  }

  private handleCancelOrder(client: TradingClient, data: { orderId: string }): void {
    // Implement order cancellation logic here
    client.lastActivity = new Date();

    this.sendOrderUpdate(client, {
      id: data.orderId,
      status: 'CANCELLED'
    });
  }

  private handleDisconnect(client: TradingClient): void {
    if (client.marketDataInterval) {
      clearInterval(client.marketDataInterval);
    }

    this.clients.delete(client.id);
    console.log(`Trading client disconnected: ${client.id}`);
  }

  private startActivityCheck(): void {
    setInterval(() => {
      const now = new Date();
      this.clients.forEach((client, clientId) => {
        const inactiveTime = now.getTime() - client.lastActivity.getTime();
        if (inactiveTime > this.ACTIVITY_TIMEOUT) {
          console.log(`Client ${clientId} inactive for too long, disconnecting`);
          client.socket.disconnect(true);
          this.handleDisconnect(client);
        }
      });
    }, 60000); // Check every minute
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

  private sendMarketData(client: TradingClient, data: MarketData): void {
    client.socket.emit('marketData', data);
  }

  private sendOrderUpdate(client: TradingClient, order: any): void {
    client.socket.emit('orderUpdate', order);
  }

  private sendError(client: TradingClient, message: string): void {
    client.socket.emit('error', { message });
  }
}

export default TradingWebSocket;
