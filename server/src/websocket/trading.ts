import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';

interface Client {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
}

export class TradingWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, Client> = new Map();
  private marketData: Map<string, any> = new Map();
  private heartbeatInterval: NodeJS.Timeout;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/',
      clientTracking: true
    });
    this.setupWebSocketServer();
    this.initializeMarketData();
    this.startHeartbeat();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = uuidv4();
      const client: Client = {
        id: clientId,
        ws,
        subscriptions: new Set()
      };

      this.clients.set(clientId, client);
      console.log(`Client connected: ${clientId}`);

      // Send initial market data
      this.sendMessage(ws, 'connect', { status: 'connected', clientId });

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(client, data);
        } catch (error) {
          console.error('Error parsing message:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });
  }

  private initializeMarketData() {
    // Initialize with some default market data
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD'];
    symbols.forEach(symbol => {
      this.marketData.set(symbol, {
        symbol,
        bid: this.randomPrice(1.0, 1.2),
        ask: this.randomPrice(1.0, 1.2),
        timestamp: new Date().toISOString()
      });
    });

    // Start updating market data periodically
    setInterval(() => {
      this.updateMarketData();
    }, 1000);
  }

  private updateMarketData() {
    this.marketData.forEach((data, symbol) => {
      const change = (Math.random() - 0.5) * 0.0010;
      const bid = Number((data.bid + change).toFixed(5));
      const ask = Number((bid + 0.0002).toFixed(5));

      const updatedData = {
        symbol,
        bid,
        ask,
        timestamp: new Date().toISOString()
      };

      this.marketData.set(symbol, updatedData);

      // Send updates to subscribed clients
      this.clients.forEach(client => {
        if (client.subscriptions.has(symbol)) {
          this.sendMessage(client.ws, 'market_data', updatedData);
        }
      });
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          this.sendMessage(client.ws, 'heartbeat', { timestamp: Date.now() });
        } else {
          console.log(`Removing inactive client: ${clientId}`);
          this.clients.delete(clientId);
        }
      });
    }, 30000); // Send heartbeat every 30 seconds
  }

  private handleMessage(client: Client, message: any) {
    const { type, data } = message;

    switch (type) {
      case 'subscribe':
        if (data.symbol) {
          client.subscriptions.add(data.symbol);
          const marketData = this.marketData.get(data.symbol);
          if (marketData) {
            this.sendMessage(client.ws, 'market_data', marketData);
          }
        }
        break;

      case 'unsubscribe':
        if (data.symbol) {
          client.subscriptions.delete(data.symbol);
        }
        break;

      case 'place_order':
        // Handle order placement
        this.sendMessage(client.ws, 'order_placed', {
          orderId: uuidv4(),
          ...data
        });
        break;

      default:
        this.sendError(client.ws, `Unknown message type: ${type}`);
    }
  }

  private sendMessage(ws: WebSocket, type: string, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data }));
    }
  }

  private sendError(ws: WebSocket, message: string) {
    this.sendMessage(ws, 'error', { message });
  }

  private randomPrice(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(5));
  }

  public close() {
    clearInterval(this.heartbeatInterval);
    this.wss.close();
  }
}

export default TradingWebSocketServer;
