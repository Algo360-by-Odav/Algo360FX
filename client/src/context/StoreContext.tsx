import React, { createContext, useContext, useState } from 'react';
import { rootStore } from '../stores/rootStore';
import { authStore } from '../stores/authStore';
import { uiStore } from '../stores/uiStore';
import { portfolioStore } from '../stores/portfolioStore';
import { analysisStore } from '../stores/analysisStore';
import { strategyStore } from '../stores/strategyStore';
import { newsStore } from '../stores/newsStore';
import { priceStore } from '../stores/priceStore';
import { autoTradingStore } from '../stores/autoTradingStore';
import { hftStore } from '../stores/hftStore';
import { backtestingStore } from '../stores/backtestingStore';
import { tradingStore } from '../stores/tradingStore';
import { mt5Store } from '../stores/mt5Store';

export interface StoreContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  authStore: typeof authStore;
  uiStore: typeof uiStore;
  portfolioStore: typeof portfolioStore;
  analysisStore: typeof analysisStore;
  strategyStore: typeof strategyStore;
  newsStore: typeof newsStore;
  priceStore: typeof priceStore;
  autoTradingStore: typeof autoTradingStore;
  hftStore: typeof hftStore;
  backtestingStore: typeof backtestingStore;
  tradingStore: typeof tradingStore;
  mt5Store: typeof mt5Store;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const store: StoreContextType = {
    isLoading,
    setIsLoading,
    ...rootStore,
    tradingStore,
    mt5Store
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};
