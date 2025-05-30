# API Reference Documentation

## Introduction

This document provides comprehensive documentation for the Algo360FX API, covering all services, components, and utilities available in the platform.

## Core Services

### 1. Strategy Service

#### Interface
```typescript
interface IStrategyService {
  createStrategy(config: StrategyConfig): Strategy;
  updateStrategy(id: string, config: Partial<StrategyConfig>): Strategy;
  deleteStrategy(id: string): void;
  getStrategy(id: string): Strategy;
  listStrategies(): Strategy[];
  validateStrategy(strategy: Strategy): ValidationResult;
  backtest(strategy: Strategy, config: BacktestConfig): Promise<BacktestResult>;
}
```

#### Usage Example
```typescript
const strategyService = new StrategyService();
const strategy = await strategyService.createStrategy({
  name: 'MA Crossover',
  type: 'TREND_FOLLOWING',
  parameters: {
    fastPeriod: 10,
    slowPeriod: 20
  }
});
```

### 2. Portfolio Service

#### Interface
```typescript
interface IPortfolioService {
  createPortfolio(config: PortfolioConfig): Portfolio;
  updatePortfolio(id: string, updates: Partial<PortfolioConfig>): Portfolio;
  deletePortfolio(id: string): void;
  getPortfolio(id: string): Portfolio;
  getPositions(portfolioId: string): Position[];
  calculateMetrics(portfolioId: string): PortfolioMetrics;
  rebalance(portfolioId: string, config: RebalanceConfig): RebalanceResult;
}
```

### 3. Risk Service

#### Interface
```typescript
interface IRiskService {
  calculateRisk(portfolio: Portfolio): RiskMetrics;
  setRiskLimits(config: RiskLimits): void;
  checkRiskLimits(portfolio: Portfolio): RiskCheck;
  calculateVaR(portfolio: Portfolio, config: VaRConfig): number;
  runStressTest(portfolio: Portfolio, scenarios: Scenario[]): StressTestResult;
}
```

### 4. Execution Service

#### Interface
```typescript
interface IExecutionService {
  executeOrder(order: Order): Promise<ExecutionResult>;
  cancelOrder(orderId: string): Promise<void>;
  modifyOrder(orderId: string, updates: Partial<Order>): Promise<Order>;
  getOrderStatus(orderId: string): OrderStatus;
  getExecutionHistory(filter: ExecutionFilter): ExecutionHistory[];
}
```

## Data Services

### 1. Market Data Service

#### Interface
```typescript
interface IMarketDataService {
  subscribe(symbols: string[], callback: MarketDataCallback): Subscription;
  unsubscribe(subscriptionId: string): void;
  getHistoricalData(request: HistoricalDataRequest): Promise<HistoricalData>;
  getQuote(symbol: string): Quote;
  getOrderBook(symbol: string): OrderBook;
}
```

### 2. Analytics Service

#### Interface
```typescript
interface IAnalyticsService {
  calculateReturns(data: number[]): ReturnMetrics;
  calculateVolatility(data: number[]): number;
  calculateCorrelation(series1: number[], series2: number[]): number;
  calculateBeta(returns: number[], benchmark: number[]): number;
  calculateSharpeRatio(returns: number[], riskFree: number): number;
}
```

## Component APIs

### 1. Strategy Builder

#### Props Interface
```typescript
interface StrategyBuilderProps {
  initialConfig?: StrategyConfig;
  onSave: (strategy: Strategy) => void;
  onTest: (strategy: Strategy) => void;
  availableIndicators: Indicator[];
  availableSignals: Signal[];
}
```

### 2. Portfolio Dashboard

#### Props Interface
```typescript
interface PortfolioDashboardProps {
  portfolioId: string;
  refreshInterval?: number;
  onPositionSelect?: (position: Position) => void;
  onMetricsUpdate?: (metrics: PortfolioMetrics) => void;
}
```

### 3. Chart Component

#### Props Interface
```typescript
interface ChartProps {
  data: ChartData[];
  type: 'candlestick' | 'line' | 'bar';
  indicators?: Indicator[];
  overlays?: Overlay[];
  onIntervalChange?: (interval: string) => void;
  onCrosshairMove?: (point: Point) => void;
}
```

## Utility Functions

### 1. Technical Indicators

```typescript
interface IndicatorUtils {
  calculateSMA(data: number[], period: number): number[];
  calculateEMA(data: number[], period: number): number[];
  calculateRSI(data: number[], period: number): number[];
  calculateMACD(data: number[], config: MACDConfig): MACDResult;
  calculateBollinger(data: number[], config: BollingerConfig): BollingerResult;
}
```

### 2. Date/Time Utils

```typescript
interface DateTimeUtils {
  parseDateTime(input: string | number): Date;
  formatDateTime(date: Date, format: string): string;
  getMarketStatus(exchange: string): MarketStatus;
  isMarketOpen(exchange: string): boolean;
  getNextMarketOpen(exchange: string): Date;
}
```

### 3. Math Utils

```typescript
interface MathUtils {
  round(value: number, decimals: number): number;
  percentChange(current: number, previous: number): number;
  standardDeviation(values: number[]): number;
  linearRegression(x: number[], y: number[]): RegressionResult;
}
```

## WebSocket API

### 1. Market Data Stream

```typescript
interface MarketDataStream {
  connect(): Promise<void>;
  subscribe(channels: string[]): void;
  unsubscribe(channels: string[]): void;
  onMessage(callback: (data: MarketData) => void): void;
  onError(callback: (error: Error) => void): void;
}
```

### 2. Order Updates Stream

```typescript
interface OrderStream {
  connect(): Promise<void>;
  subscribe(portfolioId: string): void;
  unsubscribe(portfolioId: string): void;
  onOrderUpdate(callback: (update: OrderUpdate) => void): void;
}
```

## Error Handling

### 1. Error Types

```typescript
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EXECUTION_ERROR = 'EXECUTION_ERROR',
  MARKET_DATA_ERROR = 'MARKET_DATA_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR'
}
```

### 2. Error Responses

```typescript
interface ErrorResponse {
  type: ErrorType;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}
```

## Authentication

### 1. Authentication Methods

```typescript
interface AuthService {
  login(credentials: Credentials): Promise<AuthToken>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthToken>;
  validateToken(token: string): boolean;
}
```

### 2. API Keys

```typescript
interface APIKeyService {
  createAPIKey(config: APIKeyConfig): APIKey;
  revokeAPIKey(keyId: string): void;
  listAPIKeys(): APIKey[];
  updateAPIKey(keyId: string, updates: Partial<APIKeyConfig>): APIKey;
}
```

## Rate Limiting

### 1. Rate Limit Config

```typescript
interface RateLimitConfig {
  endpoint: string;
  limit: number;
  window: number;
  cost: number;
}
```

### 2. Rate Limit Info

```typescript
interface RateLimitInfo {
  remaining: number;
  reset: number;
  total: number;
}
```

## Best Practices

### 1. API Usage
- Use appropriate error handling
- Implement rate limiting
- Cache responses when possible
- Use WebSocket for real-time data

### 2. Authentication
- Secure API key storage
- Regular key rotation
- Implement token refresh
- Use appropriate scopes

### 3. Performance
- Batch requests when possible
- Implement pagination
- Use compression
- Monitor API usage

## Resources

- [Getting Started Guide](../getting-started/README.md)
- [Strategy Development](../strategies/README.md)
- [Portfolio Management](../portfolio/README.md)
- [Risk Management](../risk/README.md)
