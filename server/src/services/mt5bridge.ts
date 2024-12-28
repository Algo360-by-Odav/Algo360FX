import WebSocket, { WebSocketServer } from 'ws';
import type { MetaApi, MetatraderAccount, MarketDataEvent } from 'metaapi.cloud-sdk';
import dotenv from 'dotenv';

dotenv.config();

const WS_PORT = parseInt(process.env.MT5_WS_PORT || '6780');

interface MT5Connection {
  ws: WebSocket;
  terminal?: MetatraderAccount;
}

interface MT5Message {
  type: string;
  data: Record<string, unknown>;
}

interface MT5Response {
  type: string;
  data: Record<string, unknown>;
}

interface MT5ConnectMessage extends MT5Message {
  type: 'connect';
  data: {
    accountId: string;
  };
}

interface MT5OrderMessage extends MT5Message {
  type: 'place_order';
  data: {
    symbol: string;
    volume: number;
    type?: 'buy' | 'sell';
    stopLoss?: number;
    takeProfit?: number;
  };
}

interface MT5PriceUpdate {
  symbol: string;
  bid: number;
  ask: number;
  time: string;
  brokerTime: string;
}

interface MT5Position {
  id: string;
  symbol: string;
  type: 'POSITION_TYPE_BUY' | 'POSITION_TYPE_SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  swap: number;
  commission: number;
  openTime: string;
}

interface MT5Order {
  id: string;
  symbol: string;
  type: string;
  state: string;
  volume: number;
  openPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: string;
}

export class MT5Bridge {
  private wss: WebSocketServer;
  private metaApi: MetaApi;
  private connections: Map<string, MT5Connection> = new Map();

  constructor(metaApi: MetaApi) {
    this.metaApi = metaApi;
    this.wss = new WebSocketServer({ port: WS_PORT });
  }

  public async start(): Promise<void> {
    console.log(`MT5 Bridge starting on port ${WS_PORT}`);
    
    this.wss.on('connection', (ws: WebSocket) => {
      const connectionId = Math.random().toString(36).substring(7);
      this.connections.set(connectionId, { ws });
      console.log(`New connection established: ${connectionId}`);

      ws.on('message', async (message: WebSocket.RawData) => {
        try {
          const data = JSON.parse(message.toString()) as MT5Message;
          await this.handleMessage(connectionId, data);
        } catch (error) {
          console.error('Error handling message:', error);
          this.sendError(ws, 'Failed to process message');
        }
      });

      ws.on('close', () => {
        const connection = this.connections.get(connectionId);
        if (connection?.terminal) {
          connection.terminal.disconnect();
        }
        this.connections.delete(connectionId);
        console.log(`Connection closed: ${connectionId}`);
      });
    });

    console.log(`MT5 Bridge Server running on port ${WS_PORT}`);
  }

  private async handleMessage(connectionId: string, message: MT5Message): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const { ws } = connection;

    switch (message.type) {
      case 'connect': {
        const connectMessage = message as MT5ConnectMessage;
        try {
          const terminal = await this.metaApi.metatraderAccountApi.getAccount(connectMessage.data.accountId);
          if (!terminal) throw new Error('Account not found');

          connection.terminal = terminal;
          await this.startUpdates(connectionId);

          this.sendResponse(ws, 'connected', { accountId: connectMessage.data.accountId });
        } catch (error) {
          this.sendError(ws, error instanceof Error ? error.message : 'Failed to connect');
        }
        break;
      }

      case 'place_order': {
        const orderMessage = message as MT5OrderMessage;
        try {
          const { symbol, volume, type = 'buy', stopLoss, takeProfit } = orderMessage.data;
          const terminal = connection.terminal;
          if (!terminal) throw new Error('Not connected to MT5');

          const order = type === 'buy'
            ? await terminal.createMarketBuyOrder(symbol, volume, { stopLoss, takeProfit, comment: 'Order from Algo360FX' })
            : await terminal.createMarketBuyOrder(symbol, -volume, { stopLoss, takeProfit, comment: 'Order from Algo360FX' });

          this.sendResponse(ws, 'order_placed', { ...order });
        } catch (error) {
          this.sendError(ws, error instanceof Error ? error.message : 'Failed to place order');
        }
        break;
      }

      default:
        this.sendError(ws, 'Unknown message type');
    }
  }

  private async startUpdates(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    const { ws, terminal } = connection;

    try {
      // Subscribe to price updates
      await terminal.subscribeToMarketData('EURUSD');
      
      // Listen for updates
      terminal.on('onSymbolPriceUpdated', (data: MarketDataEvent) => {
        const price = data as unknown as MT5PriceUpdate;
        this.sendResponse(ws, 'price_update', { ...price });
      });

      // Listen for position updates
      terminal.on('onPositionUpdated', (data: MarketDataEvent) => {
        const position = data as unknown as MT5Position;
        this.sendResponse(ws, 'position_update', { ...position });
      });

      // Listen for order updates
      terminal.on('onOrderUpdated', (data: MarketDataEvent) => {
        const order = data as unknown as MT5Order;
        this.sendResponse(ws, 'order_update', { ...order });
      });

      // Listen for connection status
      terminal.on('connected', () => {
        this.sendResponse(ws, 'status', { connected: true });
      });

      terminal.on('disconnected', () => {
        this.sendResponse(ws, 'status', { connected: false });
      });

      terminal.on('error', (data: MarketDataEvent) => {
        const error = data as unknown as Error;
        this.sendResponse(ws, 'error', { 
          message: error.message,
          name: error.name
        });
      });

    } catch (error) {
      this.sendError(ws, error instanceof Error ? error.message : 'Failed to start updates');
    }
  }

  private sendResponse(ws: WebSocket, type: string, data: Record<string, unknown>): void {
    ws.send(JSON.stringify({ type, data }));
  }

  private sendError(ws: WebSocket, message: string): void {
    ws.send(JSON.stringify({
      type: 'error',
      data: { message }
    }));
  }

  public stop() {
    // Close all connections
    this.connections.forEach(connection => {
      if (connection.terminal) {
        connection.terminal.disconnect();
      }
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.close();
      }
    });

    // Clear connections
    this.connections.clear();

    // Close WebSocket server
    this.wss.close();
  }
}

export default MT5Bridge;
