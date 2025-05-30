// @ts-nocheck
// This is a minimal version of HFTPage.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import HFTPage from './hftPageJs.js';

// Re-export the component
export default HFTPage;

// Re-export the interface for type checking
export interface HFTStrategy {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'warming_up';
  symbols: string[];
  config: {
    timeFrame: string;
    orderSize: number;
    maxOpenPositions: number;
    riskPerTrade: number;
    eventFilters: {
      newsEvents: boolean;
      economicCalendar: boolean;
      volatilityFilter: boolean;
      liquidityFilter: boolean;
    };
  };
  stats: {
    totalTrades: number;
    winRate: number;
    pnl: number;
  };
}
