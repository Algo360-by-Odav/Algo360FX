import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
  SelectChangeEvent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Rating,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  CheckCircle,
  Notifications,
  Settings,
  Star,
  Dashboard,
  People,
  Assessment,
  SignalCellular4Bar,
  ArrowUpward,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Event,
  NotificationsActive,
  AttachMoney,
  ContentCopy,
  Update,
  PersonAdd,
  FilterList,
  Sort,
  SearchOutlined,
  InfoOutlined,
  History,
  Close,
  MoreVert,
  Timeline,
  ShowChart,
  BarChart,
} from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';
// SignalDetailsExpansion will be used in the expanded view of signals

export const SignalDashboard = observer(({ filters }: { filters?: any }) => {
  const { signalProviderStore } = useStores();
  const providers = signalProviderStore.getProviders();
  
  // Get all active signals
  const activeSignals = signalProviderStore.getActiveSignals();
  
  // State for dialogs
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [signalDetailsOpen, setSignalDetailsOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  
  // Tab state for dashboard sections
  const [dashboardTab, setDashboardTab] = useState(0);
  
  // Alert settings
  const [alertSettings, setAlertSettings] = useState({
    newSignals: true,
    signalUpdates: true,
    performanceReports: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });
  
  // Provider settings
  const [providerSettings, setProviderSettings] = useState({
    autoTrade: false,
    riskPerTrade: 2,
    maxOpenTrades: 5,
    tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
    delaySeconds: 0
  });

  // Mock performance data for charts
  const performanceData = {
    monthlyReturns: [
      { month: 'Jan', return: 2.4 },
      { month: 'Feb', return: -0.8 },
      { month: 'Mar', return: 3.7 },
      { month: 'Apr', return: 1.9 },
      { month: 'May', return: 4.2 },
      { month: 'Jun', return: -1.1 },
      { month: 'Jul', return: 3.5 },
      { month: 'Aug', return: 2.8 },
      { month: 'Sep', return: 0.6 },
      { month: 'Oct', return: -0.3 },
      { month: 'Nov', return: 5.4 },
      { month: 'Dec', return: 2.1 },
    ],
    pairDistribution: [
      { pair: 'EUR/USD', percentage: 32 },
      { pair: 'GBP/USD', percentage: 24 },
      { pair: 'USD/JPY', percentage: 18 },
      { pair: 'AUD/USD', percentage: 11 },
      { pair: 'USD/CAD', percentage: 8 },
      { pair: 'Others', percentage: 7 },
    ],
    winLossRatio: { wins: 68, losses: 32 },
    timing: { london: 45, newYork: 35, asian: 15, sydney: 5 },
  };
  
  // Market condition indicators
  const marketConditions = [
    { name: 'Volatility', value: 'High', trend: 'increasing', impact: 'negative' },
    { name: 'Liquidity', value: 'Medium', trend: 'stable', impact: 'neutral' },
    { name: 'Trend Strength', value: 'Strong', trend: 'stable', impact: 'positive' },
    { name: 'Economic Events', value: '2 Major', trend: 'upcoming', impact: 'caution' },
  ];
  
  // Recent activity feed
  const recentActivity = [
    { time: '09:45 AM', event: 'New GBPUSD signal from Alpha Signals', type: 'signal' },
    { time: '09:30 AM', event: 'FX Master take profit hit on EURUSD', type: 'profit' },
    { time: '08:55 AM', event: 'Position copied from Trend Hunter', type: 'copy' },
    { time: '08:15 AM', event: 'Stop loss adjusted on USDJPY', type: 'update' },
    { time: '07:30 AM', event: 'New provider Forex Kings subscribed', type: 'subscription' },
  ];
  
  // Apply filters function
  const getFilteredSignals = () => {
    if (!filters) {
      return activeSignals;
    }
    
    let result = [...activeSignals];
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(signal => {
        const provider = providers.find(p => p.id === signal.providerId);
        return (
          signal.pair.toLowerCase().includes(query) ||
          (provider && provider.name.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply currency pair filter
    if (filters.currencyPair && filters.currencyPair !== 'all') {
      result = result.filter(signal => signal.pair === filters.currencyPair);
    }
    
    // Apply risk level filter
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      result = result.filter(signal => {
        const provider = providers.find(p => p.id === signal.providerId);
        return provider && provider.risk.riskLevel === filters.riskLevel;
      });
    }
    
    // Apply profitability filter
    if (filters.profitability && filters.profitability !== 'all') {
      result = result.filter(signal => {
        if (filters.profitability === 'Profitable') return signal.profit > 0;
        if (filters.profitability === 'Break-even') return signal.profit === 0;
        if (filters.profitability === 'Loss') return signal.profit < 0;
        return true;
      });
    }
    
    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.openTime).getTime() - new Date(a.openTime).getTime();
          case 'oldest':
            return new Date(a.openTime).getTime() - new Date(b.openTime).getTime();
          case 'profit-high':
            return b.profit - a.profit;
          case 'profit-low':
            return a.profit - b.profit;
          case 'risk-low':
            return a.riskReward - b.riskReward;
          case 'risk-high':
            return b.riskReward - a.riskReward;
          case 'win-rate':
            const providerA = providers.find(p => p.id === a.providerId);
            const providerB = providers.find(p => p.id === b.providerId);
            return (providerB?.performance.winRate || 0) - (providerA?.performance.winRate || 0);
          default:
            return 0;
        }
      });
    }
    
    return result;
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Handle alert settings change
  const handleAlertSettingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlertSettings({
      ...alertSettings,
      [event.target.name]: event.target.checked,
    });
  };
  
  // Handle provider settings change
  const handleProviderSettingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.type === 'number'
        ? Number(event.target.value)
        : event.target.value;
        
    setProviderSettings({
      ...providerSettings,
      [event.target.name]: value,
    });
  };
  
  // Handle trading pair selection
  const handleTradingPairChange = (event: SelectChangeEvent<string[]>) => {
    setProviderSettings({
      ...providerSettings,
      tradingPairs: event.target.value as string[]
    });
  };
  
  // Save alert settings
  const saveAlertSettings = () => {
    console.log('Alert settings saved:', alertSettings);
    setAlertDialogOpen(false);
  };
  
  // Save provider settings
  const saveProviderSettings = () => {
    console.log('Provider settings saved:', providerSettings);
    setSettingsDialogOpen(false);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Dashboard Tabs */}
      <Paper sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden' }}>
        <Tabs
          value={dashboardTab}
          onChange={(e, newValue) => setDashboardTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: '64px',
              fontWeight: 500,
            },
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab 
            label="Overview" 
            icon={<Dashboard />} 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            label="Active Signals" 
            icon={<SignalCellular4Bar />} 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            label="Analytics" 
            icon={<Assessment />} 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            label="Providers" 
            icon={<People />} 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Paper>
      
      {/* Overview Tab Panel */}
      {dashboardTab === 0 && (
        <Box>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Total Profit Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', boxShadow: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Profit
                </Typography>
                <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                  +$14,380
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpward color="success" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    +8.2% from last month
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Active Signals Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', boxShadow: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Active Signals
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {activeSignals.length}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Across {providers.length} providers
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Win Rate Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', boxShadow: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Average Win Rate
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {performanceData.winLossRatio.wins}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpward color="success" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    +2.4% from last month
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Top Pair Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', boxShadow: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Top Currency Pair
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  EUR/USD
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {performanceData.pairDistribution[0].percentage}% of signals
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Recent Activity */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List sx={{ pt: 1 }}>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          {activity.type === 'signal' && <NotificationsActive color="primary" />}
                          {activity.type === 'profit' && <AttachMoney color="success" />}
                          {activity.type === 'copy' && <ContentCopy color="info" />}
                          {activity.type === 'update' && <Update color="warning" />}
                          {activity.type === 'subscription' && <PersonAdd color="secondary" />}
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.event}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            {/* Market Conditions */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: '12px', height: '100%', boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Market Conditions
                </Typography>
                <Grid container spacing={2}>
                  {marketConditions.map((condition) => (
                    <Grid item xs={12} sm={6} key={condition.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ flex: 1 }}>
                          {condition.name}
                        </Typography>
                        <Chip 
                          label={condition.value} 
                          color={
                            condition.impact === 'positive' ? 'success' : 
                            condition.impact === 'negative' ? 'error' : 
                            condition.impact === 'caution' ? 'warning' : 'default'
                          } 
                          size="small" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {condition.trend === 'increasing' && <TrendingUp fontSize="small" color="success" sx={{ mr: 1 }} />}
                        {condition.trend === 'decreasing' && <TrendingDown fontSize="small" color="error" sx={{ mr: 1 }} />}
                        {condition.trend === 'stable' && <TrendingFlat fontSize="small" color="action" sx={{ mr: 1 }} />}
                        {condition.trend === 'upcoming' && <Event fontSize="small" color="warning" sx={{ mr: 1 }} />}
                        <Typography variant="body2" color="text.secondary">
                          {condition.trend.charAt(0).toUpperCase() + condition.trend.slice(1)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Main Content - Subscribed Providers */}
          <Grid container spacing={3}>
            {providers.map((provider) => (
              <Grid item xs={12} key={provider.id}>
                <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: 3 }}>
                  <Grid container spacing={3}>
                    {/* Provider Header */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
                        >
                          {provider.name[0]}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" color="primary">
                              {provider.name}
                            </Typography>
                            {provider.verified && (
                              <CheckCircle color="primary" sx={{ ml: 1, fontSize: 20 }} />
                            )}
                            <Chip
                              label={provider.risk.riskLevel}
                              color={getRiskLevelColor(provider.risk.riskLevel) as any}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {provider.description}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            onClick={() => {
                              setSelectedProvider(provider);
                              setSettingsDialogOpen(true);
                            }}
                          >
                            <Settings />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setSelectedProvider(provider);
                              setAlertDialogOpen(true);
                            }}
                          >
                            <Notifications />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Provider Stats */}
                    <Grid item xs={12} md={3}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Performance
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            +{provider.performance.totalReturn}%
                          </Typography>
                          <Typography variant="caption">
                            Monthly: +{provider.performance.monthlyReturn}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Win Rate
                          </Typography>
                          <Typography variant="h4">
                            {provider.performance.winRate}%
                          </Typography>
                          <Typography variant="caption">
                            Profit Factor: {provider.performance.profitFactor}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Signals
                          </Typography>
                          <Typography variant="h4">
                            {provider.performance.totalSignals}
                          </Typography>
                          <Typography variant="caption">
                            {provider.performance.avgTradesPerMonth} per month
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Subscribers
                          </Typography>
                          <Typography variant="h4">
                            {provider.subscription.subscribers}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: 'gold', mr: 0.5 }} />
                            <Typography variant="caption">
                              {provider.subscription.rating} ({provider.subscription.reviews} reviews)
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Active Signals Tab Panel */}
      {dashboardTab === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Active Signals ({getFilteredSignals().length})</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<FilterList />}
                  variant="outlined"
                  size="small"
                  color="primary"
                >
                  Filter
                </Button>
                <Button
                  startIcon={<Sort />}
                  variant="outlined"
                  size="small"
                  color="primary"
                >
                  Sort
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {getFilteredSignals().map((signal) => (
                <Grid item xs={12} sm={6} md={4} key={signal.id}>
                  <Card sx={{ borderRadius: '8px', boxShadow: 2, height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip label={signal.pair} color="primary" />
                        <Chip
                          label={signal.direction === 'Buy' ? 'Buy' : 'Sell'}
                          color={signal.direction === 'Buy' ? 'success' : 'error'}
                        />
                      </Box>
                      
                      <Typography variant="body2" gutterBottom>
                        Entry: {signal.entryPrice}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2">
                          TP: {signal.takeProfit}
                        </Typography>
                        <Typography variant="body2">
                          SL: {signal.stopLoss}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Profit/Loss
                          </Typography>
                          <Typography variant="h6" color={signal.profit >= 0 ? 'success.main' : 'error.main'}>
                            {formatCurrency(signal.profit)}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ borderRadius: '20px' }}
                        >
                          Copy Trade
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Analytics Tab Panel */}
      {dashboardTab === 2 && (
        <Box>
          <Grid container spacing={3}>
            {/* Performance Charts */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Performance Analysis</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Monthly returns across all signal providers. The chart shows aggregated performance data.
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    [Monthly Returns Chart - To be implemented with Chart.js]  
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Distribution Charts */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Signal Distribution</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Currency pair distribution across all signals.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {performanceData.pairDistribution.map((pair) => (
                    <Box key={pair.pair} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{pair.pair}</Typography>
                        <Typography variant="body2">{pair.percentage}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={pair.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: 'action.hover'
                        }} 
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            {/* Win/Loss Stats */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Win/Loss Statistics</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="success.main" gutterBottom>
                        {performanceData.winLossRatio.wins}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Win Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="error.main" gutterBottom>
                        {performanceData.winLossRatio.losses}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Loss Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    [Win/Loss Pie Chart - To be implemented with Chart.js]
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Trading Session Analysis */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Trading Session Analysis</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Signal performance across different market sessions.
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Session</TableCell>
                        <TableCell>Signals %</TableCell>
                        <TableCell>Win Rate</TableCell>
                        <TableCell>Avg. Profit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>London</TableCell>
                        <TableCell>{performanceData.timing.london}%</TableCell>
                        <TableCell>71.2%</TableCell>
                        <TableCell style={{ color: '#4caf50' }}>+2.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>New York</TableCell>
                        <TableCell>{performanceData.timing.newYork}%</TableCell>
                        <TableCell>68.5%</TableCell>
                        <TableCell style={{ color: '#4caf50' }}>+1.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Asian</TableCell>
                        <TableCell>{performanceData.timing.asian}%</TableCell>
                        <TableCell>63.1%</TableCell>
                        <TableCell style={{ color: '#4caf50' }}>+1.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sydney</TableCell>
                        <TableCell>{performanceData.timing.sydney}%</TableCell>
                        <TableCell>58.4%</TableCell>
                        <TableCell style={{ color: '#f44336' }}>-0.3%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Providers Tab Panel */}
      {dashboardTab === 3 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Signal Providers Directory</Typography>
              <TextField
                placeholder="Search providers..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <SearchOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ width: 250 }}
              />
            </Box>
            
            <Grid container spacing={3}>
              {providers.map((provider) => (
                <Grid item xs={12} sm={6} md={4} key={provider.id}>
                  <Card sx={{ borderRadius: '8px', boxShadow: 2, height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                          {provider.name[0]}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6">
                              {provider.name}
                            </Typography>
                            {provider.verified && (
                              <CheckCircle color="primary" sx={{ ml: 1, fontSize: 16 }} />
                            )}
                          </Box>
                          <Rating
                            value={provider.subscription.rating / 2}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {provider.description}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Performance
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            +{provider.performance.totalReturn}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Win Rate
                          </Typography>
                          <Typography variant="body2">
                            {provider.performance.winRate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Signals
                          </Typography>
                          <Typography variant="body2">
                            {provider.performance.totalSignals}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Risk Level
                          </Typography>
                          <Chip
                            label={provider.risk.riskLevel}
                            color={getRiskLevelColor(provider.risk.riskLevel) as any}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                      
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ borderRadius: '20px' }}
                      >
                        Subscribe
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Settings Dialog */}
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedProvider ? `Settings - ${selectedProvider.name}` : 'Provider Settings'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Automated Trading Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={providerSettings.autoTrade}
                  onChange={(e) => setProviderSettings({
                    ...providerSettings,
                    autoTrade: e.target.checked
                  })}
                  color="primary"
                />
              }
              label="Enable auto-trading for this provider"
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Risk per trade (%)"
                  type="number"
                  value={providerSettings.riskPerTrade}
                  onChange={(e) => setProviderSettings({
                    ...providerSettings,
                    riskPerTrade: Number(e.target.value)
                  })}
                  inputProps={{ min: 0.1, max: 10, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max open trades"
                  type="number"
                  value={providerSettings.maxOpenTrades}
                  onChange={(e) => setProviderSettings({
                    ...providerSettings,
                    maxOpenTrades: Number(e.target.value)
                  })}
                  inputProps={{ min: 1, max: 20, step: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Trading pairs</InputLabel>
                  <Select
                    multiple
                    value={providerSettings.tradingPairs}
                    onChange={(e: SelectChangeEvent<string[]>) => setProviderSettings({
                      ...providerSettings,
                      tradingPairs: e.target.value as string[]
                    })}
                    renderValue={(selected) => (selected as string[]).join(', ')}
                  >
                    <MenuItem value="EUR/USD">
                      <Checkbox checked={providerSettings.tradingPairs.indexOf('EUR/USD') > -1} />
                      <ListItemText primary="EUR/USD" />
                    </MenuItem>
                    <MenuItem value="GBP/USD">
                      <Checkbox checked={providerSettings.tradingPairs.indexOf('GBP/USD') > -1} />
                      <ListItemText primary="GBP/USD" />
                    </MenuItem>
                    <MenuItem value="USD/JPY">
                      <Checkbox checked={providerSettings.tradingPairs.indexOf('USD/JPY') > -1} />
                      <ListItemText primary="USD/JPY" />
                    </MenuItem>
                    <MenuItem value="AUD/USD">
                      <Checkbox checked={providerSettings.tradingPairs.indexOf('AUD/USD') > -1} />
                      <ListItemText primary="AUD/USD" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Signal delay (seconds)"
                  type="number"
                  value={providerSettings.delaySeconds}
                  onChange={(e) => setProviderSettings({
                    ...providerSettings,
                    delaySeconds: Number(e.target.value)
                  })}
                  helperText="Delay in seconds before executing the signal"
                  inputProps={{ min: 0, max: 300, step: 1 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveProviderSettings} variant="contained" color="primary">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Settings Dialog */}
      <Dialog
        open={alertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedProvider ? `Alerts - ${selectedProvider.name}` : 'Alert Settings'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Alert Types
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={alertSettings.newSignals}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    newSignals: e.target.checked
                  })}
                />
              }
              label="New Signals"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={alertSettings.signalUpdates}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    signalUpdates: e.target.checked
                  })}
                />
              }
              label="Signal Updates"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={alertSettings.performanceReports}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    performanceReports: e.target.checked
                  })}
                />
              }
              label="Performance Reports"
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Notification Methods
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={alertSettings.emailNotifications}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    emailNotifications: e.target.checked
                  })}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={alertSettings.pushNotifications}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    pushNotifications: e.target.checked
                  })}
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={alertSettings.smsNotifications}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    smsNotifications: e.target.checked
                  })}
                />
              }
              label="SMS Notifications"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setAlertDialogOpen(false)} variant="contained" color="primary">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Signal Details Dialog */}
      <Dialog
        open={signalDetailsOpen}
        onClose={() => setSignalDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedSignal && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                  {selectedSignal.pair} {selectedSignal.direction} Signal
                </Typography>
                <IconButton onClick={() => setSignalDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Signal Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Direction</Typography>
                        <Typography variant="body1">{selectedSignal.direction}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Entry Price</Typography>
                        <Typography variant="body1">{selectedSignal.entryPrice}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Take Profit</Typography>
                        <Typography variant="body1">{selectedSignal.takeProfit}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Stop Loss</Typography>
                        <Typography variant="body1">{selectedSignal.stopLoss}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Time Frame</Typography>
                        <Typography variant="body1">{selectedSignal.timeFrame || 'H4'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Signal Date</Typography>
                        <Typography variant="body1">{selectedSignal.date || '2023-05-31'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>Trade Status</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '80%' }}>
                      <Typography variant="h4" color={selectedSignal.profit >= 0 ? 'success.main' : 'error.main'}>
                        {formatCurrency(selectedSignal.profit)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current P/L
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Signal Notes</Typography>
                    <Typography variant="body2">
                      {selectedSignal.notes || 
                        'Trading based on a strong breakout of a key resistance level. Price action shows momentum with increasing volume. Stop loss placed below the recent swing low for protection.'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSignalDetailsOpen(false)}>Close</Button>
              <Button variant="contained" color="primary">
                Copy Trade
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

export default SignalDashboard;
