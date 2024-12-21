import { OptimizationConfig, OptimizationResultNew } from '../types/optimization';

export class OptimizationWebSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isConnecting = false;

  constructor(url: string = import.meta.env.VITE_OPTIMIZATION_WS_URL || 'ws://localhost:3000/optimization') {
    this.url = url;
  }

  async connect(): Promise<void> {
    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.isConnecting = false;
        return;
      }

      if (this.ws?.readyState === WebSocket.CONNECTING) {
        this.isConnecting = false;
        return;
      }

      console.log(`Connecting to optimization WebSocket at ${this.url}`);
      this.ws = new WebSocket(this.url);

      await new Promise<void>((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('WebSocket instance is null'));
          return;
        }

        const onOpen = () => {
          console.log('Optimization WebSocket connected');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.ws?.removeEventListener('open', onOpen);
          this.ws?.removeEventListener('error', onError);
          resolve();
        };

        const onError = (error: Event) => {
          console.error('Optimization WebSocket connection error:', error);
          this.ws?.removeEventListener('open', onOpen);
          this.ws?.removeEventListener('error', onError);
          reject(error);
        };

        this.ws.addEventListener('open', onOpen);
        this.ws.addEventListener('error', onError);

        this.ws.onclose = () => {
          console.log('Optimization WebSocket closed');
          this.isConnecting = false;
          this.handleReconnect();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            const handler = this.messageHandlers.get(message.type);
            if (handler) {
              handler(message.data);
            }
          } catch (error) {
            console.error('Error handling optimization WebSocket message:', error);
          }
        };
      });
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect to optimization WebSocket:', error);
      this.handleReconnect();
      throw error;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached for optimization WebSocket');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    console.log(`Attempting to reconnect optimization WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection attempt failed:', error);
      }
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.onclose = null; // Prevent reconnection attempt
      this.ws.close();
      this.ws = null;
    }

    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  async startOptimization(strategyId: string, config: OptimizationConfig): Promise<string> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      try {
        await this.connect();
      } catch (error) {
        throw new Error('Failed to connect to optimization WebSocket');
      }
    }

    const optimizationId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.ws!.send(JSON.stringify({
      type: 'start_optimization',
      data: {
        optimizationId,
        strategyId,
        config,
      },
    }));

    return optimizationId;
  }

  onProgress(optimizationId: string, callback: (progress: number) => void) {
    this.messageHandlers.set(`progress_${optimizationId}`, (data) => {
      callback(data.progress);
    });
  }

  onResult(optimizationId: string, callback: (result: OptimizationResultNew) => void) {
    this.messageHandlers.set(`result_${optimizationId}`, (data) => {
      callback(data);
    });
  }

  onError(optimizationId: string, callback: (error: Error) => void) {
    this.messageHandlers.set(`error_${optimizationId}`, (data) => {
      callback(new Error(data.message));
    });
  }

  removeOptimizationHandlers(optimizationId: string) {
    this.messageHandlers.delete(`progress_${optimizationId}`);
    this.messageHandlers.delete(`result_${optimizationId}`);
    this.messageHandlers.delete(`error_${optimizationId}`);
  }
}

export default new OptimizationWebSocket();
