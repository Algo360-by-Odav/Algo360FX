import React, { createContext, useContext, useReducer, useEffect } from 'react';
import websocketService from '../services/websocketService';

interface AppState {
  isLoading: boolean;
  loadingMessage: string | null;
  isConnected: boolean;
  notifications: Notification[];
  lastError: string | null;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; message?: string } }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  isLoading: false,
  loadingMessage: null,
  isConnected: false,
  notifications: [],
  lastError: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        loadingMessage: action.payload.message || null,
      };
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            ...action.payload,
          },
          ...state.notifications,
        ].slice(0, 5), // Keep only last 5 notifications
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'SET_ERROR':
      return {
        ...state,
        lastError: action.payload,
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const handleConnect = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Connected to server',
          type: 'success',
        },
      });
    };

    const handleDisconnect = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Disconnected from server',
          type: 'warning',
        },
      });
    };

    const handleError = (error: Error) => {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Connection error: ${error.message}`,
          type: 'error',
        },
      });
    };

    // Subscribe to WebSocket events
    websocketService.subscribe('connect', handleConnect);
    websocketService.subscribe('disconnect', handleDisconnect);
    websocketService.subscribe('error', handleError);

    return () => {
      // Cleanup subscriptions
      websocketService.unsubscribe('connect', handleConnect);
      websocketService.unsubscribe('disconnect', handleDisconnect);
      websocketService.unsubscribe('error', handleError);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
