import { EventEmitter } from 'events';
import { BrokerConnection, ConnectionStatus, OrderType, TimeInForce } from './types';

export class IBKRService extends EventEmitter implements BrokerConnection {
  private socket: WebSocket | null = null;
  private apiKey: string;
  private apiSecret: string;
  private serverUrl: string;
  private status: ConnectionStatus = 'disconnected';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeat: number = 0;

  constructor(config: { apiKey: string; apiSecret: string; serverUrl: string }) {
    super();
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.serverUrl = config.serverUrl;
  }

  async connect(): Promise<void> {
    try {
      if (this.socket) {
        this.socket.close();
      }

      this.socket = new WebSocket(this.serverUrl);
      this.setupSocketHandlers();
      
      await this.waitForConnection();
      await this.authenticate();
      
      this.startHeartbeat();
      this.status = 'connected';
      this.emit('connected');
    } catch (error) {
      this.status = 'error';
      this.emit('error', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.stopHeartbeat();
      this.socket.close();
      this.socket = null;
      this.status = 'disconnected';
      this.emit('disconnected');
    }
  }

  async getAccountInfo(): Promise<any> {
    return this.sendRequest({
      method: 'GET',
      endpoint: '/v1/portal/account',
    });
  }

  async getPositions(): Promise<any> {
    return this.sendRequest({
      method: 'GET',
      endpoint: '/v1/portal/positions',
    });
  }

  async placeOrder(order: {
    symbol: string;
    quantity: number;
    type: OrderType;
    timeInForce: TimeInForce;
    price?: number;
    stopPrice?: number;
  }): Promise<any> {
    return this.sendRequest({
      method: 'POST',
      endpoint: '/v1/portal/orders',
      data: order,
    });
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.sendRequest({
      method: 'DELETE',
      endpoint: `/v1/portal/orders/${orderId}`,
    });
  }

  async getMarketData(symbol: string): Promise<any> {
    return this.sendRequest({
      method: 'GET',
      endpoint: `/v1/portal/market-data/${symbol}`,
    });
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  private setupSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.status = 'connected';
      this.emit('connected');
    };

    this.socket.onclose = () => {
      this.status = 'disconnected';
      this.emit('disconnected');
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      this.status = 'error';
      this.emit('error', error);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'heartbeat':
            this.handleHeartbeat();
            break;
          case 'execution':
            this.emit('execution', message.data);
            break;
          case 'position':
            this.emit('position', message.data);
            break;
          case 'marketData':
            this.emit('marketData', message.data);
            break;
          default:
            this.emit('message', message);
        }
      } catch (error) {
        this.emit('error', error);
      }
    };
  }

  private async authenticate(): Promise<void> {
    const authMessage = {
      type: 'auth',
      data: {
        apiKey: this.apiKey,
        timestamp: Date.now(),
        signature: this.generateSignature(),
      },
    };

    await this.sendMessage(authMessage);
  }

  private generateSignature(): string {
    // Implement HMAC-SHA256 signature generation
    // This is a placeholder implementation
    const timestamp = Date.now().toString();
    const message = `${this.apiKey}${timestamp}`;
    return message;
  }

  private async sendMessage(message: any): Promise<void> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send(JSON.stringify(message));
  }

  private async sendRequest({ method, endpoint, data }: {
    method: string;
    endpoint: string;
    data?: any;
  }): Promise<any> {
    const requestId = crypto.randomUUID();
    const request = {
      type: 'request',
      requestId,
      method,
      endpoint,
      data,
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      const responseHandler = (message: any) => {
        if (message.requestId === requestId) {
          clearTimeout(timeout);
          this.removeListener('message', responseHandler);
          
          if (message.error) {
            reject(new Error(message.error));
          } else {
            resolve(message.data);
          }
        }
      };

      this.on('message', responseHandler);
      this.sendMessage(request).catch(reject);
    });
  }

  private async waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('WebSocket not initialized'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      this.socket.addEventListener('open', () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });

      this.socket.addEventListener('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      }, { once: true });
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (Date.now() - this.lastHeartbeat > 10000) {
        this.emit('error', new Error('Heartbeat timeout'));
        this.disconnect();
        this.handleReconnect();
      } else {
        this.sendMessage({ type: 'heartbeat' });
      }
    }, 5000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleHeartbeat(): void {
    this.lastHeartbeat = Date.now();
  }

  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      await this.connect();
    } catch (error) {
      this.emit('error', error);
    }
  }
}
