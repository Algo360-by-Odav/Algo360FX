import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as TestIcon,
  Save as SaveIcon,
  Timeline as TimelineIcon,
  Code as CodeIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

interface Condition {
  id: string;
  type: string;
  indicator: string;
  operator: string;
  value: number;
}

interface Action {
  id: string;
  type: 'buy' | 'sell' | 'close';
  orderType: 'market' | 'limit' | 'stop';
  size: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  conditions: Condition[];
  actions: Action[];
  timeframe: string;
  symbols: string[];
}

const INDICATORS = [
  { value: 'MA', label: 'Moving Average' },
  { value: 'RSI', label: 'Relative Strength Index' },
  { value: 'MACD', label: 'MACD' },
  { value: 'BB', label: 'Bollinger Bands' },
];

const OPERATORS = [
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '=', label: 'Equals' },
  { value: 'crosses_above', label: 'Crosses Above' },
  { value: 'crosses_below', label: 'Crosses Below' },
];

const TIMEFRAMES = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
];

const StrategyBuilder: React.FC = () => {
  const { tradingStore } = useStores();
  const [strategy, setStrategy] = useState<Strategy>({
    id: '',
    name: '',
    description: '',
    conditions: [],
    actions: [],
    timeframe: '1h',
    symbols: ['EURUSD'],
  });
  const [openTest, setOpenTest] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      type: 'indicator',
      indicator: 'MA',
      operator: '>',
      value: 0,
    };
    setStrategy({
      ...strategy,
      conditions: [...strategy.conditions, newCondition],
    });
  };

  const handleRemoveCondition = (id: string) => {
    setStrategy({
      ...strategy,
      conditions: strategy.conditions.filter((c) => c.id !== id),
    });
  };

  const handleAddAction = () => {
    const newAction: Action = {
      id: Date.now().toString(),
      type: 'buy',
      orderType: 'market',
      size: 1,
    };
    setStrategy({
      ...strategy,
      actions: [...strategy.actions, newAction],
    });
  };

  const handleRemoveAction = (id: string) => {
    setStrategy({
      ...strategy,
      actions: strategy.actions.filter((a) => a.id !== id),
    });
  };

  const handleUpdateCondition = (id: string, field: keyof Condition, value: any) => {
    setStrategy({
      ...strategy,
      conditions: strategy.conditions.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const handleUpdateAction = (id: string, field: keyof Action, value: any) => {
    setStrategy({
      ...strategy,
      actions: strategy.actions.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    });
  };

  const handleSaveStrategy = () => {
    // Save strategy to store
    console.log('Saving strategy:', strategy);
  };

  const handleTestStrategy = () => {
    setOpenTest(true);
    // Simulate backtesting results
    setTestResults({
      totalTrades: 156,
      winRate: 62.5,
      profitLoss: 2450.75,
      sharpeRatio: 1.8,
      maxDrawdown: 8.2,
      period: '2023-01-01 to 2023-12-31',
    });
  };

  const renderConditionCard = (condition: Condition) => (
    <Card key={condition.id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Indicator</InputLabel>
              <Select
                value={condition.indicator}
                onChange={(e) => handleUpdateCondition(condition.id, 'indicator', e.target.value)}
                label="Indicator"
              >
                {INDICATORS.map((ind) => (
                  <MenuItem key={ind.value} value={ind.value}>
                    {ind.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                value={condition.operator}
                onChange={(e) => handleUpdateCondition(condition.id, 'operator', e.target.value)}
                label="Operator"
              >
                {OPERATORS.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Value"
              type="number"
              value={condition.value}
              onChange={(e) => handleUpdateCondition(condition.id, 'value', Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <IconButton
              color="error"
              onClick={() => handleRemoveCondition(condition.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderActionCard = (action: Action) => (
    <Card key={action.id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={action.type}
                onChange={(e) => handleUpdateAction(action.id, 'type', e.target.value)}
                label="Type"
              >
                <MenuItem value="buy">Buy</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
                <MenuItem value="close">Close</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Order Type</InputLabel>
              <Select
                value={action.orderType}
                onChange={(e) => handleUpdateAction(action.id, 'orderType', e.target.value)}
                label="Order Type"
              >
                <MenuItem value="market">Market</MenuItem>
                <MenuItem value="limit">Limit</MenuItem>
                <MenuItem value="stop">Stop</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Size"
              type="number"
              value={action.size}
              onChange={(e) => handleUpdateAction(action.id, 'size', Number(e.target.value))}
              InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <IconButton
              color="error"
              onClick={() => handleRemoveAction(action.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Strategy Builder</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<TestIcon />}
              onClick={handleTestStrategy}
              sx={{ mr: 1 }}
            >
              Test Strategy
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveStrategy}
            >
              Save Strategy
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Strategy Name"
              value={strategy.name}
              onChange={(e) => setStrategy({ ...strategy, name: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={strategy.timeframe}
                onChange={(e) => setStrategy({ ...strategy, timeframe: e.target.value })}
                label="Timeframe"
              >
                {TIMEFRAMES.map((tf) => (
                  <MenuItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={strategy.description}
              onChange={(e) => setStrategy({ ...strategy, description: e.target.value })}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Entry Conditions
          </Typography>
          {strategy.conditions.map(renderConditionCard)}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddCondition}
          >
            Add Condition
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          {strategy.actions.map(renderActionCard)}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddAction}
          >
            Add Action
          </Button>
        </Box>
      </Paper>

      <Dialog open={openTest} onClose={() => setOpenTest(false)} maxWidth="md" fullWidth>
        <DialogTitle>Backtesting Results</DialogTitle>
        <DialogContent>
          {testResults && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Test Period: {testResults.period}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Trades
                  </Typography>
                  <Typography variant="h6">
                    {testResults.totalTrades}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Win Rate
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {testResults.winRate}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Profit/Loss
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    ${testResults.profitLoss}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sharpe Ratio
                  </Typography>
                  <Typography variant="h6">
                    {testResults.sharpeRatio}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Max Drawdown
                  </Typography>
                  <Typography variant="h6">
                    {testResults.maxDrawdown}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTest(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Export Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StrategyBuilder;

