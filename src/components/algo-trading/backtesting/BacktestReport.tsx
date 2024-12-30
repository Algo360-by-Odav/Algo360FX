import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { BacktestResult, Strategy, Trade, OrderSide } from '@/types/trading';
import { formatCurrency, formatPercentage, formatDate } from '@/utils/formatters';

interface BacktestReportProps {
  strategy: Strategy;
  result: BacktestResult;
  onShare?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
    {value === index && children}
  </Box>
);

const BacktestReport: React.FC<BacktestReportProps> = ({
  strategy,
  result,
  onShare,
  onDownload,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Key Performance Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Net Profit
                </Typography>
                <Typography variant="h4" color={result.metrics.returns >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(result.metrics.returns)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPercentage(result.metrics.returns / result.metrics.totalTrades)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Win Rate
                </Typography>
                <Typography variant="h4">
                  {formatPercentage(result.metrics.winRate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.metrics.totalTrades} trades
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Profit Factor
                </Typography>
                <Typography variant="h4">
                  {result.metrics.profitFactor.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Risk/Reward Ratio
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Max Drawdown
                </Typography>
                <Typography variant="h4" color="error.main">
                  {formatPercentage(result.metrics.maxDrawdown)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Equity Curve */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Equity Curve
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <AreaChart data={result.equity.map((value, index) => ({ date: index, equity: value }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#2196f3"
                  fill="#2196f3"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Additional Metrics */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Risk Metrics
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Sharpe Ratio</TableCell>
                <TableCell align="right">{result.metrics.sharpeRatio.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sortino Ratio</TableCell>
                <TableCell align="right">{result.metrics.sortino.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Win</TableCell>
                <TableCell align="right">{formatCurrency(result.metrics.averageWin)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Loss</TableCell>
                <TableCell align="right">{formatCurrency(result.metrics.averageLoss)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Trading Metrics
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total Trades</TableCell>
                <TableCell align="right">{result.metrics.totalTrades}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Winning Trades</TableCell>
                <TableCell align="right">{result.metrics.winningTrades}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Losing Trades</TableCell>
                <TableCell align="right">{result.metrics.losingTrades}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Holding Time</TableCell>
                <TableCell align="right">{result.metrics.averageHoldingTime}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTrades = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Entry Price</TableCell>
            <TableCell>Exit Price</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>P&L</TableCell>
            <TableCell>Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.trades.map((trade: Trade, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(trade.entryTime)}</TableCell>
              <TableCell>
                <Chip
                  label={trade.side}
                  color={trade.side === 'BUY' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
              <TableCell>{formatCurrency(trade.exitPrice || 0)}</TableCell>
              <TableCell>{trade.size}</TableCell>
              <TableCell
                sx={{
                  color: (trade.pnl || 0) >= 0 ? 'success.main' : 'error.main',
                }}
              >
                {formatCurrency(trade.pnl || 0)}
              </TableCell>
              <TableCell>{trade.duration || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAnalysis = () => (
    <Grid container spacing={3}>
      {/* Drawdown Analysis */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Drawdown Analysis
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={result.drawdown.map((value, index) => ({ date: index, drawdown: value * 100 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#f44336"
                  dot={false}
                  name="Drawdown %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">{strategy.name} Backtest Report</Typography>
        <Box>
          <IconButton onClick={onShare}>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={onDownload}>
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={onPrint}>
            <PrintIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Trades" />
          <Tab label="Analysis" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {renderOverview()}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {renderTrades()}
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        {renderAnalysis()}
      </TabPanel>
    </Box>
  );
};

export default BacktestReport;
