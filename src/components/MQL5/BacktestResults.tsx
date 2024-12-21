import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface BacktestResult {
  netProfit: number;
  trades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  expectedPayoff: number;
  equity: Array<{
    date: string;
    value: number;
    drawdown: number;
  }>;
  monthlyPerformance: Array<{
    month: string;
    return: number;
  }>;
  tradeDistribution: Array<{
    type: string;
    count: number;
  }>;
  detailedTrades: Array<{
    ticket: number;
    openTime: string;
    type: string;
    size: number;
    symbol: string;
    openPrice: number;
    closePrice: number;
    profit: number;
    pips: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface BacktestResultsProps {
  results: BacktestResult;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ results }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Backtest Results
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Net Profit
                  </Typography>
                  <Typography variant="h6" color={results.netProfit >= 0 ? 'success.main' : 'error.main'}>
                    ${results.netProfit.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Win Rate
                  </Typography>
                  <Typography variant="h6">
                    {(results.winRate * 100).toFixed(1)}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Profit Factor
                  </Typography>
                  <Typography variant="h6">
                    {results.profitFactor.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Max Drawdown
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {(results.maxDrawdown * 100).toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Equity Curve */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equity Curve
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={results.equity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Equity"
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="drawdown"
                      name="Drawdown"
                      stroke="#ff4444"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Trade Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trade Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={results.tradeDistribution}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {results.tradeDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Performance
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={results.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="return"
                      name="Return %"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Trades */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Latest Trades
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Size</TableCell>
                      <TableCell align="right">Entry</TableCell>
                      <TableCell align="right">Exit</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Pips</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.detailedTrades.map((trade) => (
                      <TableRow
                        key={trade.ticket}
                        sx={{
                          backgroundColor: trade.profit >= 0 ? 'success.light' : 'error.light',
                        }}
                      >
                        <TableCell>{trade.ticket}</TableCell>
                        <TableCell>{trade.openTime}</TableCell>
                        <TableCell>{trade.type}</TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell align="right">{trade.size}</TableCell>
                        <TableCell align="right">{trade.openPrice}</TableCell>
                        <TableCell align="right">{trade.closePrice}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: trade.profit >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          ${trade.profit.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">{trade.pips}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BacktestResults;
