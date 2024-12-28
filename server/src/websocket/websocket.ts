import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { logger } from '../utils/logger';

export class WebSocketBase {
  private wss: WebSocketServer;
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 30000; // 30 seconds
  private readonly CLOSE_TIMEOUT = 60000; // 60 seconds

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: process.env.WS_PATH || '/ws',
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    });

    this.setupWebSocket();
    this.startPingInterval();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      logger.info('Client connected to WebSocket');
      
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(ws, data);
        } catch (error) {
          logger.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({ 
            type: 'error', 
            data: { message: 'Invalid message format' } 
          }));
        }
      });

      ws.on('close', () => {
        logger.info('Client disconnected from WebSocket');
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
      });

      // Send initial connection success message
      ws.send(JSON.stringify({ 
        type: 'connection', 
        data: { status: 'connected' } 
      }));
    });

    this.wss.on('error', (error) => {
      logger.error('WebSocket server error:', error);
    });
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        }
      });
    }, this.PING_INTERVAL);
  }

  protected handleMessage(ws: WebSocket, message: any) {
    // Base message handling - to be overridden by child classes
    if (message.type === 'ping') {
      ws.send(JSON.stringify({ 
        type: 'pong', 
        data: { timestamp: Date.now() } 
      }));
    }
  }

  public getMetrics() {
    return {
      connectedClients: this.wss.clients.size,
      uptime: process.uptime()
    };
  }

  public close() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.wss.clients.forEach((ws: WebSocket) => {
      ws.close();
    });
    
    this.wss.close();
  }
}
