import WebSocketService from "./websocketService";
import { api } from "./api";

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
  TRAILING_STOP = 'TRAILING_STOP'
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: OrderStatus;
  filledQuantity: number;
  averagePrice?: number;
  timestamp: Date;
}

export interface Position {
  symbol: string;
  side: OrderSide;
  quantity: number;
  averagePrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  timestamp: Date;
}

class TradingService {
  private static instance: TradingService;
  private ws = WebSocketService;
  private isConnected = false;

  private constructor() {
    this.setupWebSocketListeners();
  }

  public static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  private setupWebSocketListeners() {
    // Subscribe to order updates
    this.ws.subscribe('order_update', (order: Order) => {
      document.dispatchEvent(new CustomEvent('orderUpdate', { detail: order }));
    });

    // Subscribe to position updates
    this.ws.subscribe('position_update', (position: Position) => {
      document.dispatchEvent(new CustomEvent('positionUpdate', { detail: position }));
    });

    // Subscribe to trade executions
    this.ws.subscribe('trade_executed', (trade: any) => {
      document.dispatchEvent(new CustomEvent('tradeExecuted', { detail: trade }));
    });

    // Subscribe to market data
    this.ws.subscribe('market_data', (data: any) => {
      document.dispatchEvent(new CustomEvent('marketDataUpdate', { detail: data }));
    });

    // Handle connection status
    this.ws.subscribeToStatus((status) => {
      this.isConnected = status === 'connected';
      if (status === 'connected') {
        document.dispatchEvent(new CustomEvent('wsConnected'));
      } else if (status === 'disconnected') {
        document.dispatchEvent(new CustomEvent('wsDisconnected'));
      }
    });
  }

  private handleError(error: any): Error {
    console.error('Trading service error:', error);
    return error?.response?.data?.message || 'An error occurred in the trading service';
  }

  // Market Orders
  public async placeMarketOrder(symbol: string, side: OrderSide, quantity: number): Promise<Order> {
    try {
      const response = await api.post('/trading/orders/market', {
        symbol,
        side,
        quantity
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Limit Orders
  public async placeLimitOrder(
    symbol: string,
    side: OrderSide,
    quantity: number,
    price: number
  ): Promise<Order> {
    try {
      const response = await api.post('/trading/orders/limit', {
        symbol,
        side,
        quantity,
        price
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Stop Orders
  public async placeStopOrder(
    symbol: string,
    side: OrderSide,
    quantity: number,
    stopPrice: number
  ): Promise<Order> {
    try {
      const response = await api.post('/trading/orders/stop', {
        symbol,
        side,
        quantity,
        stopPrice
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cancel Order
  public async cancelOrder(orderId: string): Promise<boolean> {
    try {
      await api.delete(`/trading/orders/${orderId}`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get Orders
  public async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/trading/orders');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get Positions
  public async getPositions(): Promise<Position[]> {
    try {
      const response = await api.get('/trading/positions');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Subscribe to market data
  public subscribeToMarketData(symbol: string) {
    this.ws.emit('subscribe_market_data', { symbol });
  }

  // Unsubscribe from market data
  public unsubscribeFromMarketData(symbol: string) {
    this.ws.emit('unsubscribe_market_data', { symbol });
  }

  // Check if connected to WebSocket
  public isConnected(): boolean {
    return this.isConnected;
  }

  // Force reconnect
  public reconnect(): void {
    this.ws.reconnect();
  }
}

export default TradingService.getInstance();
