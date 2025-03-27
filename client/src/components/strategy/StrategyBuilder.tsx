import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Switch,
  Slider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  PlayArrow as TestIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ShowChart as ChartIcon,
  Timeline as SignalIcon,
  AttachMoney as TradeIcon,
  Settings as SettingsIcon,
  CloudUpload as ImportIcon,
  CloudDownload as ExportIcon,
  Refresh as BacktestIcon,
  Notifications as AlertIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { strategyStore } from '../../stores/strategyStore';

interface StrategyRule {
  id: string;
  type: 'indicator' | 'signal' | 'trade';
  name: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

interface Parameter {
  name: string;
  type: 'number' | 'select' | 'boolean';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

const StrategyBuilder: React.FC = observer(() => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRule, setSelectedRule] = useState<StrategyRule | null>(null);
  const [rules, setRules] = useState<StrategyRule[]>([]);
  const [strategyName, setStrategyName] = useState('');
  const [timeframe, setTimeframe] = useState('H1');
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    strategyStore.fetchStrategies();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddRule = (type: 'indicator' | 'signal' | 'trade') => {
    const newRule: StrategyRule = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: '',
      parameters: {},
      enabled: true,
    };
    setRules([...rules, newRule]);
    setSelectedRule(newRule);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    if (selectedRule?.id === id) {
      setSelectedRule(null);
    }
  };

  const handleSaveStrategy = async () => {
    if (!strategyName) {
      setAlertMessage({ type: 'error', message: 'Please enter a strategy name' });
      return;
    }

    try {
      await strategyStore.createStrategy({
        name: strategyName,
        description: `Timeframe: ${timeframe}`,
        parameters: {
          timeframe,
          rules: rules.map(rule => ({
            ...rule,
            parameters: rule.parameters || {},
          })),
        },
      });
      setAlertMessage({ type: 'success', message: 'Strategy saved successfully!' });
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Failed to save strategy' });
    }
  };

  const handleBacktest = async () => {
    if (!strategyName || rules.length === 0) {
      setAlertMessage({ type: 'error', message: 'Please configure your strategy before backtesting' });
      return;
    }
    setIsBacktesting(true);
    setAlertMessage({ type: 'info', message: 'Running backtest...' });
    // Simulate backtest
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsBacktesting(false);
    setAlertMessage({ type: 'success', message: 'Backtest completed successfully!' });
  };

