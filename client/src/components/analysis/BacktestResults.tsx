import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface Trade {
  id: string;
  date: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  entry: number;
  exit: number;
  profit: number;
  pips: number;
  duration: string;
}

interface BacktestMetrics {
  totalReturn: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  averageTrade: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  profitableMonths: number;
  recoveryFactor: number;
  payoffRatio: number;
  tradingPeriod: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  longTrades: number;
  shortTrades: number;
}

interface BacktestResultsProps {
  trades: Trade[];
  metrics: BacktestMetrics;
  equityCurve: { date: string; equity: number }[];
  drawdownCurve: { date: string; drawdown: number }[];
}

export const BacktestResults: React.FC<BacktestResultsProps> = ({
  trades,
  metrics,
  equityCurve,
  drawdownCurve,
}) => {
  const equityChartData = {
    labels: equityCurve.map(point => point.date),
    datasets: [
      {
        label: 'Equity Curve',
        data: equityCurve.map(point => point.equity),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Drawdown',
        data: drawdownCurve.map(point => point.drawdown),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        fill: false,
        hidden: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Strategy Performance',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Equity',
        },
      },
    },
  } as const;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Return
                </Typography>
                <Typography variant="h6" color={metrics.totalReturn >= 0 ? 'success.main' : 'error.main'}>
                  {metrics.totalReturn.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Win Rate
                </Typography>
                <Typography variant="h6">
                  {(metrics.winRate * 100).toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Profit Factor
                </Typography>
                <Typography variant="h6">
                  {metrics.profitFactor.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Max Drawdown
                </Typography>
                <Typography variant="h6" color="error.main">
                  {metrics.maxDrawdown.toFixed(2)}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ height: 400 }}>
              <Line options={chartOptions} data={equityChartData} />
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Sharpe Ratio</TableCell>
                  <TableCell align="right">{metrics.sharpeRatio.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sortino Ratio</TableCell>
                  <TableCell align="right">{metrics.sortinoRatio.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recovery Factor</TableCell>
                  <TableCell align="right">{metrics.recoveryFactor.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payoff Ratio</TableCell>
                  <TableCell align="right">{metrics.payoffRatio.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Profitable Months</TableCell>
                  <TableCell align="right">{metrics.profitableMonths}/12</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trade Statistics
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Total Trades</TableCell>
                  <TableCell align="right">{metrics.totalTrades}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Trade</TableCell>
                  <TableCell align="right">{metrics.averageTrade.toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Largest Win</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main' }}>
                    {metrics.largestWin.toFixed(2)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Largest Loss</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>
                    {metrics.largestLoss.toFixed(2)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Consecutive Wins/Losses</TableCell>
                  <TableCell align="right">
                    {metrics.consecutiveWins}/{metrics.consecutiveLosses}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Recent Trades */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Trades
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Entry</TableCell>
                    <TableCell align="right">Exit</TableCell>
                    <TableCell align="right">Profit</TableCell>
                    <TableCell align="right">Pips</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trades.slice(0, 10).map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{format(new Date(trade.date), 'yyyy-MM-dd HH:mm')}</TableCell>
                      <TableCell>
                        <Chip
                          label={trade.type}
                          size="small"
                          color={trade.type === 'BUY' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell align="right">{trade.entry.toFixed(5)}</TableCell>
                      <TableCell align="right">{trade.exit.toFixed(5)}</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: trade.profit >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {trade.profit.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right">{trade.pips.toFixed(1)}</TableCell>
                      <TableCell>{trade.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BacktestResults;
