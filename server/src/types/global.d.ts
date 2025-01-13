import { OptimizationWebSocketServer } from '../websocket/optimization';
import { Config } from '../config';
import { User, Portfolio, Trade, Signal, Analytics, Strategy } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { WebSocket } from 'ws';

declare global {
  let globalThis: {
    config: Config;
    prisma: PrismaClient;
    optimization: {
      server: OptimizationWebSocketServer;
      sockets: Map<string, WebSocket>;
    };
    marketDataService: any;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      OPENAI_API_KEY: string;
      NEWS_API_KEY: string;
      MARKET_API_KEY: string;
      MT5_WS_PORT: string;
      REDIS_URL: string;
    }
  }

  interface UserWithRelations extends User {
    portfolios?: Portfolio[];
    trades?: Trade[];
    signals?: Signal[];
    analytics?: Analytics[];
  }

  interface PortfolioWithRelations extends Portfolio {
    user?: User;
    trades?: Trade[];
  }

  interface TradeWithRelations extends Trade {
    user?: User;
    portfolio?: Portfolio;
  }

  interface SignalWithRelations extends Signal {
    user?: User;
  }

  interface AnalyticsWithRelations extends Analytics {
    user?: User;
    strategies?: Strategy[];
  }

  interface StrategyWithRelations extends Strategy {
    analytics?: Analytics[];
  }

  interface MarketDataParams {
    symbol: string;
    timeframe?: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
  }

  interface BacktestParams {
    strategyId: string;
    symbol: string;
    timeframe: string;
    startDate: Date;
    endDate: Date;
    initialBalance: number;
    riskPerTrade: number;
  }

  interface TradeParams {
    symbol: string;
    type: 'MARKET' | 'LIMIT' | 'STOP';
    side: 'BUY' | 'SELL';
    volume: number;
    price?: number;
    stopLoss?: number;
    takeProfit?: number;
    comment?: string;
  }

  interface PortfolioStats {
    totalBalance: number;
    totalPnL: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    sharpeRatio: number;
    maxDrawdown: number;
    profitFactor: number;
    bestTrade: Trade | null;
    worstTrade: Trade | null;
  }

  interface StrategyParameters {
    timeframe: string;
    entryConditions: any[];
    exitConditions: any[];
    riskManagement: {
      stopLoss: number;
      takeProfit: number;
      maxDrawdown: number;
      positionSize: number;
    };
    filters: {
      volatility?: number;
      correlation?: number;
      sentiment?: number;
      timeOfDay?: string[];
      newsFilter?: boolean;
    };
  }

  interface BacktestResult {
    trades: TradeWithRelations[];
    metrics: {
      totalTrades: number;
      winRate: number;
      profitFactor: number;
      sharpeRatio: number;
      maxDrawdown: number;
      averageWin: number;
      averageLoss: number;
      expectancy: number;
    };
    equity: { date: string; balance: number }[];
  }

  interface MarketAnalysis {
    symbol: string;
    timeframe: string;
    data: any;
    sentiment?: any;
    news?: any[];
    correlations?: any;
    volatility?: any;
    analysis?: string;
    recommendations?: string[];
  }

  interface AIAnalysisOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    useCache?: boolean;
  }

  interface WebSocketMessage {
    type: string;
    data: any;
  }

  interface MT5Connection {
    ws: WebSocket;
    account?: any;
    terminal?: any;
    userId: string;
  }

  interface OrderRequest {
    symbol: string;
    volume: number;
    price: number;
    type: 'MARKET' | 'LIMIT' | 'STOP';
    stopLoss?: number;
    takeProfit?: number;
    comment?: string;
  }

  interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }

  interface PaginatedResponse<T> extends APIResponse<T> {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  }

  interface SearchResult {
    id: string;
    type: 'portfolio' | 'strategy' | 'trade' | 'signal' | 'analytics';
    title: string;
    description?: string;
    score: number;
  }

  interface CacheOptions {
    key: string;
    ttl?: number;
    refresh?: boolean;
  }
}

export {};
