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

      {loading && !metrics ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : metrics ? (
        <Grid container spacing={3}>
          {/* Account Overview */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Account Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Account Balance
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(metrics.accountBalance)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Equity
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(metrics.equity)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Margin Level
                      </Typography>
                      <Typography variant="h6">
                        {metrics.marginLevel.toFixed(2)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Daily P&L
                      </Typography>
                      <Typography
                        variant="h6"
                        color={metrics.dailyPnL >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(metrics.dailyPnL)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Risk Score */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Risk Score
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={metrics.riskScore}
                    size={100}
                    thickness={8}
                    sx={{ color: getRiskColor(metrics.riskScore) }}
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
                    <Typography
                      variant="h4"
                      component="div"
                      color={getRiskColor(metrics.riskScore)}
                    >
                      {metrics.riskScore}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Risk Level
                  </Typography>
                  <Typography
                    variant="h6"
                    color={getRiskColor(metrics.riskScore)}
                  >
                    {metrics.riskScore >= 80
                      ? 'High Risk'
                      : metrics.riskScore >= 50
                      ? 'Medium Risk'
                      : 'Low Risk'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Open Positions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Open Positions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Entry Price</TableCell>
                      <TableCell>Current Price</TableCell>
                      <TableCell>P&L</TableCell>
                      <TableCell>Risk Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.openPositions.map((position) => (
                      <TableRow key={position.symbol}>
                        <TableCell>{position.symbol}</TableCell>
                        <TableCell>
                          {position.type === 'LONG' ? (
                            <TrendingUp color="success" />
                          ) : (
                            <TrendingDown color="error" />
                          )}
                          {position.type}
                        </TableCell>
                        <TableCell>{position.size}</TableCell>
                        <TableCell>{position.entryPrice}</TableCell>
                        <TableCell>{position.currentPrice}</TableCell>
                        <TableCell
                          sx={{
                            color:
                              position.pnl >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          {formatCurrency(position.pnl)}
                        </TableCell>
                        <TableCell>
                          <LinearProgress
                            variant="determinate"
                            value={position.risk * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'background.paper',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getRiskColor(position.risk * 100),
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Value at Risk Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Historical Value at Risk (VaR)
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.historicalVaR}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Risk Alerts */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Risk Alerts
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {metrics.alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    severity={alert.type}
                    icon={
                      alert.type === 'error' ? (
                        <Error />
                      ) : alert.type === 'warning' ? (
                        <Warning />
                      ) : (
                        <CheckCircle />
                      )
                    }
                  >
                    <AlertTitle>
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </AlertTitle>
                    {alert.message}
                    <Typography variant="caption" display="block">
                      {alert.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Alert>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography color="textSecondary" align="center">
          No risk metrics available
        </Typography>
      )}

      {lastUpdate && (
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Typography variant="caption" color="textSecondary">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
});

export default RiskMonitoringDashboard;
