import { useState, useEffect, useCallback } from 'react';

interface WebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (url: string = 'wss://api.algo360fx.com/ws', options: WebSocketOptions = {}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onOpen,
    onClose,
    onError,
  } = options;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setReconnectCount(0);
        onOpen?.();
      };

      ws.onclose = () => {
        setIsConnected(false);
        onClose?.();

        // Attempt to reconnect
        if (reconnectCount < reconnectAttempts) {
          setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error: Event) => {
        onError?.(error);
      };

      ws.onmessage = (event: MessageEvent) => {
        setLastMessage(event.data);
      };

      setSocket(ws);
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url, reconnectCount, reconnectAttempts, reconnectInterval, onOpen, onClose, onError]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: string | object) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(typeof message === 'string' ? message : JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, [socket]);

  const subscribeToSymbol = useCallback((symbol: string) => {
    if (isConnected) {
      sendMessage({
        type: 'subscribe',
        symbol,
      });
    }
  }, [isConnected, sendMessage]);

  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    if (isConnected) {
      sendMessage({
        type: 'unsubscribe',
        symbol,
      });
    }
  }, [isConnected, sendMessage]);

  return {
    socket,
    isConnected,
    lastMessage,
    sendMessage,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    reconnectCount,
  };
};
