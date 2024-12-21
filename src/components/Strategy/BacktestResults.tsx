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
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { BacktestResult, Trade } from '../../types/trading';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface BacktestResultsProps {
  results: BacktestResult;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ results }) => {
  const theme = useTheme();

  // Prepare data for equity curve
  const equityData = results.trades.map((trade, index) => ({
    date: new Date(trade.exitTime).toLocaleDateString(),
    equity: results.equityCurve[index],
  }));

  // Prepare data for monthly returns
  const monthlyReturns = results.monthlyReturns.map((return_) => ({
    month: return_.month,
    return: return_.return * 100,
  }));

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Backtest Results
      </Typography>

      {/* Summary Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Net Profit
            </Typography>
            <Typography variant="h6">
              {formatCurrency(results.totalPnL)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Win Rate
            </Typography>
            <Typography variant="h6">
              {formatPercentage(results.winRate)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Profit Factor
            </Typography>
            <Typography variant="h6">
              {results.profitFactor.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Max Drawdown
            </Typography>
            <Typography variant="h6" color="error">
              {formatPercentage(results.maxDrawdown)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Advanced Metrics */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Sharpe Ratio
            </Typography>
            <Typography variant="h6">
              {results.sharpeRatio.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Sortino Ratio
            </Typography>
            <Typography variant="h6">
              {results.sortinoRatio.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Calmar Ratio
            </Typography>
            <Typography variant="h6">
              {results.calmarRatio.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Equity Curve */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Equity Curve
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="equity"
                stroke={theme.palette.primary.main}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Monthly Returns */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Monthly Returns
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="return"
                fill={theme.palette.primary.main}
                name="Return %"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Trade List */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Trade History
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Entry Time</TableCell>
                <TableCell>Exit Time</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Side</TableCell>
                <TableCell align="right">Entry Price</TableCell>
                <TableCell align="right">Exit Price</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="right">P&L</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(trade.entryTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(trade.exitTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.side}</TableCell>
                  <TableCell align="right">
                    {trade.entryPrice.toFixed(5)}
                  </TableCell>
                  <TableCell align="right">
                    {trade.exitPrice.toFixed(5)}
                  </TableCell>
                  <TableCell align="right">{trade.size.toFixed(2)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        trade.pnl >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {formatCurrency(trade.pnl)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BacktestResults;
