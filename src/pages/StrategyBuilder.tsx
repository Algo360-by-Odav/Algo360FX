import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import TradingViewChart from '@components/Trading/TradingViewChart';
import { observer } from 'mobx-react-lite';
import { useTradingStore } from '@/hooks/useTradingStore';

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'testing';
  symbol: string;
  timeframe: string;
  conditions: string[];
  actions: string[];
  parameters: {
    [key: string]: number | string;
  };
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

const defaultStrategy: Strategy = {
  id: '',
  name: '',
  description: '',
  status: 'inactive',
  symbol: 'EURUSD',
  timeframe: '1H',
  conditions: [],
  actions: [],
  parameters: {
    stopLoss: 50,
    takeProfit: 100,
    riskPerTrade: 1,
  },
  performance: {
    winRate: 0,
    profitFactor: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
  },
};

const StrategyBuilder: React.FC = observer(() => {
  const tradingStore = useTradingStore();
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'MA Crossover',
      description: 'Simple moving average crossover strategy',
      status: 'active',
      symbol: 'EURUSD',
      timeframe: '1H',
      conditions: ['MA(20) crosses above MA(50)'],
      actions: ['Buy 0.1 lot market order'],
      parameters: {
        fastMA: 20,
        slowMA: 50,
        stopLoss: 50,
        takeProfit: 100,
        riskPerTrade: 1,
      },
      performance: {
        winRate: 65.2,
        profitFactor: 1.8,
        sharpeRatio: 1.2,
        maxDrawdown: 15.3,
      },
    },
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showNewStrategyDialog, setShowNewStrategyDialog] = useState(false);
  const [newStrategy, setNewStrategy] = useState<Strategy>({ ...defaultStrategy });

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsEditMode(false);
  };

  const handleStatusChange = (strategyId: string, newStatus: Strategy['status']) => {
    setStrategies(strategies.map(strategy =>
      strategy.id === strategyId
        ? { ...strategy, status: newStatus }
        : strategy
    ));
  };

  const handleSaveStrategy = () => {
    if (selectedStrategy) {
      setStrategies(strategies.map(strategy =>
        strategy.id === selectedStrategy.id
          ? selectedStrategy
          : strategy
      ));
      setIsEditMode(false);
    }
  };

  const handleCreateStrategy = () => {
    const newId = (Math.max(...strategies.map(s => parseInt(s.id))) + 1).toString();
    const strategyToAdd = { ...newStrategy, id: newId };
    setStrategies([...strategies, strategyToAdd]);
    setShowNewStrategyDialog(false);
    setNewStrategy({ ...defaultStrategy });
  };

  const handleDeleteStrategy = (strategyId: string) => {
    setStrategies(strategies.filter(s => s.id !== strategyId));
    if (selectedStrategy?.id === strategyId) {
      setSelectedStrategy(null);
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Strategy Builder</Typography>
      
      <Grid container spacing={3}>
        {/* Left Panel - Build Your Strategy */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Build Your Strategy</Typography>
            
            {/* Strategy Configuration */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Symbol</InputLabel>
                  <Select
                    value={selectedStrategy?.symbol || 'EURUSD'}
                    label="Symbol"
                  >
                    <MenuItem value="EURUSD">EUR/USD</MenuItem>
                    <MenuItem value="GBPUSD">GBP/USD</MenuItem>
                    <MenuItem value="USDJPY">USD/JPY</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={selectedStrategy?.timeframe || '1H'}
                    label="Timeframe"
                  >
                    <MenuItem value="1M">1 Minute</MenuItem>
                    <MenuItem value="5M">5 Minutes</MenuItem>
                    <MenuItem value="15M">15 Minutes</MenuItem>
                    <MenuItem value="1H">1 Hour</MenuItem>
                    <MenuItem value="4H">4 Hours</MenuItem>
                    <MenuItem value="1D">1 Day</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Chart */}
            <Box sx={{ mt: 3, height: '400px', bgcolor: '#1E1E1E', borderRadius: 1 }}>
              <TradingViewChart symbol={selectedStrategy?.symbol || 'EURUSD'} />
            </Box>

            {/* Strategy Rules */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Strategy Rules</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Entry Conditions"
                    placeholder="Example: When MA(20) crosses above MA(50)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Exit Conditions"
                    placeholder="Example: When price crosses below MA(20)"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
                Save Strategy
              </Button>
              <Button variant="contained" color="secondary" startIcon={<PlayArrowIcon />}>
                Backtest
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                Clear
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Performance Metrics</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Win Rate</Typography>
                <Typography variant="h4" color="success.main">65.2%</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Profit Factor</Typography>
                <Typography variant="h4">1.8</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Sharpe Ratio</Typography>
                <Typography variant="h4">1.2</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Max Drawdown</Typography>
                <Typography variant="h4" color="error.main">15.3%</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Strategy Parameters */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Strategy Parameters</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fast MA Period"
                  type="number"
                  defaultValue={20}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Slow MA Period"
                  type="number"
                  defaultValue={50}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stop Loss (pips)"
                  type="number"
                  defaultValue={50}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Take Profit (pips)"
                  type="number"
                  defaultValue={100}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default StrategyBuilder;
