import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';

interface Client {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
}

class TradingWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, Client> = new Map();
  private marketData: Map<string, any> = new Map();
  private heartbeatInterval: NodeJS.Timeout;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, id) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          this.sendMessage(client.ws, 'heartbeat', { timestamp: new Date().toISOString() });
        } else {
          this.clients.delete(id);
        }
      });
    }, 30000); // Send heartbeat every 30 seconds
    this.setupWebSocket();
    this.initializeMarketData();
  }

  private setupWebSocket() {
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
          this.handleError(error as Error);
        }
      });

      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      ws.on('error', (error) => {
        this.handleError(error as Error);
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

  private handleMessage(client: Client, data: any) {
    const { type, payload } = data;

    switch (type) {
      case 'subscribe_market_data':
        this.handleSubscription(client, payload.symbol);
        break;
      case 'unsubscribe_market_data':
        this.handleUnsubscription(client, payload.symbol);
        break;
      case 'place_order':
        this.handlePlaceOrder(client, payload);
        break;
      case 'cancel_order':
        this.handleCancelOrder(client, payload);
        break;
      default:
        this.sendError(client.ws, `Unknown message type: ${type}`);
    }
  }

  private handleSubscription(client: Client, symbol: string) {
    if (!this.marketData.has(symbol)) {
      this.sendError(client.ws, `Invalid symbol: ${symbol}`);
      return;
    }

    client.subscriptions.add(symbol);
    const data = this.marketData.get(symbol);
    this.sendMessage(client.ws, 'market_data', data);
  }

  private handleUnsubscription(client: Client, symbol: string) {
    client.subscriptions.delete(symbol);
  }

  private handlePlaceOrder(client: Client, order: any) {
    // Simulate order processing
    const orderId = uuidv4();
    const processedOrder = {
      ...order,
      id: orderId,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };

    // Send order confirmation
    this.sendMessage(client.ws, 'order_update', processedOrder);

    // Simulate order execution after a short delay
    setTimeout(() => {
      const executedOrder = {
        ...processedOrder,
        status: 'FILLED',
        filledPrice: this.marketData.get(order.symbol)?.bid || 0,
      };
      this.sendMessage(client.ws, 'order_update', executedOrder);
    }, 500);
  }

  private handleCancelOrder(client: Client, { orderId }: { orderId: string }) {
    // Simulate order cancellation
    this.sendMessage(client.ws, 'order_update', {
      id: orderId,
      status: 'CANCELLED',
      timestamp: new Date().toISOString()
    });
  }

  private sendMessage(ws: WebSocket, type: string, payload: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }));
    }
  }

  private sendError(ws: WebSocket, message: string) {
    this.sendMessage(ws, 'error', { message });
  }

  private randomPrice(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(5));
  }

  private handleError(error: Error) {
    console.error('WebSocket error:', error);
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        this.sendMessage(client.ws, 'error', { message: error.message });
      }
    });
  }

  public close() {
    clearInterval(this.heartbeatInterval);
    this.wss.close();
  }
}

export default TradingWebSocketServer;
