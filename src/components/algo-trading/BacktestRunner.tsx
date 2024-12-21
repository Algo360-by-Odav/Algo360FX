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
  Chip,
  Alert,
  CircularProgress,
  Slider,
  Dialog,
  DialogContent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TradingStrategy, BacktestParams } from '../../types/algo-trading';
import { useAlgoTradingStore } from '../../stores/AlgoTradingStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import BacktestResults from './BacktestResults';
import BacktestReport from './backtesting/BacktestReport';

const BacktestRunner: React.FC = observer(() => {
  const algoTradingStore = useAlgoTradingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [params, setParams] = useState<BacktestParams>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    initialCapital: 100000,
    symbols: [],
    timeframe: '1h',
    commission: 0.1,
    slippage: 0.05,
  });
  const [showReport, setShowReport] = useState(false);

  const handleStrategyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStrategy(event.target.value as string);
    const strategy = algoTradingStore.getStrategy(event.target.value as string);
    if (strategy) {
      setParams({
        ...params,
        symbols: strategy.symbols,
        timeframe: strategy.timeframe,
      });
    }
  };

  const handleSymbolAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const symbol = (event.target as HTMLInputElement).value.toUpperCase();
      if (symbol && !params.symbols.includes(symbol)) {
        setParams({
          ...params,
          symbols: [...params.symbols, symbol],
        });
        (event.target as HTMLInputElement).value = '';
      }
    }
  };

  const handleSymbolRemove = (symbolToRemove: string) => {
    setParams({
      ...params,
      symbols: params.symbols.filter((symbol) => symbol !== symbolToRemove),
    });
  };

  const handleRunBacktest = async () => {
    if (!selectedStrategy) {
      setError('Please select a strategy');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await algoTradingStore.runBacktest(selectedStrategy, params);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    setShowReport(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1F2937' }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
          Backtest Runner
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Strategy Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Strategy
              </InputLabel>
              <Select
                value={selectedStrategy}
                onChange={handleStrategyChange}
                label="Strategy"
                sx={{ color: 'white' }}
              >
                {algoTradingStore.strategies.map((strategy) => (
                  <MenuItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date Range */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date"
                value={params.startDate}
                onChange={(date) =>
                  setParams({ ...params, startDate: date || new Date() })
                }
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End Date"
                value={params.endDate}
                onChange={(date) =>
                  setParams({ ...params, endDate: date || new Date() })
                }
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Initial Capital */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Initial Capital"
              type="number"
              value={params.initialCapital}
              onChange={(e) =>
                setParams({
                  ...params,
                  initialCapital: parseFloat(e.target.value),
                })
              }
              InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
              InputProps={{ sx: { color: 'white' } }}
            />
          </Grid>

          {/* Commission */}
          <Grid item xs={12} md={4}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Commission (%)
              </Typography>
              <Slider
                value={params.commission}
                onChange={(_, value) =>
                  setParams({ ...params, commission: value as number })
                }
                min={0}
                max={1}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{
                  color: '#2196f3',
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#2196f3',
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Slippage */}
          <Grid item xs={12} md={4}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Slippage (%)
              </Typography>
              <Slider
                value={params.slippage}
                onChange={(_, value) =>
                  setParams({ ...params, slippage: value as number })
                }
                min={0}
                max={0.5}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{
                  color: '#2196f3',
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#2196f3',
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Symbols */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Symbol"
              placeholder="Press Enter to add"
              onKeyPress={handleSymbolAdd}
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
              InputProps={{ sx: { color: 'white' } }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {params.symbols.map((symbol) => (
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
          </Grid>

          {/* Run Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleRunBacktest}
              disabled={loading}
              sx={{
                mt: 2,
                backgroundColor: '#2196f3',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Run Backtest'}
            </Button>
          </Grid>
        </Grid>

        {/* Results */}
        {algoTradingStore.backtestResults && (
          <BacktestResults results={algoTradingStore.backtestResults} />
        )}
      </Paper>
      {showReport && algoTradingStore.backtestResults && (
        <Dialog
          open={showReport}
          onClose={() => setShowReport(false)}
          maxWidth="xl"
          fullWidth
        >
          <DialogContent>
            <BacktestReport
              strategy={selectedStrategy!}
              result={algoTradingStore.backtestResults}
              onShare={() => {}}
              onDownload={() => {}}
              onPrint={() => {}}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
});

export default BacktestRunner;
