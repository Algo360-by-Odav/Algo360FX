import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Compare as CompareIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { createChart, ColorType } from 'lightweight-charts';

interface StrategyMetrics {
  name: string;
  type: string;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  recoveryFactor: number;
  averageTrade: number;
  tradesPerMonth: number;
  costPerTrade: number;
  reliability: number;
  performance: { time: string; value: number }[];
}

const StrategyComparisonWidget: React.FC = observer(() => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('1M');
  const performanceChartRef = useRef<HTMLDivElement>(null);

  const strategies: { [key: string]: StrategyMetrics } = {
    'Trend Follower': {
      name: 'Trend Follower',
      type: 'Trend Following',
      winRate: 65.4,
      profitFactor: 1.8,
      sharpeRatio: 1.5,
      maxDrawdown: 12.3,
      recoveryFactor: 2.1,
      averageTrade: 25.5,
      tradesPerMonth: 45,
      costPerTrade: 2.5,
      reliability: 85,
      performance: [
        { time: '2024-01-01', value: 10000 },
        { time: '2024-01-15', value: 10500 },
        { time: '2024-01-30', value: 11200 },
        { time: '2024-02-15', value: 10800 },
        { time: '2024-03-01', value: 11500 },
      ],
    },
    'Mean Reversion': {
      name: 'Mean Reversion',
      type: 'Mean Reversion',
      winRate: 72.1,
      profitFactor: 2.1,
      sharpeRatio: 1.8,
      maxDrawdown: 15.4,
      recoveryFactor: 1.8,
      averageTrade: 18.2,
      tradesPerMonth: 85,
      costPerTrade: 1.8,
      reliability: 78,
      performance: [
        { time: '2024-01-01', value: 10000 },
        { time: '2024-01-15', value: 10300 },
        { time: '2024-01-30', value: 10900 },
        { time: '2024-02-15', value: 11400 },
        { time: '2024-03-01', value: 12000 },
      ],
    },
    'Breakout System': {
      name: 'Breakout System',
      type: 'Breakout',
      winRate: 58.2,
      profitFactor: 1.5,
      sharpeRatio: 1.2,
      maxDrawdown: 18.7,
      recoveryFactor: 1.5,
      averageTrade: 35.8,
      tradesPerMonth: 32,
      costPerTrade: 3.2,
      reliability: 72,
      performance: [
        { time: '2024-01-01', value: 10000 },
        { time: '2024-01-15', value: 9800 },
        { time: '2024-01-30', value: 10400 },
        { time: '2024-02-15', value: 11000 },
        { time: '2024-03-01', value: 10800 },
      ],
    },
  };

  useEffect(() => {
    if (performanceChartRef.current && selectedStrategies.length > 0) {
      const chart = createChart(performanceChartRef.current, {
        width: performanceChartRef.current.clientWidth,
        height: 400,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#999',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
      });

      const colors = ['#2962FF', '#FF6B6B', '#4CAF50', '#FFA726'];
      selectedStrategies.forEach((strategyName, index) => {
        const lineSeries = chart.addLineSeries({
          color: colors[index % colors.length],
          lineWidth: 2,
        });
        lineSeries.setData(strategies[strategyName].performance);
      });

      const handleResize = () => {
        if (performanceChartRef.current) {
          chart.applyOptions({
            width: performanceChartRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [selectedStrategies, timeframe]);

  const handleStrategySelect = (strategy: string) => {
    if (selectedStrategies.includes(strategy)) {
      setSelectedStrategies(selectedStrategies.filter(s => s !== strategy));
    } else if (selectedStrategies.length < 4) {
      setSelectedStrategies([...selectedStrategies, strategy]);
    }
  };

  const getMetricColor = (value: number, metric: string) => {
    switch (metric) {
      case 'winRate':
        return value > 60 ? 'success' : value > 50 ? 'warning' : 'error';
      case 'profitFactor':
        return value > 1.5 ? 'success' : value > 1.2 ? 'warning' : 'error';
      case 'sharpeRatio':
        return value > 1.5 ? 'success' : value > 1 ? 'warning' : 'error';
      case 'maxDrawdown':
        return value < 15 ? 'success' : value < 20 ? 'warning' : 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Strategy Comparison</Typography>
          <Box>
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="6M">6 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<CompareIcon />}
              onClick={() => setCompareDialogOpen(true)}
            >
              Compare Strategies
            </Button>
          </Box>
        </Box>

        {/* Performance Chart */}
        {selectedStrategies.length > 0 && (
          <Box mb={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Performance Comparison
              </Typography>
              <div ref={performanceChartRef} style={{ height: '400px' }} />
            </Paper>
          </Box>
        )}

        {/* Metrics Comparison Table */}
        {selectedStrategies.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  {selectedStrategies.map((strategy) => (
                    <TableCell key={strategy} align="right">{strategy}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { key: 'type', label: 'Strategy Type' },
                  { key: 'winRate', label: 'Win Rate (%)' },
                  { key: 'profitFactor', label: 'Profit Factor' },
                  { key: 'sharpeRatio', label: 'Sharpe Ratio' },
                  { key: 'maxDrawdown', label: 'Max Drawdown (%)' },
                  { key: 'recoveryFactor', label: 'Recovery Factor' },
                  { key: 'averageTrade', label: 'Average Trade ($)' },
                  { key: 'tradesPerMonth', label: 'Trades per Month' },
                  { key: 'costPerTrade', label: 'Cost per Trade ($)' },
                  { key: 'reliability', label: 'Reliability Score' },
                ].map((metric) => (
                  <TableRow key={metric.key}>
                    <TableCell>{metric.label}</TableCell>
                    {selectedStrategies.map((strategy) => (
                      <TableCell key={`${strategy}-${metric.key}`} align="right">
                        {metric.key === 'type' ? (
                          strategies[strategy][metric.key]
                        ) : (
                          <Chip
                            label={strategies[strategy][metric.key].toFixed(1)}
                            color={getMetricColor(strategies[strategy][metric.key], metric.key)}
                            size="small"
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Strategy Selection Dialog */}
        <Dialog
          open={compareDialogOpen}
          onClose={() => setCompareDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Select Strategies to Compare</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.keys(strategies).map((strategy) => (
                <Grid item xs={12} sm={6} md={4} key={strategy}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: selectedStrategies.includes(strategy) ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                    onClick={() => handleStrategySelect(strategy)}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {strategy}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {strategies[strategy].type}
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={`Win Rate: ${strategies[strategy].winRate}%`}
                        size="small"
                        color={getMetricColor(strategies[strategy].winRate, 'winRate')}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCompareDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default StrategyComparisonWidget;
