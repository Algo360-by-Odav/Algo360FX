import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CompareArrows,
  Timeline,
  ShowChart,
  Assessment,
  Download,
  Share,
} from '@mui/icons-material';
import { TradingStrategy } from '../../../types/algo-trading';
import { BacktestResult } from '../../../types/backtest';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface StrategyComparisonProps {
  availableStrategies: TradingStrategy[];
  backtestResults: Record<string, BacktestResult>;
  onCompare: (strategies: string[]) => void;
}

const COLORS = ['#2196f3', '#4caf50', '#f44336', '#ff9800', '#9c27b0', '#00bcd4'];

const StrategyComparison: React.FC<StrategyComparisonProps> = ({
  availableStrategies,
  backtestResults,
  onCompare,
}) => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [timeframe, setTimeframe] = useState('1M');
  const [compareMetric, setCompareMetric] = useState('equity');

  const selectedResults = useMemo(
    () =>
      selectedStrategies.map((id) => ({
        strategy: availableStrategies.find((s) => s.id === id)!,
        result: backtestResults[id],
      })),
    [selectedStrategies, availableStrategies, backtestResults]
  );

  const handleAddStrategy = (strategyId: string) => {
    if (selectedStrategies.length < 5) {
      setSelectedStrategies([...selectedStrategies, strategyId]);
    }
    setShowAddDialog(false);
  };

  const handleRemoveStrategy = (strategyId: string) => {
    setSelectedStrategies(selectedStrategies.filter((id) => id !== strategyId));
  };

  const renderPerformanceComparison = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Performance Comparison
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="number"
              domain={['dataMin', 'dataMax']}
              scale="time"
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <RechartsTooltip />
            <Legend />
            {selectedResults.map(({ strategy, result }, index) => (
              <React.Fragment key={strategy.id}>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="equity"
                  data={result.equityCurve}
                  name={strategy.name}
                  fill={COLORS[index]}
                  stroke={COLORS[index]}
                  fillOpacity={0.1}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="drawdown"
                  data={result.equityCurve}
                  name={`${strategy.name} Drawdown`}
                  stroke={COLORS[index]}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </React.Fragment>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );

  const renderMetricsComparison = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Key Metrics Comparison
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Strategy</TableCell>
              <TableCell align="right">Net Profit</TableCell>
              <TableCell align="right">Win Rate</TableCell>
              <TableCell align="right">Profit Factor</TableCell>
              <TableCell align="right">Sharpe Ratio</TableCell>
              <TableCell align="right">Max Drawdown</TableCell>
              <TableCell align="right">Total Trades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedResults.map(({ strategy, result }, index) => (
              <TableRow key={strategy.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: COLORS[index],
                        mr: 1,
                      }}
                    />
                    {strategy.name}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(result.metrics.netProfit)}
                </TableCell>
                <TableCell align="right">
                  {formatPercentage(result.metrics.winRate)}
                </TableCell>
                <TableCell align="right">
                  {result.metrics.profitFactor.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {result.metrics.sharpeRatio.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {formatPercentage(result.metrics.maxDrawdown)}
                </TableCell>
                <TableCell align="right">{result.metrics.totalTrades}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderRiskComparison = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Risk Analysis
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer>
          <RadarChart>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} />
            {selectedResults.map(({ strategy, result }, index) => (
              <Radar
                key={strategy.id}
                name={strategy.name}
                dataKey="value"
                stroke={COLORS[index]}
                fill={COLORS[index]}
                fillOpacity={0.3}
                data={[
                  {
                    metric: 'Sharpe Ratio',
                    value: result.metrics.sharpeRatio / 3, // Normalize
                  },
                  {
                    metric: 'Win Rate',
                    value: result.metrics.winRate,
                  },
                  {
                    metric: 'Profit Factor',
                    value: result.metrics.profitFactor / 3, // Normalize
                  },
                  {
                    metric: 'Recovery Factor',
                    value: result.metrics.recoveryFactor / 2, // Normalize
                  },
                  {
                    metric: 'Risk/Reward',
                    value: result.metrics.payoffRatio / 3, // Normalize
                  },
                ]}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );

  const renderTradeAnalysis = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Trade Analysis
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Average Trade Duration
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                {selectedResults.map(({ strategy, result }, index) => (
                  <Bar
                    key={strategy.id}
                    dataKey="duration"
                    name={strategy.name}
                    fill={COLORS[index]}
                    data={[
                      {
                        name: strategy.name,
                        duration: result.metrics.averageTradeDuration,
                      },
                    ]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Win/Loss Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                {selectedResults.map(({ strategy, result }, index) => (
                  <Bar
                    key={strategy.id}
                    dataKey="ratio"
                    name={strategy.name}
                    fill={COLORS[index]}
                    data={[
                      {
                        name: 'Win/Loss Ratio',
                        ratio: result.metrics.winningTrades / result.metrics.losingTrades,
                      },
                    ]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Strategy Comparison</Typography>
        <Box>
          <IconButton>
            <Download />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Strategy Selection */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {selectedResults.map(({ strategy }, index) => (
            <Chip
              key={strategy.id}
              label={strategy.name}
              onDelete={() => handleRemoveStrategy(strategy.id)}
              sx={{ backgroundColor: COLORS[index] }}
            />
          ))}
          {selectedStrategies.length < 5 && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowAddDialog(true)}
              variant="outlined"
            >
              Add Strategy
            </Button>
          )}
        </Box>
      </Paper>

      {/* Comparison Content */}
      {selectedStrategies.length > 0 && (
        <>
          {renderPerformanceComparison()}
          {renderMetricsComparison()}
          {renderRiskComparison()}
          {renderTradeAnalysis()}
        </>
      )}

      {/* Add Strategy Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Strategy to Compare</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableStrategies.filter(
              (s) => !selectedStrategies.includes(s.id)
            )}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Select Strategy" fullWidth />
            )}
            onChange={(event, value) => value && handleAddStrategy(value.id)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StrategyComparison;
