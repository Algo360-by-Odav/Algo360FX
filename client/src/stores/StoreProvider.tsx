import React, { createContext, useContext } from 'react';
import { PortfolioStore, portfolioStore } from './portfolioStore';
import { AnalysisStore, analysisStore } from './analysisStore';
import { AutoTradingStore, autoTradingStore } from './autoTradingStore';
import { EbookStore } from './ebookStore';
import { subscriptionService } from '../services/subscriptionService';
import { InvestorPortalStore } from './investorPortalStore';
import { SignalProviderStore } from './signalProviderStore';
import { RootStore } from './rootStore';
import { NftStore, nftStore } from './nftStore';
import { MT5Store } from './mt5Store';
import { HftStore, hftStore } from './hftStore';
import { tradingStore } from './tradingStore';
import { authStore } from './authStore';
import { themeStore } from './themeStore';
import { aiAssistantStore } from './aiAssistantStore';

interface StoreContextValue {
  portfolioStore: PortfolioStore;
  analysisStore: AnalysisStore;
  autoTradingStore: AutoTradingStore;
  ebookStore: EbookStore;
  subscriptionService: typeof subscriptionService;
  investorPortalStore: InvestorPortalStore;
  signalProviderStore: SignalProviderStore;
  nftStore: typeof nftStore;
  mt5Store: MT5Store;
  hftStore: typeof hftStore;
  tradingStore: typeof tradingStore;
  authStore: typeof authStore;
  themeStore: typeof themeStore;
  aiAssistantStore: typeof aiAssistantStore;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// Initialize root store and other stores
const rootStore = new RootStore();
const ebookStore = new EbookStore();
const investorPortalStore = new InvestorPortalStore();
const signalProviderStore = new SignalProviderStore(rootStore);
const mt5Store = new MT5Store(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stores = {
    portfolioStore,
    analysisStore,
    autoTradingStore,
    ebookStore,
    subscriptionService,
    investorPortalStore,
    signalProviderStore,
    nftStore,
    mt5Store,
    hftStore,
    tradingStore,
    authStore,
    themeStore,
    aiAssistantStore,
  };

  return (
    <StoreContext.Provider value={stores}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within StoreProvider');
  }
  return context;
};
