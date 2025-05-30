// @ts-nocheck
// This is a minimal version of MT5Chart.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import MT5Chart from './mt5ChartJs.js';

// Re-export the component
export default MT5Chart;

// Re-export the interface for type checking
export interface MT5ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
