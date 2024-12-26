import { io, Socket } from 'socket.io-client';

export class OptimizationWebSocketService {
  private socket: Socket | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    if (!this.socket) {
      const wsUrl = import.meta.env.VITE_WS_URL || 'wss://algo360fx-frontend.onrender.com';
      
      this.socket = io(wsUrl, {
        path: '/ws',
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        secure: true
      });

      this.setupEventHandlers();
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to optimization WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from optimization WebSocket');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('optimization_progress', (data) => {
      console.log('Optimization progress:', data);
    });

    this.socket.on('optimization_complete', (data) => {
      console.log('Optimization complete:', data);
    });

    this.socket.on('optimization_error', (error) => {
      console.error('Optimization error:', error);
    });
  }

  public startOptimization(params: any) {
    if (!this.socket?.connected) {
      this.connect();
    }
    this.socket?.emit('start_optimization', params);
  }

  public stopOptimization() {
    this.socket?.emit('stop_optimization');
  }

  public onProgress(callback: (progress: number) => void) {
    this.socket?.on('optimization_progress', callback);
  }

  public onResult(callback: (result: any) => void) {
    this.socket?.on('optimization_complete', callback);
  }

  public onError(callback: (error: string) => void) {
    this.socket?.on('optimization_error', callback);
  }

  public disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
