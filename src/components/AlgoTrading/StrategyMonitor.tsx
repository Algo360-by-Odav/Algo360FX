import React from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Stop as StopIcon,
  TrendingUp,
  TrendingDown,
  Timeline,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import { Strategy } from '../../stores/AlgoTradingStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceChartProps {
  data: {
    timestamp: number;
    pnl: number;
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) =>
            new Date(timestamp).toLocaleTimeString()
          }
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'P&L']}
          labelFormatter={(timestamp) =>
            new Date(Number(timestamp)).toLocaleString()
          }
        />
        <Area
          type="monotone"
          dataKey="pnl"
          stroke={theme.palette.primary.main}
          fill={theme.palette.primary.light}
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface StrategyCardProps {
  strategy: Strategy;
  onStop: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onStop }) => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6">
            {strategy.config.symbol}
            <Chip
              size="small"
              label={strategy.status}
              color={
                strategy.status === 'running'
                  ? 'success'
                  : strategy.status === 'error'
                  ? 'error'
                  : 'default'
              }
              sx={{ ml: 1 }}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Strategy ID: {strategy.id}
          </Typography>
        </Box>
        <IconButton
          color="error"
          onClick={onStop}
          disabled={strategy.status !== 'running'}
        >
          <StopIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            Total Trades
          </Typography>
          <Typography variant="h6">
            {strategy.performance.totalTrades}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            Win Rate
          </Typography>
          <Typography variant="h6">
            {strategy.performance.totalTrades > 0
              ? (
                  (strategy.performance.winningTrades /
                    strategy.performance.totalTrades) *
                  100
                ).toFixed(1)
              : 0}
            %
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            P&L
          </Typography>
          <Typography
            variant="h6"
            color={
              strategy.performance.profitLoss >= 0
                ? 'success.main'
                : 'error.main'
            }
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            ${strategy.performance.profitLoss.toFixed(2)}
            {strategy.performance.profitLoss >= 0 ? (
              <TrendingUp sx={{ ml: 0.5 }} />
            ) : (
              <TrendingDown sx={{ ml: 0.5 }} />
            )}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            Last Signal
          </Typography>
          <Typography variant="h6">
            {strategy.lastSignal ? (
              <Chip
                size="small"
                label={strategy.lastSignal.type}
                color={
                  strategy.lastSignal.type === 'BUY' ? 'success' : 'error'
                }
              />
            ) : (
              '-'
            )}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Performance Chart
          <Timeline sx={{ ml: 1, verticalAlign: 'bottom' }} />
        </Typography>
        <PerformanceChart
          data={[
            { timestamp: Date.now() - 3600000, pnl: 0 },
            {
              timestamp: Date.now(),
              pnl: strategy.performance.profitLoss,
            },
          ]}
        />
      </Box>
    </Card>
  );
};

export const StrategyMonitor: React.FC = observer(() => {
  const { algoTradingStore } = useRootStore();
  const theme = useTheme();

  const handleStopStrategy = (strategyId: string) => {
    algoTradingStore.stopStrategy(strategyId);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Active Strategies
      </Typography>

      <Grid container spacing={3}>
        {[...algoTradingStore.strategies.values()].map((strategy) => (
          <Grid item xs={12} key={strategy.id}>
            <StrategyCard
              strategy={strategy}
              onStop={() => handleStopStrategy(strategy.id)}
            />
          </Grid>
        ))}
      </Grid>

      {algoTradingStore.strategies.size === 0 && (
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography color="text.secondary">
            No active strategies. Use the Strategy Builder to create and start a
            new strategy.
          </Typography>
        </Paper>
      )}
    </Box>
  );
});

export default StrategyMonitor;
