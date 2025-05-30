// storeProviderJs.js - A JavaScript version of StoreProvider without JSX or TypeScript
// This avoids the Vite React plugin preamble detection error

import React from 'react';

// Import stores from their JavaScript versions
import authStore from './authStore.js';
import investorPortalStore from './investorPortalStoreJs.js';
import subscriptionService from './subscriptionServiceJs.js';
import mt5Store from './mt5StoreJs.js';
import hftStore from './hftStoreJs.js';
import AdvancedTradingStore from './advancedTradingStoreJs.js';
import signalProviderStore from './signalProviderStoreJs.js';
import ChatStore from './chatStore.ts';
import { EbookStore } from './ebookStore.ts';

// Initialize the subscription service with mock data
subscriptionService.initialize = function() {
  // Add any initialization logic here
  console.log('Subscription service initialized');
};

// Call initialize
subscriptionService.initialize();

// Initialize the advanced trading store
const advancedTradingStore = new AdvancedTradingStore();

// Initialize the ebook store
const ebookStore = new EbookStore();

// Create a simple object with all the stores needed by the application
const stores = {
  authStore,
  // Add dummy implementations for other stores that might be used
  themeStore: {
    isDarkMode: true,
    isMenuOpen: false,
    toggleMenu: function() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleTheme: function() {
      this.isDarkMode = !this.isDarkMode;
    },
    theme: {
      palette: {
        mode: 'dark',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' }
      }
    }
  },
  portfolioStore: {},
  analysisStore: {},
  autoTradingStore: {},
  ebookStore,
  subscriptionService,
  investorPortalStore,
  mt5Store,
  hftStore,
  advancedTradingStore,
  signalProviderStore,
  nftStore: {},
  tradingStore: {},
  aiAssistantStore: {},
  chatStore: new ChatStore(),
};

// Export a simple function to get stores
export function useStores() {
  return stores;
}

// Export a simple StoreProvider that just returns its children
// This avoids MobX integration issues
export function StoreProvider(props) {
  return props.children;
}

// Export a dummy context for compatibility
export const StoreContext = null;

// Also export as default for compatibility
export default {
  useStores,
  StoreProvider,
  StoreContext
};