  const handleExportStrategy = () => {
    const strategyData = {
      name: strategyName,
      timeframe,
      rules,
    };
    const blob = new Blob([JSON.stringify(strategyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${strategyName.toLowerCase().replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportStrategy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const strategy = JSON.parse(e.target?.result as string);
          setStrategyName(strategy.name);
          setTimeframe(strategy.timeframe);
          setRules(strategy.rules);
          setAlertMessage({ type: 'success', message: 'Strategy imported successfully!' });
        } catch (error) {
          setAlertMessage({ type: 'error', message: 'Invalid strategy file' });
        }
      };
      reader.readAsText(file);
    }
  };

  const indicators = [
    { name: 'Moving Average', icon: <ChartIcon />, category: 'Trend' },
    { name: 'Exponential MA', icon: <ChartIcon />, category: 'Trend' },
    { name: 'RSI', icon: <ChartIcon />, category: 'Momentum' },
    { name: 'MACD', icon: <ChartIcon />, category: 'Momentum' },
    { name: 'Bollinger Bands', icon: <ChartIcon />, category: 'Volatility' },
    { name: 'Stochastic', icon: <ChartIcon />, category: 'Momentum' },
    { name: 'ATR', icon: <ChartIcon />, category: 'Volatility' },
    { name: 'Ichimoku Cloud', icon: <ChartIcon />, category: 'Trend' },
    { name: 'Fibonacci', icon: <ChartIcon />, category: 'Trend' },
    { name: 'Volume Profile', icon: <ChartIcon />, category: 'Volume' },
    { name: 'ADX', icon: <ChartIcon />, category: 'Trend' },
    { name: 'CCI', icon: <ChartIcon />, category: 'Momentum' },
    { name: 'Williams %R', icon: <ChartIcon />, category: 'Momentum' },
    { name: 'Parabolic SAR', icon: <ChartIcon />, category: 'Trend' },
    { name: 'OBV', icon: <ChartIcon />, category: 'Volume' },
  ];

  const signals = [
    { name: 'Price Cross MA', icon: <SignalIcon />, category: 'Cross' },
    { name: 'MA Cross', icon: <SignalIcon />, category: 'Cross' },
    { name: 'RSI Overbought', icon: <SignalIcon />, category: 'Level' },
    { name: 'RSI Oversold', icon: <SignalIcon />, category: 'Level' },
    { name: 'MACD Cross', icon: <SignalIcon />, category: 'Cross' },
    { name: 'BB Breakout', icon: <SignalIcon />, category: 'Breakout' },
    { name: 'Volume Spike', icon: <SignalIcon />, category: 'Volume' },
    { name: 'Support/Resistance', icon: <SignalIcon />, category: 'Price' },
    { name: 'Trend Line Break', icon: <SignalIcon />, category: 'Breakout' },
    { name: 'Pattern Recognition', icon: <SignalIcon />, category: 'Pattern' },
  ];

  const trades = [
    { name: 'Market Order', icon: <TradeIcon />, category: 'Basic' },
    { name: 'Limit Order', icon: <TradeIcon />, category: 'Basic' },
    { name: 'Stop Order', icon: <TradeIcon />, category: 'Basic' },
    { name: 'Trail Stop', icon: <TradeIcon />, category: 'Advanced' },
    { name: 'OCO Order', icon: <TradeIcon />, category: 'Advanced' },
    { name: 'Bracket Order', icon: <TradeIcon />, category: 'Advanced' },
  ];

  const getParametersForRule = (ruleName: string): Parameter[] => {
    switch (ruleName) {
      case 'Moving Average':
        return [
          { name: 'Period', type: 'number', value: 14, min: 1, max: 200, step: 1 },
          { name: 'Type', type: 'select', value: 'SMA', options: ['SMA', 'EMA', 'WMA'] },
          { name: 'Price', type: 'select', value: 'Close', options: ['Close', 'Open', 'High', 'Low'] },
          { name: 'Shift', type: 'number', value: 0, min: 0, max: 10, step: 1 },
        ];
      case 'RSI':
        return [
          { name: 'Period', type: 'number', value: 14, min: 1, max: 100, step: 1 },
          { name: 'Overbought', type: 'number', value: 70, min: 50, max: 100, step: 1 },
          { name: 'Oversold', type: 'number', value: 30, min: 0, max: 50, step: 1 },
          { name: 'Price', type: 'select', value: 'Close', options: ['Close', 'Open', 'High', 'Low'] },
        ];
      case 'MACD':
        return [
          { name: 'Fast Period', type: 'number', value: 12, min: 1, max: 50, step: 1 },
          { name: 'Slow Period', type: 'number', value: 26, min: 1, max: 100, step: 1 },
          { name: 'Signal Period', type: 'number', value: 9, min: 1, max: 50, step: 1 },
          { name: 'Price', type: 'select', value: 'Close', options: ['Close', 'Open', 'High', 'Low'] },
        ];
      case 'Bollinger Bands':
        return [
          { name: 'Period', type: 'number', value: 20, min: 1, max: 100, step: 1 },
          { name: 'Deviations', type: 'number', value: 2, min: 0.5, max: 5, step: 0.1 },
          { name: 'Price', type: 'select', value: 'Close', options: ['Close', 'Open', 'High', 'Low'] },
        ];
      case 'Stochastic':
        return [
          { name: 'K Period', type: 'number', value: 14, min: 1, max: 50, step: 1 },
          { name: 'D Period', type: 'number', value: 3, min: 1, max: 20, step: 1 },
          { name: 'Slowing', type: 'number', value: 3, min: 1, max: 20, step: 1 },
          { name: 'Overbought', type: 'number', value: 80, min: 50, max: 100, step: 1 },
          { name: 'Oversold', type: 'number', value: 20, min: 0, max: 50, step: 1 },
        ];
      case 'ATR':
        return [
          { name: 'Period', type: 'number', value: 14, min: 1, max: 100, step: 1 },
        ];
      case 'Ichimoku Cloud':
        return [
          { name: 'Conversion Line', type: 'number', value: 9, min: 1, max: 50, step: 1 },
          { name: 'Base Line', type: 'number', value: 26, min: 1, max: 100, step: 1 },
          { name: 'Leading Span B', type: 'number', value: 52, min: 1, max: 200, step: 1 },
          { name: 'Lagging Span', type: 'number', value: 26, min: 1, max: 100, step: 1 },
        ];
      case 'ADX':
        return [
          { name: 'Period', type: 'number', value: 14, min: 1, max: 100, step: 1 },
          { name: 'Strong Trend', type: 'number', value: 25, min: 0, max: 100, step: 1 },
        ];
      case 'CCI':
        return [
          { name: 'Period', type: 'number', value: 20, min: 1, max: 100, step: 1 },
          { name: 'Constant', type: 'number', value: 0.015, min: 0.001, max: 0.1, step: 0.001 },
          { name: 'Overbought', type: 'number', value: 100, min: 0, max: 200, step: 1 },
          { name: 'Oversold', type: 'number', value: -100, min: -200, max: 0, step: 1 },
        ];
      case 'Price Cross MA':
        return [
          { name: 'MA Period', type: 'number', value: 20, min: 1, max: 200, step: 1 },
          { name: 'MA Type', type: 'select', value: 'SMA', options: ['SMA', 'EMA', 'WMA'] },
          { name: 'Cross Type', type: 'select', value: 'Above', options: ['Above', 'Below', 'Both'] },
        ];
      case 'MA Cross':
        return [
          { name: 'Fast MA Period', type: 'number', value: 10, min: 1, max: 100, step: 1 },
          { name: 'Slow MA Period', type: 'number', value: 20, min: 1, max: 200, step: 1 },
          { name: 'MA Type', type: 'select', value: 'SMA', options: ['SMA', 'EMA', 'WMA'] },
        ];
      case 'RSI Overbought':
        return [
          { name: 'RSI Period', type: 'number', value: 14, min: 1, max: 100, step: 1 },
          { name: 'Threshold', type: 'number', value: 70, min: 50, max: 100, step: 1 },
          { name: 'Confirmation Bars', type: 'number', value: 1, min: 1, max: 10, step: 1 },
        ];
      case 'RSI Oversold':
        return [
          { name: 'RSI Period', type: 'number', value: 14, min: 1, max: 100, step: 1 },
          { name: 'Threshold', type: 'number', value: 30, min: 0, max: 50, step: 1 },
          { name: 'Confirmation Bars', type: 'number', value: 1, min: 1, max: 10, step: 1 },
        ];
      case 'BB Breakout':
        return [
          { name: 'BB Period', type: 'number', value: 20, min: 1, max: 100, step: 1 },
          { name: 'Deviations', type: 'number', value: 2, min: 0.5, max: 5, step: 0.1 },
          { name: 'Breakout Type', type: 'select', value: 'Both', options: ['Upper', 'Lower', 'Both'] },
          { name: 'Confirmation Bars', type: 'number', value: 1, min: 1, max: 10, step: 1 },
        ];
      case 'Market Order':
        return [
          { name: 'Position Size', type: 'number', value: 1, min: 0.01, max: 100, step: 0.01 },
          { name: 'Stop Loss %', type: 'number', value: 2, min: 0.1, max: 10, step: 0.1 },
          { name: 'Take Profit %', type: 'number', value: 4, min: 0.1, max: 20, step: 0.1 },
        ];
      case 'Limit Order':
        return [
          { name: 'Position Size', type: 'number', value: 1, min: 0.01, max: 100, step: 0.01 },
          { name: 'Entry Distance %', type: 'number', value: 1, min: 0.1, max: 10, step: 0.1 },
          { name: 'Stop Loss %', type: 'number', value: 2, min: 0.1, max: 10, step: 0.1 },
          { name: 'Take Profit %', type: 'number', value: 4, min: 0.1, max: 20, step: 0.1 },
        ];
      case 'Trail Stop':
        return [
          { name: 'Position Size', type: 'number', value: 1, min: 0.01, max: 100, step: 0.01 },
          { name: 'Initial Stop %', type: 'number', value: 2, min: 0.1, max: 10, step: 0.1 },
          { name: 'Trail Distance %', type: 'number', value: 1, min: 0.1, max: 5, step: 0.1 },
          { name: 'Take Profit %', type: 'number', value: 4, min: 0.1, max: 20, step: 0.1 },
        ];
      default:
        return [];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {strategyStore.error && (
        <Alert 
          severity="error" 
          onClose={() => strategyStore.clearError()}
          sx={{ mb: 2 }}
        >
          {strategyStore.error}
        </Alert>
      )}
      
      {alertMessage && (
        <Alert 
          severity={alertMessage.type} 
          onClose={() => setAlertMessage(null)}
          sx={{ mb: 2 }}
        >
          {alertMessage.message}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Strategy Builder</Typography>
            <Box>
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                id="import-strategy"
                onChange={handleImportStrategy}
              />
              <label htmlFor="import-strategy">
                <Button
                  component="span"
                  startIcon={<ImportIcon />}
                  sx={{ mr: 1 }}
                >
                  Import
                </Button>
              </label>
              <Button
                startIcon={<ExportIcon />}
                onClick={handleExportStrategy}
                sx={{ mr: 1 }}
                disabled={!strategyName || rules.length === 0}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<BacktestIcon />}
                onClick={handleBacktest}
                disabled={isBacktesting || !strategyName || rules.length === 0}
                sx={{ mr: 1 }}
              >
                {isBacktesting ? <CircularProgress size={24} /> : 'Backtest'}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveStrategy}
                color="primary"
                disabled={strategyStore.isLoading || !strategyName || rules.length === 0}
              >
                {strategyStore.isLoading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Strategy Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Strategy Name"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    label="Timeframe"
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    {['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'].map((tf) => (
                      <MenuItem key={tf} value={tf}>{tf}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Builder Interface */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '600px' }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
              <Tab label={`Indicators (${indicators.length})`} />
              <Tab label={`Signals (${signals.length})`} />
              <Tab label={`Trades (${trades.length})`} />
            </Tabs>
            <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
              {activeTab === 0 && (
                <>
                  {Object.entries(
                    indicators.reduce((acc, ind) => ({
                      ...acc,
                      [ind.category]: [...(acc[ind.category] || []), ind],
                    }), {} as Record<string, typeof indicators>)
                  ).map(([category, items]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                        {category}
                      </Typography>
                      <List>
                        {items.map((indicator) => (
                          <ListItem
                            key={indicator.name}
                            button
                            onClick={() => handleAddRule('indicator')}
                          >
                            <ListItemIcon>{indicator.icon}</ListItemIcon>
                            <ListItemText primary={indicator.name} />
                            <ListItemSecondaryAction>
                              <Tooltip title="Add to strategy">
                                <IconButton edge="end" onClick={() => handleAddRule('indicator')}>
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </>
              )}
              {/* Similar updates for signals and trades tabs */}
            </Box>
          </Paper>
        </Grid>

        {/* Strategy Flow */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '600px', p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Strategy Flow
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {rules.map((rule, index) => (
                <ListItem
                  key={rule.id}
                  button
                  selected={selectedRule?.id === rule.id}
                  onClick={() => setSelectedRule(rule)}
                >
                  <ListItemIcon>
                    <DragIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {rule.name || `${rule.type} ${index + 1}`}
                        <Chip
                          size="small"
                          label={rule.type}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={`Step ${index + 1}`}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      size="small"
                      checked={rule.enabled !== false}
                      onChange={() => {
                        const updatedRule = { ...rule, enabled: !rule.enabled };
                        setRules(rules.map(r => r.id === rule.id ? updatedRule : r));
                      }}
                    />
                    <IconButton edge="end" onClick={() => handleDeleteRule(rule.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Rule Settings */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '600px', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Rule Settings</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {selectedRule ? (
              <Box>
                <TextField
                  fullWidth
                  label="Rule Name"
                  value={selectedRule.name}
                  onChange={(e) => {
                    const updatedRule = { ...selectedRule, name: e.target.value };
                    setSelectedRule(updatedRule);
                    setRules(rules.map(r => r.id === updatedRule.id ? updatedRule : r));
                  }}
                  sx={{ mb: 2 }}
                />
                {getParametersForRule(selectedRule.name).map((param, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    {param.type === 'number' && (
                      <Box>
                        <Typography gutterBottom>{param.name}</Typography>
                        <Slider
                          value={param.value}
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          valueLabelDisplay="auto"
                          onChange={(_e, value) => {
                            const updatedRule = {
                              ...selectedRule,
                              parameters: {
                                ...selectedRule.parameters,
                                [param.name]: value,
                              },
                            };
                            setSelectedRule(updatedRule);
                            setRules(rules.map(r => r.id === updatedRule.id ? updatedRule : r));
                          }}
                        />
                      </Box>
                    )}
                    {param.type === 'select' && (
                      <FormControl fullWidth>
                        <InputLabel>{param.name}</InputLabel>
                        <Select
                          value={param.value}
                          label={param.name}
                          onChange={(e) => {
                            const updatedRule = {
                              ...selectedRule,
                              parameters: {
                                ...selectedRule.parameters,
                                [param.name]: e.target.value,
                              },
                            };
                            setSelectedRule(updatedRule);
                            setRules(rules.map(r => r.id === updatedRule.id ? updatedRule : r));
                          }}
                        >
                          {param.options?.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary" align="center">
                Select a rule to configure its settings
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default StrategyBuilder;
