import WebSocket, { Server } from 'ws';
import { WebSocketClient } from '../types/websocket';
import { OrderMessage } from '../types/order';
import TradingWebSocket from '../websocket/trading';

describe('TradingWebSocket', () => {
  let wsManager: TradingWebSocket;
  let mockServer: Server;
  let mockWs: WebSocket;
  let client: WebSocketClient;

  beforeEach(() => {
    mockServer = new Server({ noServer: true });
    wsManager = new TradingWebSocket(mockServer);
    mockWs = new WebSocket('ws://localhost:8080');
    client = {
      ws: mockWs,
      id: 'test-client',
      subscriptions: new Set<string>(),
      heartbeat: new Date()
    };
  });

  afterEach(() => {
    mockServer.close();
    mockWs.close();
  });

  describe('handleMessage', () => {
    it('should handle place order message', async () => {
      const message: OrderMessage = {
        type: 'placeOrder',
        symbol: 'EURUSD',
        orderType: 'market',
        side: 'buy',
        quantity: 1,
        price: 1.1000
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"order_placed"')
      );
    });

    it('should handle cancel order message', async () => {
      const message: OrderMessage = {
        type: 'cancelOrder',
        orderId: 'test-order'
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"order_cancelled"')
      );
    });

    it('should handle modify order message', async () => {
      const message: OrderMessage = {
        type: 'modifyOrder',
        orderId: 'test-order',
        price: 1.1000,
        quantity: 1
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"order_modified"')
      );
    });

    it('should handle invalid message type', async () => {
      const message: OrderMessage = {
        type: 'placeOrder',
        // Missing required fields: symbol, orderType, side, quantity
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"error"')
      );
    });

    it('should handle error during order placement', async () => {
      const message: OrderMessage = {
        type: 'placeOrder',
        symbol: 'INVALID',
        orderType: 'market',
        side: 'buy',
        quantity: -1 // Invalid quantity
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"error"')
      );
    });

    it('should handle error during order cancellation', async () => {
      const message: OrderMessage = {
        type: 'cancelOrder',
        orderId: 'non-existent-order'
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"error"')
      );
    });

    it('should handle error during order modification', async () => {
      const message: OrderMessage = {
        type: 'modifyOrder',
        orderId: 'non-existent-order',
        quantity: -1 // Invalid quantity
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"error"')
      );
    });
  });

  describe('handleDisconnect', () => {
    it('should remove client on disconnect', () => {
      wsManager['clients'].set(client.id, client);
      wsManager['handleDisconnect'](client);
      expect(wsManager['clients'].has(client.id)).toBe(false);
    });
  });
});
