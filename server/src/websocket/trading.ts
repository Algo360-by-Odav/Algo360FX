import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface Client {
  id: string;
  socket: any;
  subscriptions: Set<string>;
}

export class TradingWebSocketServer {
  private io: SocketIOServer;
  private clients: Map<string, Client> = new Map();
  private marketData: Map<string, any> = new Map();
  private updateInterval: NodeJS.Timeout;

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  public initialize() {
    this.setupSocketServer();
    this.initializeMarketData();
    this.startUpdates();
    console.log('Trading WebSocket Server initialized');
  }

  private setupSocketServer() {
    this.io.on('connection', (socket) => {
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
        const data = this.marketData.get(symbol);
        if (data) {
          socket.emit('marketData', { symbol, data });
        }
      });

      socket.on('unsubscribe', (symbol: string) => {
        client.subscriptions.delete(symbol);
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

  private startUpdates() {
    this.updateInterval = setInterval(() => {
      this.updateMarketData();
    }, 1000);
  }

  private updateMarketData() {
    this.marketData.forEach((data, symbol) => {
      const movement = (Math.random() - 0.5) * 0.0002;
      const newData = {
        bid: data.bid + movement,
        ask: data.ask + movement,
        timestamp: Date.now()
      };
      this.marketData.set(symbol, newData);

      this.clients.forEach(client => {
        if (client.subscriptions.has(symbol)) {
          client.socket.emit('marketData', { symbol, data: newData });
        }
      });
    });
  }

  public close() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

export default TradingWebSocketServer;
