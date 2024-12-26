import { io, Socket } from 'socket.io-client';
import { OptimizationConfig, OptimizationResultNew } from '@/types/optimization';

export class OptimizationWebSocket {
  private socket: Socket | null = null;
  private readonly url: string;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(url: string = import.meta.env.VITE_OPTIMIZATION_WS_URL || 'http://localhost:5000') {
    this.url = url;
  }

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    console.log('Connecting to optimization Socket.IO at', this.url);

    try {
      this.socket = io(this.url, {
        path: '/ws',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket'],
        forceNew: true,
        autoConnect: true
      });
      
      this.setupSocketHandlers();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      throw error;
    }
  }

  private setupSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Optimization Socket.IO connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Optimization Socket.IO disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Optimization Socket.IO connection error:', error);
    });

    this.socket.on('optimization_progress', (data) => {
      const handler = this.messageHandlers.get('optimization_progress');
      if (handler) {
        handler(data);
      }
    });

    this.socket.on('optimization_completed', (data) => {
      const handler = this.messageHandlers.get('optimization_complete');
      if (handler) {
        handler(data);
      }
    });

    this.socket.on('error', (data) => {
      const handler = this.messageHandlers.get('optimization_error');
      if (handler) {
        handler(data);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  removeMessageHandler(type: string): void {
    this.messageHandlers.delete(type);
  }

  startOptimization(config: OptimizationConfig): void {
    if (!this.socket?.connected) {
      throw new Error('WebSocket is not connected');
    }
    this.socket.emit('start_optimization', config);
  }

  stopOptimization(optimizationId: string): void {
    if (!this.socket?.connected) {
      throw new Error('WebSocket is not connected');
    }
    this.socket.emit('stop_optimization', optimizationId);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public onOptimizationProgress(handler: (data: { optimizationId: string; progress: number }) => void): void {
    this.messageHandlers.set('optimization_progress', handler);
  }

  public onOptimizationComplete(handler: (data: { optimizationId: string; result: OptimizationResultNew }) => void): void {
    this.messageHandlers.set('optimization_complete', handler);
  }

  public onOptimizationError(handler: (data: { optimizationId: string; error: string }) => void): void {
    this.messageHandlers.set('optimization_error', handler);
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new OptimizationWebSocket();
