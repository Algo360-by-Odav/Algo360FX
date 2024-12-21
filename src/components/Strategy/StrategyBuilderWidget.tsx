import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Add,
  Remove,
  PlayArrow,
  Save,
  Code,
  Settings,
  Timeline,
  ShowChart,
  TrendingUp,
  Warning,
  Info,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Condition {
  id: string;
  type: string;
  indicator: string;
  operator: string;
  value: string;
  timeframe: string;
}

interface Action {
  id: string;
  type: string;
  orderType: string;
  size: string;
  stopLoss?: string;
  takeProfit?: string;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  symbol: string;
  conditions: Condition[];
  actions: Action[];
  isActive: boolean;
}

const StrategyBuilderWidget: React.FC = observer(() => {
  const theme = useTheme();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [testDialog, setTestDialog] = useState(false);

  const indicators = [
    'Moving Average',
    'RSI',
    'MACD',
    'Bollinger Bands',
    'Stochastic',
    'Price Action',
  ];

  const operators = ['crosses above', 'crosses below', 'is above', 'is below', 'equals'];
  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W'];
  const orderTypes = ['Market', 'Limit', 'Stop'];

  const handleAddStrategy = () => {
    const newStrategy: Strategy = {
      id: Date.now().toString(),
      name: 'New Strategy',
      description: '',
      symbol: 'EUR/USD',
      conditions: [],
      actions: [],
      isActive: false,
    };
    setStrategies([...strategies, newStrategy]);
    setSelectedStrategy(newStrategy);
    setEditDialog(true);
  };

  const handleAddCondition = () => {
    if (!selectedStrategy) return;
    const newCondition: Condition = {
      id: Date.now().toString(),
      type: 'technical',
      indicator: indicators[0],
      operator: operators[0],
      value: '',
      timeframe: timeframes[0],
    };
    setSelectedStrategy({
      ...selectedStrategy,
      conditions: [...selectedStrategy.conditions, newCondition],
    });
  };

  const handleAddAction = () => {
    if (!selectedStrategy) return;
    const newAction: Action = {
      id: Date.now().toString(),
      type: 'order',
      orderType: orderTypes[0],
      size: '0.01',
      stopLoss: '',
      takeProfit: '',
    };
    setSelectedStrategy({
      ...selectedStrategy,
      actions: [...selectedStrategy.actions, newAction],
    });
  };

  const handleSaveStrategy = () => {
    if (!selectedStrategy) return;
    setStrategies(
      strategies.map((s) =>
        s.id === selectedStrategy.id ? selectedStrategy : s
      )
    );
    setEditDialog(false);
  };

  const handleToggleStrategy = (strategyId: string) => {
    setStrategies(
      strategies.map((s) =>
        s.id === strategyId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const handleTestStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setTestDialog(true);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Code />
          <Typography variant="h6">Strategy Builder</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddStrategy}
        >
          New Strategy
        </Button>
      </Box>

      <Box sx={{ p: 2 }}>
        <List>
          {strategies.map((strategy) => (
            <Paper
              key={strategy.id}
              elevation={1}
              sx={{ mb: 2, overflow: 'hidden' }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'background.default',
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{strategy.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {strategy.symbol}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    size="small"
                    checked={strategy.isActive}
                    onChange={() => handleToggleStrategy(strategy.id)}
                  />
                  <Tooltip title="Test Strategy">
                    <IconButton
                      size="small"
                      onClick={() => handleTestStrategy(strategy)}
                    >
                      <PlayArrow />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Strategy">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedStrategy(strategy);
                        setEditDialog(true);
                      }}
                    >
                      <Settings />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Conditions ({strategy.conditions.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {strategy.conditions.map((condition) => (
                    <Chip
                      key={condition.id}
                      label={`${condition.indicator} ${condition.operator} ${condition.value}`}
                      size="small"
                      onDelete={() => {
                        setSelectedStrategy({
                          ...strategy,
                          conditions: strategy.conditions.filter(
                            (c) => c.id !== condition.id
                          ),
                        });
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Actions ({strategy.actions.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {strategy.actions.map((action) => (
                    <Chip
                      key={action.id}
                      label={`${action.orderType} ${action.size} lots`}
                      size="small"
                      onDelete={() => {
                        setSelectedStrategy({
                          ...strategy,
                          actions: strategy.actions.filter(
                            (a) => a.id !== action.id
                          ),
                        });
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          ))}
        </List>
      </Box>

      {/* Edit Strategy Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedStrategy?.id ? 'Edit Strategy' : 'New Strategy'}
        </DialogTitle>
        <DialogContent>
          {selectedStrategy && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Strategy Name"
                    value={selectedStrategy.name}
                    onChange={(e) =>
                      setSelectedStrategy({
                        ...selectedStrategy,
                        name: e.target.value,
                      })
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={selectedStrategy.description}
                    onChange={(e) =>
                      setSelectedStrategy({
                        ...selectedStrategy,
                        description: e.target.value,
                      })
                    }
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Symbol</InputLabel>
                    <Select
                      value={selectedStrategy.symbol}
                      onChange={(e) =>
                        setSelectedStrategy({
                          ...selectedStrategy,
                          symbol: e.target.value,
                        })
                      }
                      label="Symbol"
                    >
                      <MenuItem value="EUR/USD">EUR/USD</MenuItem>
                      <MenuItem value="GBP/USD">GBP/USD</MenuItem>
                      <MenuItem value="USD/JPY">USD/JPY</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">Conditions</Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={handleAddCondition}
                      size="small"
                    >
                      Add Condition
                    </Button>
                  </Box>
                  {selectedStrategy.conditions.map((condition) => (
                    <Paper
                      key={condition.id}
                      sx={{ p: 2, mb: 2 }}
                      variant="outlined"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Indicator</InputLabel>
                            <Select
                              value={condition.indicator}
                              onChange={(e) =>
                                setSelectedStrategy({
                                  ...selectedStrategy,
                                  conditions: selectedStrategy.conditions.map(
                                    (c) =>
                                      c.id === condition.id
                                        ? {
                                            ...c,
                                            indicator: e.target.value,
                                          }
                                        : c
                                  ),
                                })
                              }
                              label="Indicator"
                            >
                              {indicators.map((indicator) => (
                                <MenuItem key={indicator} value={indicator}>
                                  {indicator}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Operator</InputLabel>
                            <Select
                              value={condition.operator}
                              onChange={(e) =>
                                setSelectedStrategy({
                                  ...selectedStrategy,
                                  conditions: selectedStrategy.conditions.map(
                                    (c) =>
                                      c.id === condition.id
                                        ? {
                                            ...c,
                                            operator: e.target.value,
                                          }
                                        : c
                                  ),
                                })
                              }
                              label="Operator"
                            >
                              {operators.map((operator) => (
                                <MenuItem key={operator} value={operator}>
                                  {operator}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Value"
                            value={condition.value}
                            onChange={(e) =>
                              setSelectedStrategy({
                                ...selectedStrategy,
                                conditions: selectedStrategy.conditions.map(
                                  (c) =>
                                    c.id === condition.id
                                      ? { ...c, value: e.target.value }
                                      : c
                                ),
                              })
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Timeframe</InputLabel>
                            <Select
                              value={condition.timeframe}
                              onChange={(e) =>
                                setSelectedStrategy({
                                  ...selectedStrategy,
                                  conditions: selectedStrategy.conditions.map(
                                    (c) =>
                                      c.id === condition.id
                                        ? {
                                            ...c,
                                            timeframe: e.target.value,
                                          }
                                        : c
                                  ),
                                })
                              }
                              label="Timeframe"
                            >
                              {timeframes.map((timeframe) => (
                                <MenuItem key={timeframe} value={timeframe}>
                                  {timeframe}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton
                            onClick={() =>
                              setSelectedStrategy({
                                ...selectedStrategy,
                                conditions:
                                  selectedStrategy.conditions.filter(
                                    (c) => c.id !== condition.id
                                  ),
                              })
                            }
                          >
                            <Remove />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">Actions</Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={handleAddAction}
                      size="small"
                    >
                      Add Action
                    </Button>
                  </Box>
                  {selectedStrategy.actions.map((action) => (
                    <Paper
                      key={action.id}
                      sx={{ p: 2, mb: 2 }}
                      variant="outlined"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Order Type</InputLabel>
                            <Select
                              value={action.orderType}
                              onChange={(e) =>
                                setSelectedStrategy({
                                  ...selectedStrategy,
                                  actions: selectedStrategy.actions.map(
                                    (a) =>
                                      a.id === action.id
                                        ? {
                                            ...a,
                                            orderType: e.target.value,
                                          }
                                        : a
                                  ),
                                })
                              }
                              label="Order Type"
                            >
                              {orderTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            label="Size (lots)"
                            value={action.size}
                            onChange={(e) =>
                              setSelectedStrategy({
                                ...selectedStrategy,
                                actions: selectedStrategy.actions.map(
                                  (a) =>
                                    a.id === action.id
                                      ? { ...a, size: e.target.value }
                                      : a
                                ),
                              })
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            label="Stop Loss"
                            value={action.stopLoss}
                            onChange={(e) =>
                              setSelectedStrategy({
                                ...selectedStrategy,
                                actions: selectedStrategy.actions.map(
                                  (a) =>
                                    a.id === action.id
                                      ? {
                                          ...a,
                                          stopLoss: e.target.value,
                                        }
                                      : a
                                ),
                              })
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            label="Take Profit"
                            value={action.takeProfit}
                            onChange={(e) =>
                              setSelectedStrategy({
                                ...selectedStrategy,
                                actions: selectedStrategy.actions.map(
                                  (a) =>
                                    a.id === action.id
                                      ? {
                                          ...a,
                                          takeProfit: e.target.value,
                                        }
                                      : a
                                ),
                              })
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton
                            onClick={() =>
                              setSelectedStrategy({
                                ...selectedStrategy,
                                actions: selectedStrategy.actions.filter(
                                  (a) => a.id !== action.id
                                ),
                              })
                            }
                          >
                            <Remove />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveStrategy} variant="contained">
            Save Strategy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Strategy Dialog */}
      <Dialog
        open={testDialog}
        onClose={() => setTestDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Test Strategy</DialogTitle>
        <DialogContent>
          {selectedStrategy && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedStrategy.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Running backtesting simulation for {selectedStrategy.symbol}...
              </Typography>
              {/* Add backtesting results here */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
});

export default StrategyBuilderWidget;
