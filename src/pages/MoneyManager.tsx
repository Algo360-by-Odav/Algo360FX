import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  LinearProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  InputLabel,
  Select,
  Switch,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Analytics,
  PieChart,
  ShowChart,
  Assignment,
  Timeline,
  TrendingUp,
  AddCircle,
  Assessment,
  Warning,
  NoteAdd,
  GetApp,
  PictureAsPdf,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const MoneyManager: React.FC = observer(() => {
  const rootStore = useRootStore();
  const { moneyManagerStore } = rootStore;
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        await Promise.all([
          moneyManagerStore.fetchPortfolioSummary(),
          moneyManagerStore.fetchPerformanceMetrics(),
          moneyManagerStore.fetchAssetAllocation(),
          moneyManagerStore.fetchRecentTrades()
        ]);
      } catch (err) {
        console.error('Error fetching money manager data:', err);
        setError('Failed to load money manager data. Please try again later.');
      }
    };

    fetchData();
  }, [moneyManagerStore]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (moneyManagerStore.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || moneyManagerStore.error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Warning color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Money Manager
        </Typography>
        <Typography color="textSecondary">
          {error || moneyManagerStore.error}
        </Typography>
      </Box>
    );
  }

  const { portfolioSummary, performanceMetrics, assetAllocation, recentTrades } = moneyManagerStore;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Money Manager
        </Typography>
        <Typography color="textSecondary">
          Manage your portfolio and track performance
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="money manager tabs">
          <Tab label="Overview" />
          <Tab label="Portfolio Management" />
          <Tab label="Performance Analytics" />
          <Tab label="Asset Allocation" />
          <Tab label="Trading Activity" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography color="textSecondary" gutterBottom>
                Assets Under Management
              </Typography>
              <Typography variant="h4" component="div">
                ${(portfolioSummary.aum / 1000000).toFixed(1)}M
              </Typography>
              <Typography color="success.main" variant="body2">
                +{portfolioSummary.monthlyReturn}% this month
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Active Portfolios
              </Typography>
              <Typography variant="h4" component="div">
                {portfolioSummary.activePortfolios}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Across {portfolioSummary.totalClients} clients
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Performance
              </Typography>
              <Typography variant="h4" component="div">
                {performanceMetrics.winRate}%
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Win rate
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Risk Metrics
              </Typography>
              <Typography variant="h4" component="div">
                {performanceMetrics.sharpeRatio.toFixed(2)}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Sharpe Ratio
              </Typography>
            </Paper>
          </Grid>

          {/* Asset Allocation Overview */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Asset Allocation Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                {assetAllocation.map((asset) => (
                  <Box key={asset.asset} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{asset.asset}</Typography>
                      <Typography variant="body2">{asset.allocation}%</Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${asset.allocation}%`,
                          height: '100%',
                          bgcolor: 'primary.main',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentTrades.map((trade, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {trade.type === 'BUY' ? (
                          <TrendingUp color="success" />
                        ) : (
                          <TrendingUp color="error" sx={{ transform: 'rotate(180deg)' }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${trade.type} ${trade.symbol}`}
                        secondary={`$${trade.amount.toLocaleString()} - ${trade.date}`}
                      />
                    </ListItem>
                    {index < recentTrades.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Portfolio Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Strategy Performance Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Strategy Performance
              </Typography>
              <List>
                {/* Conservative Strategy */}
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">Conservative</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography 
                            variant="subtitle1" 
                            color="success.main" 
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            +5.2%
                          </Typography>
                          <Chip 
                            label="Low" 
                            size="small" 
                            sx={{ 
                              bgcolor: 'success.light',
                              color: 'success.contrastText',
                              minWidth: 80
                            }} 
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />

                {/* Balanced Strategy */}
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">Balanced</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography 
                            variant="subtitle1" 
                            color="success.main" 
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            +7.8%
                          </Typography>
                          <Chip 
                            label="Medium" 
                            size="small" 
                            sx={{ 
                              bgcolor: 'warning.light',
                              color: 'warning.contrastText',
                              minWidth: 80
                            }} 
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />

                {/* Aggressive Strategy */}
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">Aggressive</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography 
                            variant="subtitle1" 
                            color="success.main" 
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            +12.4%
                          </Typography>
                          <Chip 
                            label="High" 
                            size="small" 
                            sx={{ 
                              bgcolor: 'error.light',
                              color: 'error.contrastText',
                              minWidth: 80
                            }} 
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />

                {/* Forex Focus Strategy */}
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">Forex Focus</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography 
                            variant="subtitle1" 
                            color="success.main" 
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            +9.6%
                          </Typography>
                          <Chip 
                            label="Medium-High" 
                            size="small" 
                            sx={{ 
                              bgcolor: 'error.light',
                              color: 'error.contrastText',
                              minWidth: 80
                            }} 
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Portfolio Performance Overview */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance Overview
              </Typography>
              <Box sx={{ height: 400, width: '100%', bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', Conservative: 1.2, Balanced: 2.1, Aggressive: 3.5, ForexFocus: 2.8 },
                      { month: 'Feb', Conservative: 2.1, Balanced: 3.4, Aggressive: 5.2, ForexFocus: 4.1 },
                      { month: 'Mar', Conservative: 2.8, Balanced: 4.2, Aggressive: 6.1, ForexFocus: 5.0 },
                      { month: 'Apr', Conservative: 3.2, Balanced: 4.8, Aggressive: 7.0, ForexFocus: 5.8 },
                      { month: 'May', Conservative: 3.9, Balanced: 5.5, Aggressive: 8.2, ForexFocus: 6.5 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis unit="%" />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`]}
                      labelStyle={{ color: 'black' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Conservative" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Balanced" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Aggressive" stroke="#ff7300" />
                    <Line type="monotone" dataKey="ForexFocus" stroke="#0088fe" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Performance Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Total Return', value: '+15.8%', change: '+2.3%', period: 'YTD' },
                  { label: 'Sharpe Ratio', value: '1.85', change: '+0.12', period: '3M' },
                  { label: 'Max Drawdown', value: '-5.2%', change: '+1.1%', period: '1Y' },
                  { label: 'Win Rate', value: '68%', change: '+3%', period: 'MTD' },
                ].map((metric, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="h6">{metric.value}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          color={metric.change.startsWith('+') ? 'success.main' : 'error.main'}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          {metric.change}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                          {metric.period}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Risk Analysis */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Analysis
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Value at Risk (VaR)', value: '$125K', risk: 'Medium' },
                  { label: 'Beta', value: '0.85', risk: 'Low' },
                  { label: 'Volatility', value: '12.5%', risk: 'Medium' },
                  { label: 'Correlation', value: '0.65', risk: 'Low' },
                ].map((metric, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="h6">{metric.value}</Typography>
                      <Chip
                        label={metric.risk}
                        size="small"
                        color={
                          metric.risk === 'Low'
                            ? 'success'
                            : metric.risk === 'Medium'
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Performance Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance vs Benchmark
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart
                    data={[
                      { date: 'Jan', portfolio: 100, benchmark: 100 },
                      { date: 'Feb', portfolio: 105, benchmark: 102 },
                      { date: 'Mar', portfolio: 108, benchmark: 104 },
                      { date: 'Apr', portfolio: 112, benchmark: 106 },
                      { date: 'May', portfolio: 115, benchmark: 108 },
                      { date: 'Jun', portfolio: 118, benchmark: 109 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      name="Portfolio"
                      stroke="#2196f3"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Benchmark"
                      stroke="#9e9e9e"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Asset Allocation Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {/* Current Allocation */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Asset Allocation
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Forex', value: 40, color: '#2196f3' },
                        { name: 'Stocks', value: 30, color: '#4caf50' },
                        { name: 'Crypto', value: 15, color: '#f44336' },
                        { name: 'Commodities', value: 15, color: '#ff9800' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Forex', value: 40, color: '#2196f3' },
                        { name: 'Stocks', value: 30, color: '#4caf50' },
                        { name: 'Crypto', value: 15, color: '#f44336' },
                        { name: 'Commodities', value: 15, color: '#ff9800' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Allocation Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Allocation Details
              </Typography>
              <List>
                {[
                  { name: 'Forex', allocation: 40, target: 45, color: '#2196f3' },
                  { name: 'Stocks', allocation: 30, target: 25, color: '#4caf50' },
                  { name: 'Crypto', allocation: 15, target: 15, color: '#f44336' },
                  { name: 'Commodities', allocation: 15, target: 15, color: '#ff9800' },
                ].map((asset, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">{asset.name}</Typography>
                            <Typography variant="subtitle1">
                              {asset.allocation}% / {asset.target}%
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(asset.allocation / asset.target) * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: asset.color,
                                },
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Rebalancing Recommendations */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rebalancing Recommendations
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Class</TableCell>
                    <TableCell align="right">Current</TableCell>
                    <TableCell align="right">Target</TableCell>
                    <TableCell align="right">Difference</TableCell>
                    <TableCell align="right">Action Required</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { asset: 'Forex', current: 40, target: 45, action: 'Buy $50,000' },
                    { asset: 'Stocks', current: 30, target: 25, action: 'Sell $25,000' },
                    { asset: 'Crypto', current: 15, target: 15, action: 'Hold' },
                    { asset: 'Commodities', current: 15, target: 15, action: 'Hold' },
                  ].map((row) => (
                    <TableRow key={row.asset}>
                      <TableCell>{row.asset}</TableCell>
                      <TableCell align="right">{row.current}%</TableCell>
                      <TableCell align="right">{row.target}%</TableCell>
                      <TableCell align="right">
                        <Typography
                          color={row.current > row.target ? 'error.main' : 'success.main'}
                        >
                          {row.current - row.target}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={row.action}
                          color={
                            row.action === 'Hold'
                              ? 'default'
                              : row.action.startsWith('Buy')
                              ? 'success'
                              : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Trading Activity Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          {/* Trading Statistics */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trading Statistics (Last 30 Days)
              </Typography>
              <List>
                {[
                  { label: 'Total Trades', value: '156', change: '+12%' },
                  { label: 'Win Rate', value: '68%', change: '+3%' },
                  { label: 'Average Profit', value: '$850', change: '+5%' },
                  { label: 'Average Loss', value: '$320', change: '-2%' },
                ].map((stat, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={stat.label}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="h6" sx={{ mr: 1 }}>
                              {stat.value}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                            >
                              {stat.change}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Recent Trades */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Trades
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Pair</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Entry</TableCell>
                    <TableCell align="right">Exit</TableCell>
                    <TableCell align="right">Profit/Loss</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    {
                      date: '2024-12-23',
                      pair: 'EUR/USD',
                      type: 'BUY',
                      entry: '1.0950',
                      exit: '1.0980',
                      pnl: '+$300',
                    },
                    {
                      date: '2024-12-23',
                      pair: 'GBP/JPY',
                      type: 'SELL',
                      entry: '186.50',
                      exit: '186.20',
                      pnl: '+$450',
                    },
                    {
                      date: '2024-12-22',
                      pair: 'USD/JPY',
                      type: 'BUY',
                      entry: '142.30',
                      exit: '142.10',
                      pnl: '-$200',
                    },
                    {
                      date: '2024-12-22',
                      pair: 'AUD/USD',
                      type: 'SELL',
                      entry: '0.6750',
                      exit: '0.6720',
                      pnl: '+$600',
                    },
                  ].map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell>{trade.date}</TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell>
                        <Chip
                          label={trade.type}
                          size="small"
                          color={trade.type === 'BUY' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">{trade.entry}</TableCell>
                      <TableCell align="right">{trade.exit}</TableCell>
                      <TableCell align="right">
                        <Typography
                          color={trade.pnl.startsWith('+') ? 'success.main' : 'error.main'}
                        >
                          {trade.pnl}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* Trading Activity Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Daily Trading Activity
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={[
                      { date: 'Mon', trades: 35, profit: 2500 },
                      { date: 'Tue', trades: 28, profit: -1200 },
                      { date: 'Wed', trades: 42, profit: 3800 },
                      { date: 'Thu', trades: 31, profit: 1500 },
                      { date: 'Fri', trades: 38, profit: 2800 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="trades" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="profit" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Client Reports Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          {/* Report Generation */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generate Report
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Report Type"
                    defaultValue="performance"
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="performance">Performance Report</MenuItem>
                    <MenuItem value="allocation">Asset Allocation Report</MenuItem>
                    <MenuItem value="risk">Risk Analysis Report</MenuItem>
                    <MenuItem value="tax">Tax Report</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Start Date"
                    defaultValue="2024-01-01"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    fullWidth
                    label="End Date"
                    defaultValue="2024-12-31"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Include Sections</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Portfolio Summary"
                      />
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Performance Analysis"
                      />
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Risk Metrics"
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Transaction History"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PictureAsPdf />}
                    sx={{ mt: 2 }}
                  >
                    Generate Report
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Reports */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Reports
              </Typography>
              <List>
                {[
                  {
                    name: 'December 2024 Performance Report',
                    date: '2024-12-23',
                    size: '2.4 MB',
                  },
                  {
                    name: 'Q4 2024 Asset Allocation Report',
                    date: '2024-12-20',
                    size: '1.8 MB',
                  },
                  {
                    name: 'November 2024 Risk Analysis',
                    date: '2024-12-15',
                    size: '3.1 MB',
                  },
                  {
                    name: '2024 Tax Report Draft',
                    date: '2024-12-10',
                    size: '4.2 MB',
                  },
                ].map((report, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="download">
                          <GetApp />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <PictureAsPdf />
                      </ListItemIcon>
                      <ListItemText
                        primary={report.name}
                        secondary={`Generated on ${report.date} • ${report.size}`}
                      />
                    </ListItem>
                    {index < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Report Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Report Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Default Report Format</InputLabel>
                    <Select defaultValue="pdf" label="Default Report Format">
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="excel">Excel</MenuItem>
                      <MenuItem value="csv">CSV</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Report Language</InputLabel>
                    <Select defaultValue="en" label="Report Language">
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable Automatic Monthly Reports"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Include Performance Benchmarks"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch />}
                    label="Enable Report Email Notifications"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
});

export default MoneyManager;


