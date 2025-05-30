// @ts-nocheck
// This is a minimal version of TradingChart.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import TradingChart from './tradingChartJs.js';

// Re-export the component
export default TradingChart;

// Re-export the interface for type checking
export interface TradingChartProps {
  symbol: string;
}
