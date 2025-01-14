import { WEBSOCKET_CONFIG } from '@/config/constants';
import { fetchAuthSession } from 'aws-amplify/auth';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private subscriptions: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WEBSOCKET_CONFIG.CONFIG.RECONNECT_ATTEMPTS;
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

  private async connect() {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        throw new Error('No access token available');
      }

      this.socket = new WebSocket(`${WEBSOCKET_CONFIG.CONFIG.URL}?token=${token}`);
      this.setupSocketHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    } finally {
      this.isConnecting = false;
    }
  }

  private setupSocketHandlers() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type, payload } = data;
        this.notifySubscribers(type, payload);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  public subscribe(type: string, handler: MessageHandler) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, new Set());
    }
    this.subscriptions.get(type)?.add(handler);
  }

  public unsubscribe(type: string, handler: MessageHandler) {
    this.subscriptions.get(type)?.delete(handler);
  }

  private notifySubscribers(type: string, payload: any) {
    const handlers = this.subscriptions.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }

  public send(type: string, payload: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.subscriptions.clear();
  }
}

export default WebSocketService;
