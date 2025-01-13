import { WEBSOCKET_CONFIG } from '@/config/constants';
import { fetchAuthSession } from 'aws-amplify/auth';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private subscriptions: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.CONFIG.RECONNECT_ATTEMPTS;
  private reconnectTimeout = WEBSOCKET_CONFIG.CONFIG.RECONNECT_DELAY;
  private isConnecting = false;

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async connect(): Promise<void> {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        console.log('No auth token available, delaying connection...');
        setTimeout(() => this.connect(), 5000); // Try again in 5 seconds
        return;
      }

      // Parse the WebSocket URL
      const wsUrl = new URL(WEBSOCKET_CONFIG.ENDPOINTS.MT5_BRIDGE_URL);
      
      // Add the auth token as a query parameter
      wsUrl.searchParams.append('Authorization', `Bearer ${token}`);

      console.log('Connecting to WebSocket...', wsUrl.toString());
      this.socket = new WebSocket(wsUrl.toString());

      this.socket.onopen = () => {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.resubscribeAll();
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const endpoint = data.endpoint;
          const handlers = this.subscriptions.get(endpoint);
          
          if (handlers) {
            handlers.forEach(handler => handler(data.payload));
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff with 30s max
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnecting && this.socket?.readyState !== WebSocket.OPEN) {
        this.connect();
      }
    }, delay);
  }

  private resubscribeAll(): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }

    this.subscriptions.forEach((handlers, endpoint) => {
      this.socket!.send(JSON.stringify({
        action: 'subscribe',
        endpoint
      }));
    });
  }

  public subscribe(endpoint: string, handler: MessageHandler): void {
    let handlers = this.subscriptions.get(endpoint);
    if (!handlers) {
      handlers = new Set();
      this.subscriptions.set(endpoint, handlers);
    }
    handlers.add(handler);

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        action: 'subscribe',
        endpoint
      }));
    } else {
      this.connect(); // Try to connect if not already connected
    }
  }

  public unsubscribe(endpoint: string, handler: MessageHandler): void {
    const handlers = this.subscriptions.get(endpoint);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.subscriptions.delete(endpoint);
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({
            action: 'unsubscribe',
            endpoint
          }));
        }
      }
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }
}

export default WebSocketService;
