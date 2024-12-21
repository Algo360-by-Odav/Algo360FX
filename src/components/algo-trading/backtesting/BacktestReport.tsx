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
  Button,
  IconButton,
  Tooltip,
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
import { BacktestResult } from '../../../types/backtest';
import { TradingStrategy } from '../../../types/algo-trading';
import { formatCurrency, formatPercentage, formatDate } from '../../../utils/formatters';

interface BacktestReportProps {
  strategy: TradingStrategy;
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
                <Typography variant="h4" color={result.metrics.netProfit >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(result.metrics.netProfit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPercentage(result.metrics.returnPercentage)}
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
                <Typography variant="body2" color="text.secondary">
                  {formatDate(result.metrics.maxDrawdownDate)}
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
              <AreaChart data={result.equityCurve}>
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
                <TableCell align="right">{result.metrics.sortinoRatio.toFixed(2)}</TableCell>
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
                <TableCell>Average Trade Duration</TableCell>
                <TableCell align="right">{result.metrics.averageTradeDuration}</TableCell>
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
            <TableCell>Profit/Loss</TableCell>
            <TableCell>Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.trades.map((trade, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(trade.entryTime)}</TableCell>
              <TableCell>
                <Chip
                  label={trade.type}
                  color={trade.type === 'LONG' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
              <TableCell>{formatCurrency(trade.exitPrice)}</TableCell>
              <TableCell>{trade.size}</TableCell>
              <TableCell
                sx={{
                  color: trade.profit >= 0 ? 'success.main' : 'error.main',
                }}
              >
                {formatCurrency(trade.profit)}
              </TableCell>
              <TableCell>{trade.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAnalysis = () => (
    <Grid container spacing={3}>
      {/* Trade Distribution */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Trade Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={result.analysis.tradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Monthly Returns */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Returns
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={result.analysis.monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Bar
                  dataKey="return"
                  fill="#2196f3"
                  stroke="#2196f3"
                  fillOpacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Drawdown Analysis */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Drawdown Analysis
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={result.analysis.drawdownPeriods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#f44336"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderOptimization = () => (
    <Grid container spacing={3}>
      {/* Parameter Sensitivity */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Parameter Sensitivity Analysis
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="parameter" name="Parameter Value" />
                <YAxis dataKey="profit" name="Net Profit" />
                <RechartsTooltip />
                <Scatter
                  data={result.optimization.parameterSensitivity}
                  fill="#2196f3"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Walk-Forward Analysis */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Walk-Forward Analysis
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={result.optimization.walkForwardResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="inSampleReturn"
                  stroke="#2196f3"
                  name="In-Sample"
                />
                <Line
                  type="monotone"
                  dataKey="outOfSampleReturn"
                  stroke="#4caf50"
                  name="Out-of-Sample"
                />
                <Legend />
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
          <Tab label="Optimization" />
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
      <TabPanel value={activeTab} index={3}>
        {renderOptimization()}
      </TabPanel>
    </Box>
  );
};

export default BacktestReport;
