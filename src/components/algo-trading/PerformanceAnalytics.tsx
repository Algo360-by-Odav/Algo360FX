import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TradingStrategy } from '../../types/algo-trading';
import { useAlgoTradingStore } from '../../stores/AlgoTradingStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import PerformanceMetrics from './performance/PerformanceMetrics';
import TradeDistribution from './performance/TradeDistribution';
import RiskMetrics from './performance/RiskMetrics';
import MonthlyReturns from './performance/MonthlyReturns';

const COLORS = ['#2196f3', '#4caf50', '#f44336', '#ff9800', '#9c27b0'];

const PerformanceAnalytics: React.FC = observer(() => {
  const algoTradingStore = useAlgoTradingStore();
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    endDate: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStrategy) {
      loadPerformanceData();
    }
  }, [selectedStrategy, dateRange]);

  const loadPerformanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      await algoTradingStore.loadStrategyPerformance(
        selectedStrategy,
        dateRange.startDate,
        dateRange.endDate
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStrategyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStrategy(event.target.value as string);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1F2937' }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
          Performance Analytics
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Controls */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(date) =>
                      setDateRange({ ...dateRange, startDate: date || new Date() })
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
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(date) =>
                      setDateRange({ ...dateRange, endDate: date || new Date() })
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
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </Grid>

        {selectedStrategy && algoTradingStore.performanceData && (
          <>
            {/* Key Performance Metrics */}
            <PerformanceMetrics
              metrics={algoTradingStore.performanceData.metrics}
            />

            {/* Equity Curve */}
            <Paper
              sx={{
                p: 2,
                mb: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
                Equity Curve
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={algoTradingStore.performanceData.equityCurve}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                      stroke="rgba(255, 255, 255, 0.7)"
                    />
                    <YAxis
                      stroke="rgba(255, 255, 255, 0.7)"
                      tickFormatter={(value) =>
                        formatCurrency(value, 'USD', 0)
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      labelStyle={{ color: 'white' }}
                      formatter={(value: number) => [
                        formatCurrency(value),
                        'Equity',
                      ]}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString()
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2196f3"
                      dot={false}
                      name="Equity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Trade Distribution */}
            <TradeDistribution
              distribution={algoTradingStore.performanceData.tradeDistribution}
            />

            {/* Risk Metrics */}
            <RiskMetrics
              metrics={algoTradingStore.performanceData.riskMetrics}
            />

            {/* Monthly Returns */}
            <MonthlyReturns
              returns={algoTradingStore.performanceData.monthlyReturns}
            />
          </>
        )}
      </Paper>
    </Box>
  );
});

export default PerformanceAnalytics;
