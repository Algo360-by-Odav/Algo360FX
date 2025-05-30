// dummyStores.ts - A replacement for StoreProvider without JSX
import { authStore } from './authStore';
import { themeStore } from './themeStore';

// Create a simple object with all the stores needed by the application
const stores = {
  authStore,
  themeStore,
  // Add dummy implementations for other stores that might be used
  portfolioStore: {},
  analysisStore: {},
  autoTradingStore: {},
  ebookStore: {},
  subscriptionService: {},
  investorPortalStore: {},
  signalProviderStore: {},
  nftStore: {},
  mt5Store: {},
  hftStore: {},
  tradingStore: {},
  aiAssistantStore: {},
};

// Export a function that mimics useStores
export function useStores() {
  return stores;
}
