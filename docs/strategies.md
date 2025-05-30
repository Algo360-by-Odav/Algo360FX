# Trading Strategies Guide

## Overview

This guide covers the implementation and optimization of trading strategies in Algo360FX.

## Strategy Components

### 1. Signal Generation
- Technical indicators
- Price action patterns
- Machine learning models
- Sentiment analysis
- Market events

### 2. Risk Management
- Position sizing
- Stop loss placement
- Take profit targets
- Maximum drawdown limits
- Correlation analysis

### 3. Execution Logic
- Entry conditions
- Exit conditions
- Order types
- Time-based rules
- Market condition filters

## Example Strategies

### 1. Trend Following

```typescript
import { Strategy, Indicators } from '@algo360fx/sdk';

class TrendFollowingStrategy extends Strategy {
  // Strategy parameters
  @param({ min: 10, max: 50 })
  fastEMA: number = 20;

  @param({ min: 20, max: 100 })
  slowEMA: number = 50;

  async onTick(tick: Tick) {
    const { close } = tick;
    const fastEMA = await this.indicators.ema(close, this.fastEMA);
    const slowEMA = await this.indicators.ema(close, this.slowEMA);

    if (fastEMA > slowEMA && !this.position) {
      await this.buy({
        volume: this.calculatePosition(),
        stopLoss: this.calculateStopLoss('LONG'),
        takeProfit: this.calculateTakeProfit('LONG')
      });
    }
    
    if (fastEMA < slowEMA && this.position?.side === 'LONG') {
      await this.closePosition();
    }
  }

  calculatePosition() {
    const risk = 0.02; // 2% risk per trade
    const accountEquity = this.account.equity;
    return this.position.calculateVolume(risk, accountEquity);
  }
}
```

### 2. Mean Reversion

```typescript
class MeanReversionStrategy extends Strategy {
  @param({ min: 10, max: 50 })
  period: number = 20;

  @param({ min: 1, max: 3 })
  stdDev: number = 2;

  async onTick(tick: Tick) {
    const { close } = tick;
    const bollinger = await this.indicators.bollinger(close, this.period, this.stdDev);
    
    if (close < bollinger.lower && !this.position) {
      await this.buy({
        volume: this.calculatePosition(),
        stopLoss: close * 0.99,
        takeProfit: bollinger.middle
      });
    }
    
    if (close > bollinger.upper && !this.position) {
      await this.sell({
        volume: this.calculatePosition(),
        stopLoss: close * 1.01,
        takeProfit: bollinger.middle
      });
    }
  }
}
```

## Backtesting

### Configuration

```typescript
const backtest = new Backtest({
  strategy: TrendFollowingStrategy,
  symbol: 'EURUSD',
  timeframe: '1H',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  initialCapital: 100000,
  commission: 0.0001
});

const results = await backtest.run();
```

### Performance Metrics

```typescript
console.log(results.metrics);
// {
//   totalTrades: 245,
//   winRate: 0.58,
//   profitFactor: 1.75,
//   sharpeRatio: 1.32,
//   maxDrawdown: 0.15,
//   averageWin: 250,
//   averageLoss: 150,
//   expectancy: 85
// }
```

## Optimization

### Parameter Optimization

```typescript
const optimizer = new StrategyOptimizer({
  strategy: TrendFollowingStrategy,
  parameters: {
    fastEMA: { start: 10, end: 50, step: 5 },
    slowEMA: { start: 20, end: 100, step: 10 }
  },
  metric: 'sharpeRatio'
});

const optimal = await optimizer.run();
```

### Machine Learning Integration

```typescript
class MLStrategy extends Strategy {
  private model: TensorFlowModel;

  async onCreate() {
    this.model = await tf.loadLayersModel('model.json');
  }

  async onTick(tick: Tick) {
    const features = await this.prepareFeatures(tick);
    const prediction = this.model.predict(features);
    
    if (prediction > 0.7) {
      await this.buy();
    } else if (prediction < 0.3) {
      await this.sell();
    }
  }
}
```

## Risk Management

### Position Sizing

```typescript
function calculatePosition(risk: number, stopLoss: number): number {
  const accountEquity = this.account.equity;
  const riskAmount = accountEquity * risk;
  const pipValue = this.symbol.pipValue;
  const stopLossPips = Math.abs(this.currentPrice - stopLoss) / this.symbol.pipSize;
  
  return (riskAmount / (stopLossPips * pipValue));
}
```

### Portfolio Management

```typescript
class PortfolioStrategy extends Strategy {
  async onPortfolioUpdate() {
    const correlation = await this.calculateCorrelation();
    const var = this.calculateValueAtRisk();
    
    if (var > this.maxRisk || correlation > this.maxCorrelation) {
      await this.reduceExposure();
    }
  }
}
```

## Best Practices

1. Always use proper risk management
2. Test strategies thoroughly in different market conditions
3. Monitor strategy performance in real-time
4. Implement proper error handling
5. Use version control for strategy development
6. Document strategy logic and assumptions
7. Regular strategy maintenance and optimization
