import { WEBSOCKET_CONFIG } from '../config/websocket';

type WebSocketCallback = (data: any) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private subscriptions: Map<string, Set<WebSocketCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(token: string): void {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      // Use secure WebSocket for production, non-secure for localhost
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = process.env.REACT_APP_WS_PORT || '3001';
      const wsUrl = `${protocol}//${host}:${port}/ws?token=${token}`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        
        // Resubscribe to all channels after reconnection
        for (const [channel] of this.subscriptions) {
          this.send('subscribe', { channel });
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect(this.getStoredToken());
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private getStoredToken(): string {
    return localStorage.getItem('token') || '';
  }

  public subscribe(channel: string, callback: WebSocketCallback): void {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)?.add(callback);
  }

  public unsubscribe(channel: string, callback?: WebSocketCallback): void {
    if (!this.subscriptions.has(channel)) return;

    if (callback) {
      this.subscriptions.get(channel)?.delete(callback);
      if (this.subscriptions.get(channel)?.size === 0) {
        this.subscriptions.delete(channel);
      }
    } else {
      this.subscriptions.delete(channel);
    }
  }

  public send(event: string, data: any): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message: WebSocket is not connected');
      return;
    }

    try {
      this.socket.send(JSON.stringify({ event, ...data }));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  private handleMessage(data: any): void {
    const { event, channel, ...payload } = data;

    if (!event || !channel) {
      console.error('Received message without event type or channel:', data);
      return;
    }

    const callbacks = this.subscriptions.get(channel);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      });
    }
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.subscriptions.clear();
  }
}

export default WebSocketService;
