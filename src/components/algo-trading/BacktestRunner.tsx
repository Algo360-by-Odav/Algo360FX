import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/stores/RootStore';
import { Strategy, TimeFrame } from '@/types/trading';
import { formatDate } from '@/utils/formatters';

interface BacktestRunnerProps {
  onBacktestComplete?: () => void;
}

const BacktestRunner: React.FC<BacktestRunnerProps> = observer(({ onBacktestComplete }) => {
  const { algoTradingStore, marketStore } = useRootStore();
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>(TimeFrame.H1);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [initialBalance, setInitialBalance] = useState<number>(10000);
  const [commission, setCommission] = useState<number>(0.1);
  const [slippage, setSlippage] = useState<number>(0.05);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    algoTradingStore.loadStrategies();
  }, [algoTradingStore]);

  const handleStrategyChange = (event: SelectChangeEvent<string>) => {
    setSelectedStrategy(event.target.value);
  };

  const handleTimeframeChange = (event: SelectChangeEvent<TimeFrame>) => {
    setSelectedTimeframe(event.target.value as TimeFrame);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const handleInitialBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialBalance(Number(event.target.value));
  };

  const handleCommissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommission(Number(event.target.value));
  };

  const handleSlippageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlippage(Number(event.target.value));
  };

  const handleRunBacktest = async () => {
    if (!selectedStrategy || !startDate || !endDate) return;

    setIsRunning(true);
    try {
      const strategy = algoTradingStore.strategies.find(s => s.id === selectedStrategy);
      if (!strategy) return;

      await algoTradingStore.runBacktest({
        strategy,
        parameters: strategy.parameters,
        symbol: strategy.symbol,
        timeframe: selectedTimeframe,
        startDate,
        endDate,
        initialBalance,
        commission,
        slippage,
        useSpread: true,
      });

      if (onBacktestComplete) {
        onBacktestComplete();
      }
    } catch (error) {
      console.error('Backtest error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Backtest Configuration
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Strategy</InputLabel>
              <Select
                value={selectedStrategy}
                onChange={handleStrategyChange}
                label="Strategy"
              >
                {algoTradingStore.strategies.map((strategy: Strategy) => (
                  <MenuItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={selectedTimeframe}
                onChange={handleTimeframeChange}
                label="Timeframe"
              >
                {Object.values(TimeFrame).map((timeframe) => (
                  <MenuItem key={timeframe} value={timeframe}>
                    {timeframe}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              format="yyyy-MM-dd"
              sx={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              format="yyyy-MM-dd"
              sx={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Initial Balance"
              type="number"
              value={initialBalance}
              onChange={handleInitialBalanceChange}
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Commission (%)"
              type="number"
              value={commission}
              onChange={handleCommissionChange}
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Slippage (%)"
              type="number"
              value={slippage}
              onChange={handleSlippageChange}
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRunBacktest}
              disabled={isRunning || !selectedStrategy || !startDate || !endDate}
            >
              {isRunning ? 'Running Backtest...' : 'Run Backtest'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default BacktestRunner;
