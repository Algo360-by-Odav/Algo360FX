import WebSocket, { Server } from 'ws';
import { WebSocketClient, OptimizationMessage } from '../types/websocket';
import OptimizationWebSocket from '../websocket/optimization';

describe('OptimizationWebSocket', () => {
  let wsManager: OptimizationWebSocket;
  let mockServer: Server;
  let mockWs: WebSocket;
  let client: WebSocketClient;

  beforeEach(() => {
    mockServer = new Server({ noServer: true });
    wsManager = new OptimizationWebSocket(mockServer);
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
    it('should handle start optimization message', async () => {
      const message: OptimizationMessage = {
        type: 'start_optimization',
        config: {
          strategy: 'test-strategy',
          timeframe: 'M1',
          symbol: 'EURUSD',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          parameters: {
            period: {
              start: 10,
              end: 30,
              step: 10
            },
            threshold: {
              start: 0.1,
              end: 0.3,
              step: 0.1
            }
          }
        }
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"optimization_started"')
      );
    });

    it('should handle stop optimization message', async () => {
      const message: OptimizationMessage = {
        type: 'stop_optimization',
        optimizationId: 'test-optimization'
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"optimization_stopped"')
      );
    });

    it('should handle get optimization status message', async () => {
      const message: OptimizationMessage = {
        type: 'get_optimization_status',
        optimizationId: 'test-optimization'
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await wsManager['handleMessage'](client, message);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"optimization_status"')
      );
    });

    it('should handle invalid message type', async () => {
      const message: OptimizationMessage = {
        type: 'start_optimization',
        // Missing required config field
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
