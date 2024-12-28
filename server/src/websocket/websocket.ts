import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { logger } from '../utils/logger';

export class WebSocketBase {
  private wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.setupWebSocket();
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
    this.wss.clients.forEach((ws: WebSocket) => {
      ws.close();
    });
    
    this.wss.close();
  }
}
