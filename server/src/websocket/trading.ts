import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { MarketDataService } from '../services/MarketData';
import { v4 as uuidv4 } from 'uuid';

export class TradingWebSocketServer {
  private io: Server;
  private clients: Map<string, Client> = new Map();
  private marketData: Map<string, any> = new Map();
  private updateInterval: NodeJS.Timeout;
  private subscribedSymbols: Set<string>;

  constructor(io: Server) {
    this.io = io;
    this.subscribedSymbols = new Set();
    this.updateInterval = setInterval(this.broadcastPrices.bind(this), 1000);
    this.setupSocketServer();
  }

  public initialize() {
    this.initializeMarketData();
    console.log('Trading WebSocket Server initialized');
  }

  private setupSocketServer() {
    this.io.on('connection', (socket: Socket) => {
      const clientId = uuidv4();
      const client: Client = {
        id: clientId,
        socket,
        subscriptions: new Set()
      };

      this.clients.set(clientId, client);
      console.log(`Client connected: ${clientId}`);

      socket.on('subscribe', (symbol: string) => {
        client.subscriptions.add(symbol);
        this.subscribedSymbols.add(symbol);
        const data = this.marketData.get(symbol);
        if (data) {
          socket.emit('marketData', { symbol, data });
        }
      });

      socket.on('unsubscribe', (symbol: string) => {
        client.subscriptions.delete(symbol);
        this.subscribedSymbols.delete(symbol);
      });

      socket.on('disconnect', () => {
        this.clients.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
      });
    });
  }

  private initializeMarketData() {
    const defaultSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'];
    defaultSymbols.forEach(symbol => {
      this.marketData.set(symbol, {
        bid: Math.random() * 2,
        ask: Math.random() * 2 + 0.0002,
        timestamp: Date.now()
      });
    });
  }

  private async broadcastPrices(): Promise<void> {
    for (const symbol of this.subscribedSymbols) {
      try {
        const data = this.marketData.get(symbol);
        if (data) {
          this.io.emit('marketData', { symbol, data });
        }
      } catch (error) {
        console.error(`Error broadcasting price for ${symbol}:`, error);
      }
    }
  }

  public close() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

interface Client {
  id: string;
  socket: Socket;
  subscriptions: Set<string>;
}

export default TradingWebSocketServer;
