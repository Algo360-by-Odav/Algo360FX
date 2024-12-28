import React, { createContext, useContext, useCallback, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface WebSocketContextState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  send: (data: any) => void;
  disconnect: () => void;
  reconnect: () => void;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextState | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  url: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url,
}) => {
  const [lastMessage, setLastMessage] = useState<any>(null);

  const handleMessage = useCallback((data: any) => {
    setLastMessage(data);
  }, []);

  const {
    connected,
    connecting,
    error,
    send,
    disconnect,
    reconnect,
  } = useWebSocket({
    url,
    onMessage: handleMessage,
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
  });

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        connecting,
        error,
        send,
        disconnect,
        reconnect,
        lastMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
