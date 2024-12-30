import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  IconButton,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Refresh,
  Timeline,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShowChart,
  Settings,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { styled } from '@mui/material/styles';

interface RiskMetrics {
  accountBalance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  leverage: number;
  totalExposure: number;
  drawdown: number;
  dailyPnL: number;
  openPositions: {
    symbol: string;
    type: 'LONG' | 'SHORT';
    size: number;
    entryPrice: number;
    currentPrice: number;
    pnl: number;
    risk: number;
  }[];
  exposureByPair: {
    pair: string;
    exposure: number;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'error' | 'success';
    message: string;
    timestamp: Date;
  }[];
  riskScore: number;
  historicalVaR: {
    date: string;
    value: number;
  }[];
}

const RiskMonitoringDashboard: React.FC = observer(() => {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchRiskMetrics();
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchRiskMetrics();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchRiskMetrics = async () => {
    setLoading(true);
    try {
      // Mock risk metrics data
      const mockMetrics: RiskMetrics = {
        accountBalance: 100000,
        equity: 98500,
        margin: 15000,
        freeMargin: 83500,
        marginLevel: 656.67,
        leverage: 30,
        totalExposure: 450000,
        drawdown: 8.5,
        dailyPnL: -350,
        openPositions: [
          {
            symbol: 'EURUSD',
            type: 'LONG',
            size: 1.5,
            entryPrice: 1.0850,
            currentPrice: 1.0840,
            pnl: -150,
            risk: 0.75,
          },
          {
            symbol: 'GBPUSD',
            type: 'SHORT',
            size: 0.8,
            entryPrice: 1.2650,
            currentPrice: 1.2680,
            pnl: -240,
            risk: 0.45,
          },
        ],
        exposureByPair: [
          { pair: 'EURUSD', exposure: 150000 },
          { pair: 'GBPUSD', exposure: 100000 },
          { pair: 'USDJPY', exposure: 200000 },
        ],
        alerts: [
          {
            id: '1',
            type: 'warning',
            message: 'High exposure on EURUSD',
            timestamp: new Date(),
          },
          {
            id: '2',
            type: 'error',
            message: 'Margin level approaching minimum requirement',
            timestamp: new Date(),
          },
        ],
        riskScore: 75,
        historicalVaR: Array(30).fill(0).map((_, i) => ({
          date: `2023-12-${i + 1}`,
          value: 2000 + Math.random() * 1000,
        })),
      };
      setMetrics(mockMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'error.main';
    if (risk >= 50) return 'warning.main';
    return 'success.main';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Risk Monitoring Dashboard</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label="Auto-refresh"
          />
          <Button
            startIcon={<Refresh />}
            onClick={fetchRiskMetrics}
            disabled={loading}
          >
            Refresh
          </Button>
          <IconButton>
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {loading && <LinearProgress />}

      <Grid container spacing={3}>
        {/* Account Overview */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Account Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary">Balance</Typography>
                <Typography variant="h6">{metrics ? formatCurrency(metrics.accountBalance) : '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Equity</Typography>
                <Typography variant="h6">{metrics ? formatCurrency(metrics.equity) : '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Margin</Typography>
                <Typography variant="h6">{metrics ? formatCurrency(metrics.margin) : '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Free Margin</Typography>
                <Typography variant="h6">{metrics ? formatCurrency(metrics.freeMargin) : '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Risk Score */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Risk Score</Typography>
            <Box display="flex" alignItems="center" justifyContent="center" p={2}>
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={metrics?.riskScore || 0}
                  size={120}
                  thickness={8}
                  sx={{ color: metrics ? getRiskColor(metrics.riskScore) : 'grey.300' }}
                />
                <Box
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                >
                  <Typography variant="h4" component="div">
                    {metrics?.riskScore || 0}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Open Positions */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Open Positions</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Entry Price</TableCell>
                    <TableCell>Current Price</TableCell>
                    <TableCell>P/L</TableCell>
                    <TableCell>Risk Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics?.openPositions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell>{position.symbol}</TableCell>
                      <TableCell>{position.type}</TableCell>
                      <TableCell>{position.size}</TableCell>
                      <TableCell>{position.entryPrice}</TableCell>
                      <TableCell>{position.currentPrice}</TableCell>
                      <TableCell sx={{ color: position.pnl >= 0 ? 'success.main' : 'error.main' }}>
                        {formatCurrency(position.pnl)}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LinearProgress
                            variant="determinate"
                            value={position.risk * 100}
                            sx={{
                              width: 100,
                              mr: 1,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getRiskColor(position.risk * 100),
                              },
                            }}
                          />
                          <Typography variant="body2">
                            {(position.risk * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Risk Alerts</Typography>
            {metrics?.alerts.map((alert) => (
              <Alert
                key={alert.id}
                severity={alert.type}
                sx={{ mb: 1 }}
              >
                <AlertTitle>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</AlertTitle>
                {alert.message}
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  {alert.timestamp.toLocaleString()}
                </Typography>
              </Alert>
            ))}
          </Paper>
        </Grid>

        {/* Historical VaR Chart */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Historical Value at Risk (VaR)</Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.historicalVaR || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default RiskMonitoringDashboard;
