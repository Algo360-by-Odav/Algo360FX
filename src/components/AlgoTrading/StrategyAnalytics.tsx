import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useAlgoTradingStore } from '../../stores/hooks';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { MonteCarloVisualization } from './MonteCarloVisualization';
import { StrategyComparison } from './StrategyComparison';

const MetricCard: React.FC<{
  title: string;
  value: string;
  description?: string;
}> = ({ title, value, description }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ my: 1 }}>
        {value}
      </Typography>
      {description && (
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export const StrategyAnalytics: React.FC = observer(() => {
  const algoTradingStore = useAlgoTradingStore();
  const results = algoTradingStore.getBacktestResults();

  // If no strategies, show empty state
  if (results.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="textSecondary" align="center">
          No strategies to analyze. Start by creating and backtesting a strategy.
        </Typography>
      </Box>
    );
  }

  // Get the most recent strategy result
  const latestResult = results[results.length - 1];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Strategy Analytics
      </Typography>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Return"
            value={formatPercentage(latestResult.metrics.totalReturn)}
            description="Net return since inception"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Sharpe Ratio"
            value={latestResult.metrics.sharpeRatio.toFixed(2)}
            description="Risk-adjusted return (higher is better)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Max Drawdown"
            value={formatPercentage(latestResult.metrics.maxDrawdown)}
            description="Largest peak-to-trough decline"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Win Rate"
            value={formatPercentage(latestResult.metrics.winRate)}
            description="Percentage of winning trades"
          />
        </Grid>
      </Grid>

      {/* Risk Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Profit Factor"
            value={latestResult.metrics.profitFactor.toFixed(2)}
            description="Gross profit / Gross loss"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Recovery Factor"
            value={latestResult.metrics.recoveryFactor.toFixed(2)}
            description="Return / Max drawdown"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Sortino Ratio"
            value={latestResult.metrics.sortinoRatio.toFixed(2)}
            description="Downside risk-adjusted return"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Calmar Ratio"
            value={latestResult.metrics.calmarRatio.toFixed(2)}
            description="Annual return / Max drawdown"
          />
        </Grid>
      </Grid>

      {/* Strategy Comparison */}
      {results.length > 1 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Strategy Comparison
          </Typography>
          <StrategyComparison />
        </>
      )}

      {/* Monte Carlo Analysis */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" gutterBottom>
        Monte Carlo Analysis
      </Typography>
      <MonteCarloVisualization
        result={algoTradingStore.getMonteCarloResults(latestResult)}
        initialEquity={algoTradingStore.rootStore.portfolioStore.initialBalance}
      />
    </Box>
  );
});

export default StrategyAnalytics;
