import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Compare as CompareIcon,
  Delete as DeleteIcon,
  Tune as TuneIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart, BarChart } from '@mui/x-charts';
import { useStores } from '../../stores/StoreProvider';
import dayjs from 'dayjs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BacktestingPage: React.FC = observer(() => {
  const { backtestingStore } = useStores();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [optimizationParams, setOptimizationParams] = useState({
    parameterRanges: {
      stopLossValue: { min: 20, max: 100, step: 10 },
      takeProfitValue: { min: 40, max: 200, step: 20 },
      riskPerTrade: { min: 0.5, max: 2, step: 0.25 },
    },
    optimizationMetric: 'sharpeRatio',
  });
  const [params, setParams] = useState({
    strategyId: '',
    startDate: dayjs().subtract(1, 'year').toISOString(),
    endDate: dayjs().toISOString(),
    initialCapital: 100000,
    symbol: 'EUR/USD',
    timeframe: '1h',
    leverage: 1,
    riskPerTrade: 1,
    stopLossType: 'FIXED',
    stopLossValue: 50,
    takeProfitType: 'FIXED',
    takeProfitValue: 100,
    maxOpenPositions: 1,
    maxDailyTrades: 10,
    trailingStop: false,
    trailingStopDistance: 20,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await backtestingStore.runBacktest(params);
  };

  const handleCompareStrategies = async () => {
    if (selectedStrategies.length > 0) {
      await backtestingStore.compareStrategies(selectedStrategies, params);
    }
  };

  const handleOptimize = async () => {
    await backtestingStore.optimizeParameters(params, optimizationParams);
  };

  const handleParamChange = (field: string, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId)
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const mockStrategies = [
    { id: 'trend-following', name: 'Trend Following' },
    { id: 'mean-reversion', name: 'Mean Reversion' },
    { id: 'breakout', name: 'Breakout Strategy' },
    { id: 'momentum', name: 'Momentum Strategy' },
    { id: 'grid-trading', name: 'Grid Trading' },
  ];

  const renderStrategySelection = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Select Strategies to Compare</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {mockStrategies.map(strategy => (
            <Chip
              key={strategy.id}
              label={strategy.name}
              onClick={() => handleStrategySelect(strategy.id)}
              color={selectedStrategies.includes(strategy.id) ? 'primary' : 'default'}
              variant={selectedStrategies.includes(strategy.id) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          startIcon={<CompareIcon />}
          onClick={handleCompareStrategies}
          disabled={selectedStrategies.length === 0}
          sx={{ mt: 2 }}
        >
          Compare Selected Strategies
        </Button>
      </CardContent>
    </Card>
  );

  const renderOptimizationPanel = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Parameter Optimization</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Stop Loss Range"
              type="number"
              value={optimizationParams.parameterRanges.stopLossValue.min}
              onChange={(e) => setOptimizationParams(prev => ({
                ...prev,
                parameterRanges: {
                  ...prev.parameterRanges,
                  stopLossValue: {
                    ...prev.parameterRanges.stopLossValue,
                    min: Number(e.target.value)
                  }
                }
              }))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Take Profit Range"
              type="number"
              value={optimizationParams.parameterRanges.takeProfitValue.min}
              onChange={(e) => setOptimizationParams(prev => ({
                ...prev,
                parameterRanges: {
                  ...prev.parameterRanges,
                  takeProfitValue: {
                    ...prev.parameterRanges.takeProfitValue,
                    min: Number(e.target.value)
                  }
                }
              }))}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<TuneIcon />}
              onClick={handleOptimize}
              sx={{ mt: 2 }}
            >
              Start Optimization
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!backtestingStore.results) return null;

    const { metrics, equityCurve, trades } = backtestingStore.results;

    return (
      <>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Total Return</Typography>
                <Typography variant="h6">{metrics.totalReturn.toFixed(2)}%</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Sharpe Ratio</Typography>
                <Typography variant="h6">{metrics.sharpeRatio.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Max Drawdown</Typography>
                <Typography variant="h6" color="error">{metrics.maxDrawdown.toFixed(2)}%</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Win Rate</Typography>
                <Typography variant="h6">{metrics.winRate.toFixed(2)}%</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Equity Curve</Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <LineChart
                xAxis={[{ data: equityCurve.map(point => new Date(point.date)) }]}
                series={[
                  {
                    data: equityCurve.map(point => point.equity),
                    area: true,
                    label: 'Equity',
                  },
                  {
                    data: equityCurve.map(point => point.drawdown),
                    label: 'Drawdown',
                    color: 'error.main',
                  },
                ]}
              />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Trade Analysis</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">P&L</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trades.slice(0, 10).map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell>{dayjs(trade.date).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell>
                        <Chip
                          label={trade.type}
                          color={trade.type === 'BUY' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{trade.price.toFixed(5)}</TableCell>
                      <TableCell align="right">{trade.size}</TableCell>
                      <TableCell align="right" sx={{ 
                        color: trade.pnl >= 0 ? 'success.main' : 'error.main'
                      }}>
                        {trade.pnl.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Strategy Backtesting</Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<TimelineIcon />} label="Backtest" />
        <Tab icon={<CompareIcon />} label="Compare" />
        <Tab icon={<TuneIcon />} label="Optimize" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Backtest Parameters</Typography>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      select
                      label="Strategy"
                      value={params.strategyId}
                      onChange={(e) => handleParamChange('strategyId', e.target.value)}
                    >
                      {mockStrategies.map(strategy => (
                        <MenuItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <DatePicker
                      label="Start Date"
                      value={dayjs(params.startDate)}
                      onChange={(date) => handleParamChange('startDate', date?.toISOString())}
                    />

                    <DatePicker
                      label="End Date"
                      value={dayjs(params.endDate)}
                      onChange={(date) => handleParamChange('endDate', date?.toISOString())}
                    />

                    <TextField
                      label="Initial Capital"
                      type="number"
                      value={params.initialCapital}
                      onChange={(e) => handleParamChange('initialCapital', Number(e.target.value))}
                    />

                    <TextField
                      select
                      label="Symbol"
                      value={params.symbol}
                      onChange={(e) => handleParamChange('symbol', e.target.value)}
                    >
                      {['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'].map(symbol => (
                        <MenuItem key={symbol} value={symbol}>
                          {symbol}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Timeframe"
                      value={params.timeframe}
                      onChange={(e) => handleParamChange('timeframe', e.target.value)}
                    >
                      {['1m', '5m', '15m', '30m', '1h', '4h', 'D', 'W'].map(tf => (
                        <MenuItem key={tf} value={tf}>
                          {tf}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={backtestingStore.isLoading}
                      startIcon={backtestingStore.isLoading ? <CircularProgress size={20} /> : null}
                    >
                      Run Backtest
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {backtestingStore.error && (
              <Alert severity="error" sx={{ mb: 2 }}>{backtestingStore.error}</Alert>
            )}
            {renderResults()}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {renderStrategySelection()}
        {backtestingStore.compareResults.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Strategy Comparison</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Strategy</TableCell>
                      <TableCell align="right">Total Return</TableCell>
                      <TableCell align="right">Sharpe Ratio</TableCell>
                      <TableCell align="right">Max Drawdown</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {backtestingStore.compareResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{mockStrategies.find(s => s.id === selectedStrategies[index])?.name}</TableCell>
                        <TableCell align="right">{result.metrics.totalReturn.toFixed(2)}%</TableCell>
                        <TableCell align="right">{result.metrics.sharpeRatio.toFixed(2)}</TableCell>
                        <TableCell align="right">{result.metrics.maxDrawdown.toFixed(2)}%</TableCell>
                        <TableCell align="right">{result.metrics.winRate.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {renderOptimizationPanel()}
        {backtestingStore.optimizationResults.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Optimization Results</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Stop Loss</TableCell>
                      <TableCell>Take Profit</TableCell>
                      <TableCell>Risk per Trade</TableCell>
                      <TableCell align="right">Sharpe Ratio</TableCell>
                      <TableCell align="right">Total Return</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {backtestingStore.optimizationResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.parameters.stopLossValue}</TableCell>
                        <TableCell>{result.parameters.takeProfitValue}</TableCell>
                        <TableCell>{result.parameters.riskPerTrade}</TableCell>
                        <TableCell align="right">{result.metrics.sharpeRatio.toFixed(2)}</TableCell>
                        <TableCell align="right">{result.metrics.totalReturn.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </TabPanel>
    </Box>
  );
});

export default BacktestingPage;

