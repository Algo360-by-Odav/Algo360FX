// @ts-nocheck
// This is a minimal version of AdvancedTradingPage.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import AdvancedTradingPage from './advancedTradingPageJs.js';

// Re-export the component
export default AdvancedTradingPage;

// Re-export the interfaces for type checking
export interface Algorithm {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  type: 'trend' | 'mean-reversion' | 'arbitrage' | 'ml-based';
  performance: {
    totalReturns: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  settings: {
    timeframe: string;
    position: {
      size: number;
      maxLeverage: number;
    };
    stopLoss: number;
    takeProfit: number;
    indicators: string[];
  };
  lastModified: string;
  createdAt: string;
}
