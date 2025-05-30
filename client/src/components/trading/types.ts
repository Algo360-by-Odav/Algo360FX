// Common types
export interface MarketPrice {
  ask: number;
  bid: number;
}

export interface Order {
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

// Component Props
export interface PriceChartProps {
  symbol: string;
  data: any[];
  onTimeframeChange: (timeframe: string) => void;
  indicators: string[];
  advanced?: boolean;
}

export interface TradingWidgetProps {
  symbol: string;
  currentPrice: MarketPrice;
  onPlaceOrder: (order: Order) => Promise<void>;
  advanced?: boolean;
}

export interface OrderBookProps {
  symbol: string;
  advanced?: boolean;
}

export interface TradeHistoryProps {
  symbol: string;
  trades: Trade[];
  limit?: number;
  onRefresh?: () => void;
  advanced?: boolean;
}

export interface TradingIndicatorsProps {
  selected: string[];
  onAdd: (indicator: string) => void;
  onRemove: (indicator: string) => void;
}

export interface PositionsTableProps {
  symbol: string;
  onClose?: (positionId: string) => void;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  openTime: string;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  time: string;
  type: 'market' | 'limit' | 'stop';
  fee: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
  orders: number;
}
