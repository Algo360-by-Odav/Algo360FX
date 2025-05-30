// @ts-nocheck
// This is a minimal version of StrategiesPage.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import StrategiesPage from './strategiesPageJs.js';

// Re-export the component
export default StrategiesPage;

// Re-export the interfaces for type checking
export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: string;
  symbols: string[];
  status: 'active' | 'inactive' | 'error';
  performance: {
    pnl: number;
    winRate: number;
    trades: number;
  };
  parameters: {
    timeframe: string;
    riskPerTrade: number;
    maxDrawdown: number;
    takeProfitPips: number;
    stopLossPips: number;
    trailingStop: boolean;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}
