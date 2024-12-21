class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second delay
  private isConnecting = false;

  // Get WebSocket URL from environment variables with fallback
  private wsUrl = import.meta.env.VITE_WS_URL || (
    import.meta.env.DEV 
      ? 'ws://localhost:3000'
      : 'wss://api.algo360fx.com/ws'
  );

  private constructor() {
    this.connect();
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private async connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      console.log(`Connecting to WebSocket at ${this.wsUrl}`);
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.isConnecting = false;
        this.emit('connect');

        // Resubscribe to all events
        if (this.listeners.size > 0) {
          console.log('Resubscribing to events...');
          this.listeners.forEach((callbacks, event) => {
            if (event !== 'connect' && event !== 'disconnect' && event !== 'error') {
              this.emit('subscribe', { event });
            }
          });
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed');
        this.isConnecting = false;
        this.emit('disconnect');
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;
          
          if (this.listeners.has(type)) {
            this.listeners.get(type)?.forEach(callback => callback(payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.emit('error', { message: 'Failed to parse WebSocket message' });
        }
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.isConnecting = false;
      this.emit('error', { message: 'Failed to connect to WebSocket' });
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached. Please check your connection and refresh the page.');
      this.emit('error', { message: 'Max reconnection attempts reached' });
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  emit(type: string, payload?: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else if (type !== 'error' && type !== 'disconnect') {
      console.warn(`WebSocket not connected. Cannot emit ${type}`);
      this.emit('error', { message: 'WebSocket not connected' });
    }
  }

  reconnect() {
    if (this.socket) {
      this.socket.close();
    }
    this.reconnectAttempts = 0;
    this.connect();
  }

  getStatus(): 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'NOT_INITIALIZED' {
    if (!this.socket) return 'NOT_INITIALIZED';
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'NOT_INITIALIZED';
    }
  }
}

export default WebSocketService.getInstance();
