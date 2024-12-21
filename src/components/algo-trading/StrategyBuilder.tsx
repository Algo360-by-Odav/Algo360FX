import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import {
  StrategyType,
  IndicatorType,
  TradingStrategy,
  StrategyCondition,
  Indicator,
} from '../../types/algo-trading';
import { useAlgoTradingStore } from '../../stores/AlgoTradingStore';

const StrategyBuilder: React.FC = observer(() => {
  const algoTradingStore = useAlgoTradingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<Partial<TradingStrategy>>({
    name: '',
    type: StrategyType.TREND_FOLLOWING,
    description: '',
    symbols: [],
    timeframe: '1h',
    conditions: {
      entry: [],
      exit: [],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2,
      takeProfit: 4,
    },
    status: 'STOPPED',
  });

  const handleSymbolAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const symbol = (event.target as HTMLInputElement).value.toUpperCase();
      if (symbol && !strategy.symbols?.includes(symbol)) {
        setStrategy({
          ...strategy,
          symbols: [...(strategy.symbols || []), symbol],
        });
        (event.target as HTMLInputElement).value = '';
      }
    }
  };

  const handleSymbolRemove = (symbolToRemove: string) => {
    setStrategy({
      ...strategy,
      symbols: strategy.symbols?.filter((symbol) => symbol !== symbolToRemove),
    });
  };

  const handleConditionAdd = (type: 'entry' | 'exit') => {
    const newCondition: StrategyCondition = {
      indicator1: {
        type: IndicatorType.SMA,
        params: { period: 14 },
      },
      operator: 'CROSSES_ABOVE',
      indicator2: {
        type: IndicatorType.SMA,
        params: { period: 28 },
      },
    };

    setStrategy({
      ...strategy,
      conditions: {
        ...strategy.conditions,
        [type]: [...(strategy.conditions?.[type] || []), newCondition],
      },
    });
  };

  const handleConditionRemove = (type: 'entry' | 'exit', index: number) => {
    setStrategy({
      ...strategy,
      conditions: {
        ...strategy.conditions,
        [type]: strategy.conditions?.[type].filter((_, i) => i !== index),
      },
    });
  };

  const handleIndicatorChange = (
    type: 'entry' | 'exit',
    index: number,
    indicatorNumber: 1 | 2,
    indicator: Indicator
  ) => {
    const conditions = [...(strategy.conditions?.[type] || [])];
    conditions[index] = {
      ...conditions[index],
      [`indicator${indicatorNumber}`]: indicator,
    };

    setStrategy({
      ...strategy,
      conditions: {
        ...strategy.conditions,
        [type]: conditions,
      },
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await algoTradingStore.createStrategy(strategy as TradingStrategy);
      // Clear form or show success message
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1F2937' }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
          Strategy Builder
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Strategy Name"
                value={strategy.name}
                onChange={(e) =>
                  setStrategy({ ...strategy, name: e.target.value })
                }
                required
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Strategy Type
                </InputLabel>
                <Select
                  value={strategy.type}
                  onChange={(e) =>
                    setStrategy({
                      ...strategy,
                      type: e.target.value as StrategyType,
                    })
                  }
                  label="Strategy Type"
                  sx={{ color: 'white' }}
                >
                  {Object.values(StrategyType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Description"
                value={strategy.description}
                onChange={(e) =>
                  setStrategy({ ...strategy, description: e.target.value })
                }
                multiline
                rows={4}
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />
            </Grid>

            {/* Symbols and Timeframe */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Add Symbol"
                placeholder="Press Enter to add"
                onKeyPress={handleSymbolAdd}
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{ sx: { color: 'white' } }}
              />

              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {strategy.symbols?.map((symbol) => (
                  <Chip
                    key={symbol}
                    label={symbol}
                    onDelete={() => handleSymbolRemove(symbol)}
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: 'white',
                    }}
                  />
                ))}
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Timeframe
                </InputLabel>
                <Select
                  value={strategy.timeframe}
                  onChange={(e) =>
                    setStrategy({ ...strategy, timeframe: e.target.value })
                  }
                  label="Timeframe"
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="1m">1 Minute</MenuItem>
                  <MenuItem value="5m">5 Minutes</MenuItem>
                  <MenuItem value="15m">15 Minutes</MenuItem>
                  <MenuItem value="1h">1 Hour</MenuItem>
                  <MenuItem value="4h">4 Hours</MenuItem>
                  <MenuItem value="1d">1 Day</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Entry Conditions */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
                  Entry Conditions
                  <IconButton
                    size="small"
                    onClick={() => handleConditionAdd('entry')}
                    sx={{ ml: 1, color: '#4CAF50' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Typography>

                {strategy.conditions?.entry.map((condition, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={5}>
                        <FormControl fullWidth>
                          <InputLabel
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            Indicator 1
                          </InputLabel>
                          <Select
                            value={condition.indicator1.type}
                            onChange={(e) =>
                              handleIndicatorChange('entry', index, 1, {
                                ...condition.indicator1,
                                type: e.target.value as IndicatorType,
                              })
                            }
                            label="Indicator 1"
                            sx={{ color: 'white' }}
                          >
                            {Object.values(IndicatorType).map((type) => (
                              <MenuItem key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={2}>
                        <FormControl fullWidth>
                          <InputLabel
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            Operator
                          </InputLabel>
                          <Select
                            value={condition.operator}
                            onChange={(e) =>
                              handleIndicatorChange('entry', index, 1, {
                                ...condition.indicator1,
                                operator: e.target.value as any,
                              })
                            }
                            label="Operator"
                            sx={{ color: 'white' }}
                          >
                            <MenuItem value="CROSSES_ABOVE">
                              Crosses Above
                            </MenuItem>
                            <MenuItem value="CROSSES_BELOW">
                              Crosses Below
                            </MenuItem>
                            <MenuItem value="GREATER_THAN">
                              Greater Than
                            </MenuItem>
                            <MenuItem value="LESS_THAN">Less Than</MenuItem>
                            <MenuItem value="EQUALS">Equals</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4}>
                        {condition.indicator2 ? (
                          <FormControl fullWidth>
                            <InputLabel
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              Indicator 2
                            </InputLabel>
                            <Select
                              value={condition.indicator2.type}
                              onChange={(e) =>
                                handleIndicatorChange('entry', index, 2, {
                                  ...condition.indicator2,
                                  type: e.target.value as IndicatorType,
                                })
                              }
                              label="Indicator 2"
                              sx={{ color: 'white' }}
                            >
                              {Object.values(IndicatorType).map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type.replace(/_/g, ' ')}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField
                            fullWidth
                            label="Value"
                            type="number"
                            value={condition.value}
                            onChange={(e) =>
                              handleIndicatorChange('entry', index, 1, {
                                ...condition.indicator1,
                                value: parseFloat(e.target.value),
                              })
                            }
                            InputLabelProps={{
                              sx: { color: 'rgba(255, 255, 255, 0.7)' },
                            }}
                            InputProps={{ sx: { color: 'white' } }}
                          />
                        )}
                      </Grid>

                      <Grid item xs={1}>
                        <IconButton
                          onClick={() => handleConditionRemove('entry', index)}
                          sx={{ color: '#f44336' }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            </Grid>

            {/* Exit Conditions */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
                  Exit Conditions
                  <IconButton
                    size="small"
                    onClick={() => handleConditionAdd('exit')}
                    sx={{ ml: 1, color: '#4CAF50' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Typography>

                {/* Similar structure as Entry Conditions */}
                {/* ... */}
              </Box>
            </Grid>

            {/* Risk Management */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
                Risk Management
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Max Position Size"
                    type="number"
                    value={strategy.riskManagement?.maxPositionSize}
                    onChange={(e) =>
                      setStrategy({
                        ...strategy,
                        riskManagement: {
                          ...strategy.riskManagement,
                          maxPositionSize: parseFloat(e.target.value),
                        },
                      })
                    }
                    InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ sx: { color: 'white' } }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Stop Loss (%)"
                    type="number"
                    value={strategy.riskManagement?.stopLoss}
                    onChange={(e) =>
                      setStrategy({
                        ...strategy,
                        riskManagement: {
                          ...strategy.riskManagement,
                          stopLoss: parseFloat(e.target.value),
                        },
                      })
                    }
                    InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ sx: { color: 'white' } }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Take Profit (%)"
                    type="number"
                    value={strategy.riskManagement?.takeProfit}
                    onChange={(e) =>
                      setStrategy({
                        ...strategy,
                        riskManagement: {
                          ...strategy.riskManagement,
                          takeProfit: parseFloat(e.target.value),
                        },
                      })
                    }
                    InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ sx: { color: 'white' } }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  backgroundColor: '#2196f3',
                  '&:hover': {
                    backgroundColor: '#1976d2',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Create Strategy'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
});

export default StrategyBuilder;
