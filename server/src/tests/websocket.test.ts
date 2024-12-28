import WebSocket, { Server } from 'ws';
import { WebSocketClient, BaseMessage } from '../types/websocket';
import WebSocketBase from '../websocket/websocket';

describe('WebSocketBase', () => {
  let wsManager: WebSocketBase;
  let mockServer: Server;
  let mockWs: WebSocket;
  let client: WebSocketClient;

  beforeEach(() => {
    mockServer = new Server({ noServer: true });
    wsManager = new WebSocketBase(mockServer);
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

  describe('setupWebSocket', () => {
    it('should set up WebSocket server', () => {
      const server = new Server({ noServer: true });
      const ws = new WebSocketBase(server);
      expect(ws).toBeDefined();
    });
  });

  describe('handleMessage', () => {
    it('should throw not implemented error', async () => {
      const message: BaseMessage = {
        type: 'test'
      };

      // Mock the client's send method
      client.ws.send = jest.fn();

      await expect(wsManager['handleMessage'](client, message))
        .rejects
        .toThrow('Method not implemented');
    });
  });

  describe('handleDisconnect', () => {
    it('should remove client on disconnect', () => {
      wsManager['clients'].set(client.id, client);
      wsManager['handleDisconnect'](client);
      expect(wsManager['clients'].has(client.id)).toBe(false);
    });
  });

  describe('sendError', () => {
    it('should send error message to client', () => {
      client.ws.send = jest.fn();
      wsManager['sendError'](client, 'Test error');
      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"error"')
      );
    });
  });

  describe('checkHeartbeats', () => {
    it('should remove stale clients', () => {
      const staleClient = {
        ...client,
        heartbeat: new Date(Date.now() - 40000)
      };
      staleClient.ws.terminate = jest.fn();

      wsManager['clients'].set(staleClient.id, staleClient);
      wsManager['checkHeartbeats']();

      expect(wsManager['clients'].has(staleClient.id)).toBe(false);
      expect(staleClient.ws.terminate).toHaveBeenCalled();
    });

    it('should keep active clients', () => {
      const activeClient = {
        ...client,
        heartbeat: new Date()
      };

      wsManager['clients'].set(activeClient.id, activeClient);
      wsManager['checkHeartbeats']();

      expect(wsManager['clients'].has(activeClient.id)).toBe(true);
    });
  });

  describe('setupClientHandlers', () => {
    it('should handle client message', async () => {
      client.ws.send = jest.fn();
      wsManager['clients'].set(client.id, client);
      wsManager['setupClientHandlers'](client);

      // Simulate message event
      const messageEvent = JSON.stringify({ type: 'test' });
      const messageHandler = (client.ws.on as jest.Mock).mock.calls.find(
        call => call[0] === 'message'
      )[1];
      await messageHandler(messageEvent);

      expect(client.ws.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"error"')
      );
    });

    it('should handle client close', () => {
      wsManager['clients'].set(client.id, client);
      wsManager['setupClientHandlers'](client);

      // Simulate close event
      const closeHandler = (client.ws.on as jest.Mock).mock.calls.find(
        call => call[0] === 'close'
      )[1];
      closeHandler();

      expect(wsManager['clients'].has(client.id)).toBe(false);
    });

    it('should update heartbeat on pong', () => {
      const initialHeartbeat = new Date(Date.now() - 1000);
      client.heartbeat = initialHeartbeat;
      wsManager['clients'].set(client.id, client);
      wsManager['setupClientHandlers'](client);

      // Simulate pong event
      const pongHandler = (client.ws.on as jest.Mock).mock.calls.find(
        call => call[0] === 'pong'
      )[1];
      pongHandler();

      const updatedClient = wsManager['clients'].get(client.id);
      expect(updatedClient?.heartbeat.getTime()).toBeGreaterThan(initialHeartbeat.getTime());
    });
  });
});
