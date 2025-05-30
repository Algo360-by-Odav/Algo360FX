// @ts-nocheck
// This is a minimal version of MT5Page.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import MT5Page from './mt5PageJs.js';

// Re-export the component
export default MT5Page;

// Re-export the interface for type checking
export interface OrderFormData {
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  price: number;
  stopLoss: number | null;
  takeProfit: number | null;
  comment: string;
}
