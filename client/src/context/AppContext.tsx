import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useSnackbar, SnackbarKey } from 'notistack';
import WebSocketService from '@/services/websocketService';
import { UI_CONFIG, WEBSOCKET_CONFIG } from '@/config/constants';

interface AppState {
  isLoading: boolean;
  loadingMessage: string | null;
  isConnected: boolean;
  notifications: Notification[];
  lastError: string | null;
  theme: 'light' | 'dark';
  language: string;
  layout: {
    sidebarOpen: boolean;
    chartLayout: 'default' | 'compact' | 'expanded';
  };
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
  autoHide?: boolean;
  action?: (key: SnackbarKey) => React.ReactNode;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; message?: string } }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_CHART_LAYOUT'; payload: AppState['layout']['chartLayout'] };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  showNotification: (message: string, type: Notification['type'], options?: Partial<Notification>) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setChartLayout: (layout: AppState['layout']['chartLayout']) => void;
  clearNotifications: () => void;
};

const initialState: AppState = {
  isLoading: false,
  loadingMessage: null,
  isConnected: false,
  notifications: [],
  lastError: null,
  theme: (localStorage.getItem('theme') as AppState['theme']) || UI_CONFIG.THEME.DEFAULT,
  language: localStorage.getItem('language') || 'en',
  layout: {
    sidebarOpen: true,
    chartLayout: 'default'
  }
};

const AppContext = createContext<AppContextType | null>(null);

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
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_LANGUAGE':
      localStorage.setItem('language', action.payload);
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        layout: {
          ...state.layout,
          sidebarOpen: action.payload,
        },
      };
    case 'SET_CHART_LAYOUT':
      return {
        ...state,
        layout: {
          ...state.layout,
          chartLayout: action.payload,
        },
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { enqueueSnackbar } = useSnackbar();
  const wsService = WebSocketService.getInstance();

  const showNotification = useCallback((
    message: string,
    type: Notification['type'] = 'info',
    options: Partial<Notification> = {}
  ) => {
    const notification = {
      message,
      type,
      autoHide: true,
      ...options,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    if (notification.autoHide) {
      enqueueSnackbar(message, {
        variant: type,
        autoHideDuration: UI_CONFIG.SNACKBAR.AUTO_HIDE_DURATION,
        action: notification.action,
      });
    }
  }, [enqueueSnackbar]);

  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  }, [state.theme]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: !state.layout.sidebarOpen });
  }, [state.layout.sidebarOpen]);

  const setChartLayout = useCallback((layout: AppState['layout']['chartLayout']) => {
    dispatch({ type: 'SET_CHART_LAYOUT', payload: layout });
  }, []);

  const clearNotifications = useCallback(() => {
    state.notifications.forEach(notification => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    });
  }, [state.notifications]);

  useEffect(() => {
    const handleConnect = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
      showNotification('Connected to server', 'success');
    };

    const handleDisconnect = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      showNotification('Disconnected from server', 'warning');
    };

    const handleError = (error: Error) => {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification(`Connection error: ${error.message}`, 'error');
    };

    const handleNotification = (data: any) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: data.message,
          type: data.type || 'info',
        },
      });
    };

    // Subscribe to WebSocket events
    wsService.subscribe(WEBSOCKET_CONFIG.ENDPOINTS.CONNECT, handleConnect);
    wsService.subscribe(WEBSOCKET_CONFIG.ENDPOINTS.DISCONNECT, handleDisconnect);
    wsService.subscribe(WEBSOCKET_CONFIG.ENDPOINTS.ERROR, handleError);
    wsService.subscribe(WEBSOCKET_CONFIG.ENDPOINTS.NOTIFICATIONS, handleNotification);

    return () => {
      // Cleanup subscriptions
      wsService.unsubscribe(WEBSOCKET_CONFIG.ENDPOINTS.CONNECT, handleConnect);
      wsService.unsubscribe(WEBSOCKET_CONFIG.ENDPOINTS.DISCONNECT, handleDisconnect);
      wsService.unsubscribe(WEBSOCKET_CONFIG.ENDPOINTS.ERROR, handleError);
      wsService.unsubscribe(WEBSOCKET_CONFIG.ENDPOINTS.NOTIFICATIONS, handleNotification);
    };
  }, [showNotification]);

  return (
    <AppContext.Provider 
      value={{ 
        state, 
        dispatch, 
        showNotification, 
        toggleTheme, 
        toggleSidebar, 
        setChartLayout,
        clearNotifications
      }}
    >
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

export const useNotification = () => {
  const { showNotification } = useApp();
  return { showNotification };
};

export default AppContext;
