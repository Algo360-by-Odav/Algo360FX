import WebSocket, { WebSocketServer } from 'ws';
import MetaApi from 'metaapi.cloud-sdk';
import dotenv from 'dotenv';

dotenv.config();

const WS_PORT = parseInt(process.env.MT5_WS_PORT || '6780');

interface MT5Connection {
  ws: WebSocket;
  account?: any;
  terminal?: any;
}

export class MT5Bridge {
  private wss: WebSocketServer;
  private metaApi: MetaApi;
  private connections: Map<string, MT5Connection> = new Map();

  constructor(metaApi: MetaApi) {
    this.metaApi = metaApi;
    this.wss = new WebSocketServer({ port: WS_PORT });
  }

  public async start() {
    console.log(`MT5 Bridge starting on port ${WS_PORT}`);
    
    this.wss.on('connection', (ws: WebSocket) => {
      const connectionId = Math.random().toString(36).substring(7);
      this.connections.set(connectionId, { ws });
      console.log(`New connection established: ${connectionId}`);

      ws.on('message', async (message: WebSocket.RawData) => {
        try {
          const data = JSON.parse(message.toString());
          await this.handleMessage(connectionId, data);
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            data: 'Failed to process message'
          }));
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

  private async handleMessage(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const { ws } = connection;

    switch (message.type) {
      case 'connect':
        try {
          const terminal = await this.metaApi.metatraderAccountApi.getAccount(message.data.accountId);
          if (!terminal) throw new Error('Account not found');

          connection.terminal = terminal;
          await this.startUpdates(connectionId);

          ws.send(JSON.stringify({
            type: 'connected',
            data: { accountId: message.data.accountId }
          }));
        } catch (error: any) {
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: error.message }
          }));
        }
        break;

      case 'place_order':
        try {
          const { symbol, volume, price } = message.data;
          const terminal = connection.terminal;
          if (!terminal) throw new Error('Not connected to MT5');

          const result = await terminal.createMarketBuyOrder(
            symbol,
            volume,
            price,
            0.1,
            0.1,
            { comment: 'Order from Algo360FX' }
          );

          ws.send(JSON.stringify({
            type: 'order_placed',
            data: result
          }));
        } catch (error) {
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: error.message }
          }));
        }
        break;

      default:
        ws.send(JSON.stringify({
          type: 'error',
          data: 'Unknown message type'
        }));
    }
  }

  private async startUpdates(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    const { ws, terminal } = connection;

    try {
      // Subscribe to price updates
      terminal.subscribeToMarketData('EURUSD');
      
      // Listen for updates
      terminal.on('onSymbolPriceUpdated', (price: any) => {
        ws.send(JSON.stringify({
          type: 'price_update',
          data: price
        }));
      });

      // Listen for position updates
      terminal.on('onPositionUpdated', (position: any) => {
        ws.send(JSON.stringify({
          type: 'position_update',
          data: position
        }));
      });

      // Listen for order updates
      terminal.on('onOrderUpdated', (order: any) => {
        ws.send(JSON.stringify({
          type: 'order_update',
          data: order
        }));
      });

    } catch (error) {
      console.error('Failed to start updates:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: 'Failed to start updates'
      }));
    }
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
