# Risk Metrics Guide

Understanding and monitoring risk metrics is essential for effective trading. This guide explains key risk metrics available in Algo360FX.

## Value at Risk (VaR)

### Definition
Value at Risk (VaR) represents the maximum potential loss at a given confidence level over a specific time horizon.

### Implementation
```typescript
interface VaRParams {
  confidenceLevel: number;  // e.g., 0.95 for 95%
  timeHorizon: number;      // in days
  method: 'historical' | 'parametric' | 'monteCarlo';
}
```

### Usage
1. Monitor portfolio VaR daily
2. Compare against risk limits
3. Adjust positions if necessary
4. Review during high volatility

## Expected Shortfall (ES)

### Definition
Also known as Conditional VaR (CVaR), ES measures the average loss beyond VaR, providing a more conservative risk measure.

### Implementation
```typescript
interface ESParams {
  confidenceLevel: number;
  timeHorizon: number;
  lookbackPeriod: number;
}
```

## Drawdown Analysis

### Metrics
1. **Maximum Drawdown (MDD)**
   - Largest peak-to-trough decline
   - Key indicator of downside risk
   - Used for strategy evaluation

2. **Average Drawdown**
   - Typical loss from peak
   - More stable than MDD
   - Useful for risk budgeting

3. **Drawdown Duration**
   - Time to recover losses
   - Recovery probability
   - Strategy persistence

## Risk-Adjusted Performance

### Sharpe Ratio
```typescript
interface SharpeRatioParams {
  returns: number[];
  riskFreeRate: number;
  annualizationFactor: number;
}
```

### Sortino Ratio
```typescript
interface SortinoRatioParams {
  returns: number[];
  targetReturn: number;
  downside: boolean;
}
```

## Position Risk Metrics

### Delta
- Measures directional risk
- First-order price sensitivity
- Used for hedging calculations

### Gamma
- Second-order price sensitivity
- Important for options trading
- Measures hedge effectiveness

### Vega
- Volatility sensitivity
- Critical for option positions
- Used for volatility trading

## Best Practices

1. **Regular Monitoring**
   - Check metrics daily
   - Compare to historical values
   - Track trends over time
   - Document significant changes

2. **Risk Limits**
   - Set metric thresholds
   - Monitor breaches
   - Take corrective action
   - Review and adjust limits

3. **Documentation**
   - Record risk measurements
   - Track limit breaches
   - Document responses
   - Review effectiveness
