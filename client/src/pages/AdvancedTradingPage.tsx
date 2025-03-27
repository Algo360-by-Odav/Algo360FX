import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Analytics as AnalysisIcon,
  Assessment as AlgorithmIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as DateIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as StartIcon,
  Save as SaveIcon,
  Security as RiskIcon,
  Settings as SettingsIcon,
  Stop as StopIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import {
  AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { observer } from 'mobx-react-lite';
import TradingChart from '../components/trading/TradingChart';

// Constants
const algorithmTypes = [
  { value: 'trend', label: 'Trend Following' },
  { value: 'mean-reversion', label: 'Mean Reversion' },
  { value: 'arbitrage', label: 'Arbitrage' },
  { value: 'ml-based', label: 'Machine Learning' }
] as const;

const timeframes = [
  '1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W'
] as const;

const availableIndicators = [
  'MA20', 'MA50', 'MA200', 'RSI', 'MACD', 'Bollinger Bands', 
  'Stochastic', 'ATR', 'Volume Profile', 'Support/Resistance'
] as const;

// Types
type AlgorithmType = typeof algorithmTypes[number]['value'];
type Timeframe = typeof timeframes[number];
type Indicator = typeof availableIndicators[number];

interface Algorithm {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  type: AlgorithmType;
  performance: {
    totalReturns: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  settings: {
    timeframe: Timeframe;
    position: {
      size: number;
      maxLeverage: number;
    };
    stopLoss: number;
    takeProfit: number;
    indicators: Indicator[];
  };
  lastModified: string;
  createdAt: string;
}

interface OrderType {
  type: 'market' | 'limit' | 'stop' | 'trailing_stop' | 'iceberg' | 'twap' | 'vwap';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  trailingAmount?: number;
  trailingUnit?: 'amount' | 'percent';
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  visible_size?: number;
  total_size?: number;
  duration?: number;
  targetTime?: string;
  maxSlippage?: number;
}

interface TradingSettings {
  general: {
    defaultOrderSize: number;
    defaultLeverage: number;
    timezone: string;
    theme: 'light' | 'dark';
  };
  riskManagement: {
    maxPositionSize: number;
    maxDrawdown: number;
    dailyLossLimit: number;
    marginCallLevel: number;
  };
  automation: {
    enableAutoTrading: boolean;
    tradingHours: {
      start: string;
      end: string;
    };
    maxDailyTrades: number;
    restartOnError: boolean;
  };
  notifications: {
    email: boolean;
    desktop: boolean;
    mobile: boolean;
    telegram: boolean;
    events: {
      orderFilled: boolean;
      stopLossHit: boolean;
      takeProfitHit: boolean;
      marginCall: boolean;
      systemError: boolean;
    };
  };
  apiConnections: {
    exchange: string;
    apiKey: string;
    apiSecret: string;
    testnet: boolean;
  };
}

interface PerformanceData {
  equity: number[];
  dates: string[];
  trades: {
    wins: number;
    losses: number;
    total: number;
  };
  returns: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  metrics: {
    sharpeRatio: number;
    sortino: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    averageTrade: number;
  };
  strategyReturns: {
    momentum: number;
    meanReversion: number;
    arbitrage: number;
    marketMaking: number;
    other: number;
  };
}

const sampleAlgorithms: Algorithm[] = [
  {
    id: '1',
    name: 'MA Crossover Strategy',
    description: 'Simple moving average crossover strategy using 20 and 50 period MAs',
    status: 'active',
    type: 'trend',
    performance: {
      totalReturns: 15.8,
      sharpeRatio: 1.2,
      maxDrawdown: -8.5,
      winRate: 58.5
    },
    settings: {
      timeframe: '1h',
      position: {
        size: 0.1,
        maxLeverage: 5
      },
      stopLoss: 2,
      takeProfit: 4,
      indicators: ['MA20', 'MA50', 'RSI']
    },
    lastModified: '2025-01-23T12:00:00Z',
    createdAt: '2025-01-20T09:00:00Z'
  },
  {
    id: '2',
    name: 'RSI Mean Reversion',
    description: 'Mean reversion strategy based on RSI oversold/overbought conditions',
    status: 'inactive',
    type: 'mean-reversion',
    performance: {
      totalReturns: 12.3,
      sharpeRatio: 1.1,
      maxDrawdown: -6.2,
      winRate: 62.1
    },
    settings: {
      timeframe: '4h',
      position: {
        size: 0.15,
        maxLeverage: 3
      },
      stopLoss: 1.5,
      takeProfit: 3,
      indicators: ['RSI', 'Bollinger Bands']
    },
    lastModified: '2025-01-22T15:30:00Z',
    createdAt: '2025-01-19T14:00:00Z'
  }
];

const samplePerformanceData: PerformanceData = {
  equity: [10000, 10500, 11200, 10800, 11500, 12000, 11800, 12500, 13000, 12800, 13500, 14000],
  dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  trades: {
    wins: 285,
    losses: 102,
    total: 387,
  },
  returns: {
    daily: [0.5, -0.3, 0.8, -0.2, 0.6, 0.4, -0.1, 0.7, 0.3, -0.4, 0.5, 0.2],
    weekly: [1.2, -0.8, 1.5, 0.9, -0.5, 1.1, 0.7, 1.3, -0.6, 0.8, 1.0, 1.4],
    monthly: [3.5, 2.8, -1.5, 2.2, 1.8, 3.0, -0.8, 2.5, 1.9, -1.2, 2.7, 2.1],
  },
  metrics: {
    sharpeRatio: 1.85,
    sortino: 2.15,
    maxDrawdown: 8.4,
    winRate: 73.6,
    profitFactor: 1.85,
    averageTrade: 127,
  },
  strategyReturns: {
    momentum: 35,
    meanReversion: 25,
    arbitrage: 20,
    marketMaking: 15,
    other: 5,
  },
};

const AdvancedTradingPage: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(sampleAlgorithms);
  const [isRunning, setIsRunning] = useState<{ [key: string]: boolean }>({});

  // Performance Analytics state
  const [startDate, setStartDate] = useState<Date | null>(new Date(2024, 0, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Order state
  const [orderType, setOrderType] = useState<OrderType>({
    type: 'market',
    side: 'buy',
    quantity: 0,
    timeInForce: 'GTC',
  });

  const defaultFormData: Algorithm = {
    id: '',
    name: '',
    description: '',
    type: 'trend',
    status: 'inactive',
    settings: {
      timeframe: '1h',
      position: {
        size: 0.1,
        maxLeverage: 3
      },
      stopLoss: 2,
      takeProfit: 4,
      indicators: []
    },
    performance: {
      totalReturns: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      winRate: 0
    },
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const [formData, setFormData] = useState<Algorithm>(defaultFormData);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>([]);

  const [riskSettings, setRiskSettings] = useState({
    positionSizeType: 'fixed',
    fixedSize: 0.01,
    riskPerTrade: 1,
    maxDrawdown: 10,
    maxDailyLoss: 5,
    maxPositions: 3,
    leverageLimit: 10,
    stopLossRequired: true,
    dynamicPositionSizing: false,
    trailingStopLoss: false,
    hedgingEnabled: false,
  });

  const handleRiskSettingChange = (setting: keyof typeof riskSettings, value: any) => {
    setRiskSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  useEffect(() => {
    if (selectedAlgorithm) {
      setFormData(selectedAlgorithm);
      setSelectedIndicators(selectedAlgorithm.settings.indicators);
    } else {
      resetForm();
    }
  }, [selectedAlgorithm]);

  const resetForm = () => {
    setFormData(defaultFormData);
    setSelectedIndicators([]);
  };

  const handleFormChange = (field: keyof Algorithm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field: keyof Algorithm['settings'], value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const handlePositionSettingsChange = (field: keyof Algorithm['settings']['position'], value: number) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        position: {
          ...prev.settings.position,
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    const newAlgorithm: Algorithm = {
      ...formData,
      id: selectedAlgorithm?.id || String(Date.now()),
      settings: {
        ...formData.settings,
        indicators: selectedIndicators
      },
      lastModified: new Date().toISOString(),
      createdAt: selectedAlgorithm?.createdAt || new Date().toISOString()
    };

    if (selectedAlgorithm) {
      setAlgorithms(prev => prev.map(a => a.id === selectedAlgorithm.id ? newAlgorithm : a));
    } else {
      setAlgorithms(prev => [...prev, newAlgorithm]);
    }
    
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getStatusColor = (status: Algorithm['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleStartStop = (algorithmId: string) => {
    setIsRunning(prev => ({
      ...prev,
      [algorithmId]: !prev[algorithmId]
    }));
  };

  const handleEdit = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsDeleteDialogOpen(true);
  };

  const renderAlgorithmList = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Trading Algorithms</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedAlgorithm(null);
            setIsEditDialogOpen(true);
          }}
        >
          New Algorithm
        </Button>
      </Box>

      <Grid container spacing={3}>
        {algorithms.map((algorithm) => (
          <Grid item xs={12} md={6} key={algorithm.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {algorithm.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {algorithm.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(algorithm.status)
                        }}
                      />
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {algorithm.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • {algorithm.type}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEdit(algorithm)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(algorithm)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleStartStop(algorithm.id)}
                      color={isRunning[algorithm.id] ? 'error' : 'success'}
                    >
                      {isRunning[algorithm.id] ? <StopIcon /> : <StartIcon />}
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Performance</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2">
                        Returns: {algorithm.performance.totalReturns.toFixed(2)}%
                      </Typography>
                      <Typography variant="body2">
                        Sharpe: {algorithm.performance.sharpeRatio.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        Max DD: {algorithm.performance.maxDrawdown.toFixed(2)}%
                      </Typography>
                      <Typography variant="body2">
                        Win Rate: {algorithm.performance.winRate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Settings</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2">
                        Timeframe: {algorithm.settings.timeframe}
                      </Typography>
                      <Typography variant="body2">
                        Position Size: {algorithm.settings.position.size} BTC
                      </Typography>
                      <Typography variant="body2">
                        Leverage: {algorithm.settings.position.maxLeverage}x
                      </Typography>
                      <Typography variant="body2">
                        SL/TP: {algorithm.settings.stopLoss}% / {algorithm.settings.takeProfit}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last modified: {new Date(algorithm.lastModified).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Algorithm Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => {
          setIsEditDialogOpen(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAlgorithm ? 'Edit Algorithm' : 'Create New Algorithm'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>Basic Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Algorithm Name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      label="Type"
                    >
                      {algorithmTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Trading Settings */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>Trading Settings</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={formData.settings?.timeframe}
                      onChange={(e) => handleSettingsChange('timeframe', e.target.value)}
                      label="Timeframe"
                    >
                      {timeframes.map((tf) => (
                        <MenuItem key={tf} value={tf}>{tf}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Position Size (BTC)"
                    value={formData.settings?.position.size}
                    onChange={(e) => handlePositionSettingsChange('size', parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0.001, step: 0.001 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Leverage"
                    value={formData.settings?.position.maxLeverage}
                    onChange={(e) => handlePositionSettingsChange('maxLeverage', parseInt(e.target.value))}
                    InputProps={{
                      inputProps: { min: 1, max: 100, step: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Stop Loss (%)"
                    value={formData.settings?.stopLoss}
                    onChange={(e) => handleSettingsChange('stopLoss', parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0.1, step: 0.1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Take Profit (%)"
                    value={formData.settings?.takeProfit}
                    onChange={(e) => handleSettingsChange('takeProfit', parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0.1, step: 0.1 }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Indicators */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>Technical Indicators</Typography>
              <Grid container spacing={1}>
                {availableIndicators.map((indicator) => (
                  <Grid item key={indicator}>
                    <Chip
                      label={indicator}
                      onClick={() => {
                        if (selectedIndicators.includes(indicator)) {
                          setSelectedIndicators(prev => prev.filter(i => i !== indicator));
                        } else {
                          setSelectedIndicators(prev => [...prev, indicator]);
                        }
                      }}
                      color={selectedIndicators.includes(indicator) ? 'primary' : 'default'}
                      sx={{ m: 0.5 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Risk Warning */}
            <Alert severity="info" sx={{ mt: 2 }}>
              Please ensure your algorithm settings align with your risk management strategy. 
              Test thoroughly in a demo environment before deploying.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!formData.name || !formData.type}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Algorithm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedAlgorithm?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            color="error" 
            onClick={() => {
              if (selectedAlgorithm) {
                setAlgorithms(prev => prev.filter(a => a.id !== selectedAlgorithm.id));
              }
              setIsDeleteDialogOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderAdvancedOrders = () => (
    <Grid container spacing={3}>
      {/* Chart Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <TradingChart />
        </Paper>
      </Grid>

      {/* Order Form */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Order Configuration</Typography>
          
          {/* Quick Action Buttons */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => setOrderType({ ...orderType, side: 'buy', type: 'market' })}
            >
              Quick Buy
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setOrderType({ ...orderType, side: 'sell', type: 'market' })}
            >
              Quick Sell
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                // Reset form
                setOrderType({
                  type: 'market',
                  side: 'buy',
                  quantity: 0,
                  timeInForce: 'GTC',
                });
              }}
            >
              Reset
            </Button>
          </Box>

          {/* Order Type Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Order Type</InputLabel>
            <Select
              value={orderType.type}
              label="Order Type"
              onChange={(e) => setOrderType({ ...orderType, type: e.target.value as OrderType['type'] })}
            >
              <MenuItem value="market">Market</MenuItem>
              <MenuItem value="limit">Limit</MenuItem>
              <MenuItem value="stop">Stop</MenuItem>
              <MenuItem value="trailing_stop">Trailing Stop</MenuItem>
              <MenuItem value="iceberg">Iceberg</MenuItem>
              <MenuItem value="twap">TWAP</MenuItem>
              <MenuItem value="vwap">VWAP</MenuItem>
            </Select>
            <FormHelperText>
              {orderType.type === 'market' && 'Execute immediately at the best available price'}
              {orderType.type === 'limit' && 'Set your own price for the order'}
              {orderType.type === 'stop' && 'Trigger order when price reaches stop level'}
              {orderType.type === 'trailing_stop' && 'Stop price that follows market price'}
              {orderType.type === 'iceberg' && 'Large order split into smaller ones'}
              {orderType.type === 'twap' && 'Time-Weighted Average Price execution'}
              {orderType.type === 'vwap' && 'Volume-Weighted Average Price execution'}
            </FormHelperText>
          </FormControl>

          {/* Side Selection with visual feedback */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <FormLabel>Side</FormLabel>
              <ToggleButtonGroup
                value={orderType.side}
                exclusive
                fullWidth
                onChange={(e, value) => value && setOrderType({ ...orderType, side: value as 'buy' | 'sell' })}
                sx={{ mt: 1 }}
              >
                <ToggleButton 
                  value="buy"
                  sx={{ 
                    '&.Mui-selected': { 
                      backgroundColor: theme.palette.success.main,
                      color: 'white',
                      '&:hover': { backgroundColor: theme.palette.success.dark }
                    }
                  }}
                >
                  Buy
                </ToggleButton>
                <ToggleButton 
                  value="sell"
                  sx={{ 
                    '&.Mui-selected': { 
                      backgroundColor: theme.palette.error.main,
                      color: 'white',
                      '&:hover': { backgroundColor: theme.palette.error.dark }
                    }
                  }}
                >
                  Sell
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </Box>

          {/* Base Fields */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={orderType.quantity}
                onChange={(e) => setOrderType({ ...orderType, quantity: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Leverage</InputLabel>
                <Select
                  value={1}
                  label="Leverage"
                  onChange={(e) => console.log(e.target.value)}
                >
                  <MenuItem value={1}>1x</MenuItem>
                  <MenuItem value={2}>2x</MenuItem>
                  <MenuItem value={5}>5x</MenuItem>
                  <MenuItem value={10}>10x</MenuItem>
                  <MenuItem value={20}>20x</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Conditional Fields */}
          {(orderType.type === 'limit' || orderType.type === 'stop') && (
            <TextField
              fullWidth
              label={orderType.type === 'limit' ? 'Limit Price' : 'Stop Price'}
              type="number"
              sx={{ mb: 2 }}
              value={orderType.type === 'limit' ? orderType.price : orderType.stopPrice}
              onChange={(e) => setOrderType({
                ...orderType,
                [orderType.type === 'limit' ? 'price' : 'stopPrice']: Number(e.target.value)
              })}
              InputProps={{
                endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
              }}
            />
          )}

          {orderType.type === 'trailing_stop' && (
            <>
              <TextField
                fullWidth
                label="Trailing Amount"
                type="number"
                sx={{ mb: 2 }}
                value={orderType.trailingAmount}
                onChange={(e) => setOrderType({ ...orderType, trailingAmount: Number(e.target.value) })}
                InputProps={{
                  endAdornment: (
                    <FormControl variant="standard">
                      <Select
                        value={orderType.trailingUnit || 'amount'}
                        onChange={(e) => setOrderType({ ...orderType, trailingUnit: e.target.value as 'amount' | 'percent' })}
                      >
                        <MenuItem value="amount">USDT</MenuItem>
                        <MenuItem value="percent">%</MenuItem>
                      </Select>
                    </FormControl>
                  ),
                }}
              />
            </>
          )}

          {orderType.type === 'iceberg' && (
            <>
              <TextField
                fullWidth
                label="Visible Size"
                type="number"
                sx={{ mb: 2 }}
                value={orderType.visible_size}
                onChange={(e) => setOrderType({ ...orderType, visible_size: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Total Size"
                type="number"
                sx={{ mb: 2 }}
                value={orderType.total_size}
                onChange={(e) => setOrderType({ ...orderType, total_size: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
                }}
              />
            </>
          )}

          {(orderType.type === 'twap' || orderType.type === 'vwap') && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    value={orderType.duration}
                    onChange={(e) => setOrderType({ ...orderType, duration: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Target Time"
                    type="time"
                    value={orderType.targetTime}
                    onChange={(e) => setOrderType({ ...orderType, targetTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Max Slippage (%)"
                type="number"
                sx={{ mb: 2 }}
                value={orderType.maxSlippage}
                onChange={(e) => setOrderType({ ...orderType, maxSlippage: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </>
          )}

          {/* Advanced Options Accordion */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Time in Force</InputLabel>
                <Select
                  value={orderType.timeInForce}
                  label="Time in Force"
                  onChange={(e) => setOrderType({ ...orderType, timeInForce: e.target.value as 'GTC' | 'IOC' | 'FOK' })}
                >
                  <MenuItem value="GTC">Good Till Cancelled (GTC)</MenuItem>
                  <MenuItem value="IOC">Immediate or Cancel (IOC)</MenuItem>
                  <MenuItem value="FOK">Fill or Kill (FOK)</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Post Only"
              />
              <FormControlLabel
                control={<Switch />}
                label="Reduce Only"
              />
            </AccordionDetails>
          </Accordion>

          {/* Place Order Button */}
          <Button
            variant="contained"
            fullWidth
            color={orderType.side === 'buy' ? 'success' : 'error'}
            size="large"
            startIcon={<TrendingIcon />}
            onClick={() => {
              console.log('Placing order:', orderType);
              // Implement order placement logic
            }}
          >
            Place {orderType.side.toUpperCase()} Order
          </Button>
        </Paper>
      </Grid>

      {/* Order Preview and Risk Analysis */}
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          {/* Order Preview */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Order Preview</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Estimated Cost</Typography>
                  <Typography variant="h4">
                    ${(orderType.quantity * (orderType.price || 0)).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Available Balance</Typography>
                  <Typography variant="h4" color="success.main">$10,000.00</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Estimated Fee</Typography>
                  <Typography variant="h6" color="warning.main">
                    ${(orderType.quantity * (orderType.price || 0) * 0.001).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Price Impact</Typography>
                  <Typography variant="h6" color="info.main">0.05%</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Risk Analysis */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Risk Analysis</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Position Size</Typography>
                  <Typography variant="h6">
                    {((orderType.quantity * (orderType.price || 0) / 10000) * 100).toFixed(2)}% of Portfolio
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Potential Loss</Typography>
                  <Typography variant="h6" color="error.main">
                    ${(orderType.quantity * (orderType.price || 0) * 0.1).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={((orderType.quantity * (orderType.price || 0) / 10000) * 100)} 
                  color={((orderType.quantity * (orderType.price || 0) / 10000) * 100) > 20 ? "error" : "success"}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Recent Orders</Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Market Buy"
                    secondary="0.5 BTC @ $40,000"
                  />
                  <Typography variant="body2" color="success.main">Filled</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Limit Sell"
                    secondary="0.3 BTC @ $42,000"
                  />
                  <Typography variant="body2" color="warning.main">Pending</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Stop Loss"
                    secondary="0.2 BTC @ $38,000"
                  />
                  <Typography variant="body2" color="error.main">Triggered</Typography>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderRiskManagement = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Position Sizing Controls */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Position Sizing Controls
              </Typography>
              <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1 }}>Position Size Method</FormLabel>
                <ToggleButtonGroup
                  value={riskSettings.positionSizeType}
                  exclusive
                  onChange={(_, value) => value && handleRiskSettingChange('positionSizeType', value)}
                  aria-label="position size method"
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="fixed">Fixed Size</ToggleButton>
                  <ToggleButton value="dynamic">Dynamic Size</ToggleButton>
                  <ToggleButton value="risk-based">Risk-Based</ToggleButton>
                </ToggleButtonGroup>

                {riskSettings.positionSizeType === 'fixed' && (
                  <TextField
                    fullWidth
                    label="Fixed Position Size (BTC)"
                    type="number"
                    value={riskSettings.fixedSize}
                    onChange={(e) => handleRiskSettingChange('fixedSize', parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0.001, step: 0.001 },
                      endAdornment: <InputAdornment position="end">BTC</InputAdornment>
                    }}
                  />
                )}

                {riskSettings.positionSizeType === 'risk-based' && (
                  <TextField
                    fullWidth
                    label="Risk Per Trade"
                    type="number"
                    value={riskSettings.riskPerTrade}
                    onChange={(e) => handleRiskSettingChange('riskPerTrade', parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0.1, max: 5, step: 0.1 },
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                  />
                )}
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={riskSettings.dynamicPositionSizing}
                    onChange={(e) => handleRiskSettingChange('dynamicPositionSizing', e.target.checked)}
                  />
                }
                label="Enable Dynamic Position Sizing"
              />
            </Paper>
          </Grid>

          {/* Risk Limits */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Limits
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Maximum Drawdown Limit"
                    type="number"
                    value={riskSettings.maxDrawdown}
                    onChange={(e) => handleRiskSettingChange('maxDrawdown', parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 1, max: 50, step: 1 },
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Maximum Daily Loss Limit"
                    type="number"
                    value={riskSettings.maxDailyLoss}
                    onChange={(e) => handleRiskSettingChange('maxDailyLoss', parseFloat(e.target.value))}
                    InputProps={{
                      inputProps: { min: 1, max: 20, step: 0.5 },
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Maximum Open Positions"
                    type="number"
                    value={riskSettings.maxPositions}
                    onChange={(e) => handleRiskSettingChange('maxPositions', parseInt(e.target.value))}
                    InputProps={{
                      inputProps: { min: 1, max: 10, step: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Maximum Leverage"
                    type="number"
                    value={riskSettings.leverageLimit}
                    onChange={(e) => handleRiskSettingChange('leverageLimit', parseInt(e.target.value))}
                    InputProps={{
                      inputProps: { min: 1, max: 100, step: 1 },
                      endAdornment: <InputAdornment position="end">x</InputAdornment>
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Risk Management Features */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Management Features
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={riskSettings.stopLossRequired}
                      onChange={(e) => handleRiskSettingChange('stopLossRequired', e.target.checked)}
                    />
                  }
                  label="Require Stop Loss for All Trades"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={riskSettings.trailingStopLoss}
                      onChange={(e) => handleRiskSettingChange('trailingStopLoss', e.target.checked)}
                    />
                  }
                  label="Enable Trailing Stop Loss"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={riskSettings.hedgingEnabled}
                      onChange={(e) => handleRiskSettingChange('hedgingEnabled', e.target.checked)}
                    />
                  }
                  label="Enable Hedging"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Current Risk Metrics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Risk Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">
                    Current Drawdown
                  </Typography>
                  <Typography variant="h6" color="error">
                    -3.2%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">
                    Daily P&L
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    +1.8%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">
                    Open Positions
                  </Typography>
                  <Typography variant="h6">
                    2/5
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">
                    Average Leverage
                  </Typography>
                  <Typography variant="h6">
                    3.5x
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Risk Warning */}
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>Risk Management Notice</AlertTitle>
              Please ensure you understand the risks involved in trading. Your capital is at risk, and you should never trade more than you can afford to lose.
              The risk parameters set here will be applied to all your trading activities.
            </Alert>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderPerformanceAnalytics = () => {
    const equityChartData = {
      labels: samplePerformanceData.dates,
      datasets: [
        {
          label: 'Account Equity',
          data: samplePerformanceData.equity,
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const returnsChartData = {
      labels: samplePerformanceData.dates,
      datasets: [
        {
          label: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Returns`,
          data: samplePerformanceData.returns[timeframe],
          backgroundColor: (context: any) => {
            const value = context.raw;
            return value >= 0 ? theme.palette.success.main : theme.palette.error.main;
          },
        },
      ],
    };

    const strategyPieData = {
      labels: ['Momentum', 'Mean Reversion', 'Arbitrage', 'Market Making', 'Other'],
      datasets: [
        {
          data: [
            samplePerformanceData.strategyReturns.momentum,
            samplePerformanceData.strategyReturns.meanReversion,
            samplePerformanceData.strategyReturns.arbitrage,
            samplePerformanceData.strategyReturns.marketMaking,
            samplePerformanceData.strategyReturns.other,
          ],
          backgroundColor: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main,
          ],
        },
      ],
    };

    return (
      <Grid container spacing={3}>
        {/* Date Range Selector */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </LocalizationProvider>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly')}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Equity Curve */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Equity Curve</Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={equityChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Returns Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Returns Analysis</Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={returnsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Strategy Attribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Strategy Attribution</Typography>
            <Box sx={{ height: 300 }}>
              <Pie
                data={strategyPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Sharpe Ratio</Typography>
                <Typography variant="h4">{samplePerformanceData.metrics.sharpeRatio.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Sortino Ratio</Typography>
                <Typography variant="h4">{samplePerformanceData.metrics.sortino.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Max Drawdown</Typography>
                <Typography variant="h4" color="error">
                  {samplePerformanceData.metrics.maxDrawdown.toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Win Rate</Typography>
                <Typography variant="h4" color="success.main">
                  {samplePerformanceData.metrics.winRate.toFixed(1)}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Trade Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Trade Statistics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total Trades</Typography>
                <Typography variant="h4">{samplePerformanceData.trades.total}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Profit Factor</Typography>
                <Typography variant="h4">{samplePerformanceData.metrics.profitFactor.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Winning Trades</Typography>
                <Typography variant="h4" color="success.main">{samplePerformanceData.trades.wins}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Losing Trades</Typography>
                <Typography variant="h4" color="error.main">{samplePerformanceData.trades.losses}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Download Reports */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DateIcon />}
              onClick={() => {
                // Generate daily report
              }}
            >
              Daily Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<AnalysisIcon />}
              onClick={() => {
                // Generate detailed analysis
              }}
            >
              Detailed Analysis
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderSettings = () => (
    <Grid container spacing={3}>
      {/* General Settings */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>General Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Default Order Size"
                type="number"
                value={1000}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Default Leverage"
                type="number"
                value={1}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={'UTC'}
                  label="Timezone"
                  onChange={(e) => console.log(e.target.value)}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="EST">EST</MenuItem>
                  <MenuItem value="PST">PST</MenuItem>
                  <MenuItem value="Asia/Singapore">Asia/Singapore</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={'light'}
                  label="Theme"
                  onChange={(e) => console.log(e.target.value)}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Risk Management Settings */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Risk Management</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Position Size"
                type="number"
                value={10000}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Drawdown (%)"
                type="number"
                value={10}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Daily Loss Limit"
                type="number"
                value={1000}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Margin Call Level (%)"
                type="number"
                value={50}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Automation Settings */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Automation Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch defaultChecked={false} />
                }
                label="Enable Auto Trading"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Trading Start Time"
                type="time"
                value={'09:30'}
                onChange={(e) => console.log(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Trading End Time"
                type="time"
                value={'16:00'}
                onChange={(e) => console.log(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Daily Trades"
                type="number"
                value={50}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch defaultChecked={true} />
                }
                label="Auto Restart on Error"
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Notifications Settings */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch defaultChecked={true} />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch defaultChecked={true} />
                }
                label="Desktop Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch defaultChecked={false} />
                }
                label="Mobile Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch defaultChecked={false} />
                }
                label="Telegram Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>Notification Events</Typography>
              <FormControlLabel
                control={
                  <Switch defaultChecked={true} />
                }
                label="Order Filled"
              />
              <FormControlLabel
                control={
                  <Switch defaultChecked={true} />
                }
                label="Stop Loss Hit"
              />
              <FormControlLabel
                control={
                  <Switch defaultChecked={true} />
                }
                label="Margin Call"
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* API Connections */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>API Connections</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Exchange</InputLabel>
                <Select
                  value={'binance'}
                  label="Exchange"
                  onChange={(e) => console.log(e.target.value)}
                >
                  <MenuItem value="binance">Binance</MenuItem>
                  <MenuItem value="ftx">FTX</MenuItem>
                  <MenuItem value="kraken">Kraken</MenuItem>
                  <MenuItem value="coinbase">Coinbase Pro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch defaultChecked={true} />
                }
                label="Use Testnet"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API Key"
                type="password"
                value={''}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API Secret"
                type="password"
                value={''}
                onChange={(e) => console.log(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={() => {
                // Save API settings
              }}
            >
              Save Settings
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                // Test API connection
              }}
            >
              Test Connection
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Save All Settings */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              // Reset settings to default
            }}
          >
            Reset to Default
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => {
              // Save all settings
            }}
          >
            Save All Settings
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderRiskManagementNew = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Parameters
            </Typography>
            <FormLabel component="legend">Position Size Control</FormLabel>
            <ToggleButtonGroup
              value={selectedTimeframe}
              exclusive
              onChange={handleToggleChange}
              aria-label="position size control"
            >
              <ToggleButton value="fixed" aria-label="fixed">
                Fixed Size
              </ToggleButton>
              <ToggleButton value="dynamic" aria-label="dynamic">
                Dynamic Size
              </ToggleButton>
              <ToggleButton value="risk-based" aria-label="risk-based">
                Risk-Based
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Advanced Trading
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Professional-grade trading tools and algorithms for sophisticated trading strategies.
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<AlgorithmIcon />} label="Algorithms" />
          <Tab icon={<TrendingIcon />} label="Advanced Orders" />
          <Tab icon={<RiskIcon />} label="Risk Management" />
          <Tab icon={<AnalysisIcon />} label="Performance Analytics" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>
      </Paper>

      {selectedTab === 0 && renderAlgorithmList()}
      {selectedTab === 1 && renderAdvancedOrders()}
      {selectedTab === 2 && renderRiskManagement()}
      {selectedTab === 3 && renderPerformanceAnalytics()}
      {selectedTab === 4 && renderSettings()}
    </Container>
  );
};

export default AdvancedTradingPage;
