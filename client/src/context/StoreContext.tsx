import React, { createContext, useContext, useState } from 'react';

interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  margin: number;
  swap: number;
  commission: number;
  openTime: string;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  openTime: string;
  closeTime: string;
}

interface Indicator {
  id: string;
  name: string;
  type: string;
  period: number;
}

interface OrderBookEntry {
  price: number;
  volume: number;
}

interface OrderBook {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
}

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Order {
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
}

interface TradingStore {
  positions: Position[];
  tradeHistory: Trade[];
  indicators: Indicator[];
  orderBook: OrderBook;
  historicalData: CandlestickData[];
  getPositions: () => Promise<Position[]>;
  closePosition: (positionId: string) => Promise<void>;
  modifyPosition: (positionId: string, takeProfit: number | null, stopLoss: number | null) => Promise<void>;
  removeIndicator: (indicatorId: string) => void;
  submitOrder: (order: Order) => Promise<void>;
}

interface MT5Store {
  connect: (accountId: string, password: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  getAccountInfo: () => Promise<any>;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

interface UIStore {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

interface StoreContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage: string | null;
  setLoadingMessage: (message: string | null) => void;
  tradingStore: TradingStore;
  mt5Store: MT5Store;
  authStore: AuthStore;
  uiStore: UIStore;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeHistory] = useState<Trade[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [orderBook] = useState<OrderBook>({ asks: [], bids: [] });
  const [historicalData] = useState<CandlestickData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const tradingStore: TradingStore = {
    positions,
    tradeHistory,
    indicators,
    orderBook,
    historicalData,

    getPositions: async () => {
      try {
        // Implement actual API call here
        return positions;
      } catch (error) {
        console.error('Failed to fetch positions:', error);
        throw error;
      }
    },

    closePosition: async (positionId: string) => {
      try {
        // Implement actual API call here
        setPositions(positions.filter(p => p.id !== positionId));
      } catch (error) {
        console.error('Failed to close position:', error);
        throw error;
      }
    },

    modifyPosition: async (positionId: string, takeProfit: number | null, stopLoss: number | null) => {
      try {
        // Implement actual API call here
        setPositions(positions.map(p =>
          p.id === positionId
            ? { ...p, takeProfit, stopLoss }
            : p
        ));
      } catch (error) {
        console.error('Failed to modify position:', error);
        throw error;
      }
    },

    removeIndicator: (indicatorId: string) => {
      setIndicators(indicators.filter(i => i.id !== indicatorId));
    },

    submitOrder: async (order: Order) => {
      try {
        // Implement actual API call here
        console.log('Submitting order:', order);
      } catch (error) {
        console.error('Failed to submit order:', error);
        throw error;
      }
    }
  };

  const mt5Store: MT5Store = {
    connect: async (accountId: string, password: string) => {
      try {
        // Implement actual MT5 connection here
        console.log('Connecting to MT5:', { accountId, password });
        return true;
      } catch (error) {
        console.error('Failed to connect to MT5:', error);
        throw error;
      }
    },

    disconnect: async () => {
      try {
        // Implement actual MT5 disconnection here
        console.log('Disconnecting from MT5');
      } catch (error) {
        console.error('Failed to disconnect from MT5:', error);
        throw error;
      }
    },

    getAccountInfo: async () => {
      try {
        // Implement actual MT5 account info retrieval here
        return {
          balance: 10000,
          equity: 10000,
          margin: 0,
          freeMargin: 10000,
          marginLevel: 100
        };
      } catch (error) {
        console.error('Failed to get MT5 account info:', error);
        throw error;
      }
    }
  };

  const authStore: AuthStore = {
    isAuthenticated,
    user,
    isLoading: authLoading,
    error: authError,

    login: async (email: string) => {
      try {
        setAuthLoading(true);
        // Implement actual login API call here
        setIsAuthenticated(true);
        setUser({ email });
      } catch (error: unknown) {
        console.error('Failed to login:', error);
        if (error instanceof Error) {
          setAuthError(error.message);
        } else {
          setAuthError('An unknown error occurred');
        }
        throw error;
      } finally {
        setAuthLoading(false);
      }
    },

    register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
      try {
        setAuthLoading(true);
        // Implement actual registration API call here
        console.log('Registering user:', { email: data.email, firstName: data.firstName, lastName: data.lastName });
      } catch (error: unknown) {
        console.error('Failed to register:', error);
        if (error instanceof Error) {
          setAuthError(error.message);
        } else {
          setAuthError('An unknown error occurred');
        }
        throw error;
      } finally {
        setAuthLoading(false);
      }
    },

    logout: async () => {
      try {
        // Implement actual logout API call here
        setIsAuthenticated(false);
        setUser(null);
      } catch (error) {
        console.error('Failed to logout:', error);
        throw error;
      }
    },

    resetPassword: async (email: string) => {
      try {
        // Implement actual password reset API call here
        console.log('Resetting password for:', email);
      } catch (error) {
        console.error('Failed to reset password:', error);
        throw error;
      }
    },

    forgotPassword: async (email: string) => {
      try {
        // Implement actual forgot password API call here
        console.log('Sending password reset email to:', email);
      } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
      }
    }
  };

  const uiStore: UIStore = {
    isSidebarOpen,
    setIsSidebarOpen,
    theme,
    setTheme
  };

  const value = {
    isLoading,
    setIsLoading,
    loadingMessage,
    setLoadingMessage,
    tradingStore,
    mt5Store,
    authStore,
    uiStore
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
