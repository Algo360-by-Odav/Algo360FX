import WebSocket from 'ws';
import MetaApi from 'metaapi.cloud-sdk';

const MT5_API_TOKEN = process.env.MT5_API_TOKEN || 'your-metaapi-token';
const WS_PORT = process.env.WS_PORT || 6777;

class MT5Bridge {
  private wss: WebSocket.Server;
  private metaApi: MetaApi;
  private connections: Map<string, {
    ws: WebSocket;
    account?: any;
    terminal?: any;
  }> = new Map();

  constructor() {
    this.wss = new WebSocket.Server({ port: Number(WS_PORT) });
    this.metaApi = new MetaApi(MT5_API_TOKEN);
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');
      
      const connectionId = Math.random().toString(36).substring(7);
      this.connections.set(connectionId, { ws });

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(connectionId, data);
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }));
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.connections.delete(connectionId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.connections.delete(connectionId);
      });
    });

    console.log(`MT5 Bridge WebSocket server running on port ${WS_PORT}`);
  }

  private async handleMessage(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const { ws } = connection;

    try {
      switch (message.type) {
        case 'connect':
          await this.handleConnect(connectionId, message.accountId);
          break;
        case 'subscribe':
          await this.handleSubscribe(connectionId, message.symbols);
          break;
        case 'unsubscribe':
          await this.handleUnsubscribe(connectionId, message.symbols);
          break;
        case 'placeOrder':
          await this.handlePlaceOrder(connectionId, message.order);
          break;
        case 'modifyOrder':
          await this.handleModifyOrder(connectionId, message.order);
          break;
        case 'cancelOrder':
          await this.handleCancelOrder(connectionId, message.orderId);
          break;
        default:
          ws.send(JSON.stringify({ error: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }));
    }
  }

  private async handleConnect(connectionId: string, accountId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    try {
      const account = await this.metaApi.metatraderAccountApi.getAccount(accountId);
      const terminal = account.getStreamingConnection();
      await terminal.connect();

      this.connections.set(connectionId, { ...connection, account, terminal });
      connection.ws.send(JSON.stringify({ type: 'connected', accountId }));
    } catch (error) {
      console.error('Error connecting to MT5:', error);
      connection.ws.send(JSON.stringify({ error: 'Failed to connect to MT5' }));
    }
  }

  private async handleSubscribe(connectionId: string, symbols: string[]) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    try {
      await connection.terminal.subscribeToMarketData(symbols);
      connection.ws.send(JSON.stringify({ type: 'subscribed', symbols }));
    } catch (error) {
      console.error('Error subscribing to market data:', error);
      connection.ws.send(JSON.stringify({ error: 'Failed to subscribe to market data' }));
    }
  }

  private async handleUnsubscribe(connectionId: string, symbols: string[]) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    try {
      await connection.terminal.unsubscribeFromMarketData(symbols);
      connection.ws.send(JSON.stringify({ type: 'unsubscribed', symbols }));
    } catch (error) {
      console.error('Error unsubscribing from market data:', error);
      connection.ws.send(JSON.stringify({ error: 'Failed to unsubscribe from market data' }));
    }
  }

  private async handlePlaceOrder(connectionId: string, order: any) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    try {
      const result = await connection.terminal.createOrder(order);
      connection.ws.send(JSON.stringify({ type: 'orderPlaced', order: result }));
    } catch (error) {
      console.error('Error placing order:', error);
      connection.ws.send(JSON.stringify({ error: 'Failed to place order' }));
    }
  }

  private async handleModifyOrder(connectionId: string, order: any) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    try {
      const result = await connection.terminal.modifyOrder(order);
      connection.ws.send(JSON.stringify({ type: 'orderModified', order: result }));
    } catch (error) {
      console.error('Error modifying order:', error);
      connection.ws.send(JSON.stringify({ error: 'Failed to modify order' }));
    }
  }

  private async handleCancelOrder(connectionId: string, orderId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.terminal) return;

    try {
      await connection.terminal.cancelOrder(orderId);
      connection.ws.send(JSON.stringify({ type: 'orderCancelled', orderId }));
    } catch (error) {
      console.error('Error cancelling order:', error);
      connection.ws.send(JSON.stringify({ error: 'Failed to cancel order' }));
    }
  }
}

new MT5Bridge();
