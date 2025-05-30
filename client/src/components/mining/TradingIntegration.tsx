import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Stack,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  SwapHoriz,
  Settings,
  TrendingUp,
  TrendingDown,
  AccessTime,
  CheckCircle,
  Schedule,
  Loop,
  CurrencyBitcoin,
  AttachMoney,
  Timeline,
  BarChart,
  AccountBalanceWallet,
  MoreVert,
  CompareArrows,
  Info,
  ArrowRightAlt
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import withMiningObserver from './withMiningObserver';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)'
  }
}));

const StrategyCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active: boolean }>(({ theme, active }) => ({
  cursor: 'pointer',
  border: active ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  }
}));

interface Props {
  store: any; // Using any for now, should be properly typed
}

const TradingIntegration: React.FC<Props> = ({ store }) => {
  const [autoTrading, setAutoTrading] = useState(store.tradingStats.autoTradingEnabled);
  const [tradingStrategy, setTradingStrategy] = useState(store.tradingStats.tradingStrategy);
  const [profitThreshold, setProfitThreshold] = useState(store.tradingStats.profitThreshold);
  const [tradingCurrency, setTradingCurrency] = useState('USDT');

  const handleAutoTradingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoTrading(event.target.checked);
  };

  const handleStrategyChange = (newStrategy: string) => {
    setTradingStrategy(newStrategy);
  };

  const handleThresholdChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setProfitThreshold(newValue);
    }
  };

  const handleCurrencyChange = (event: any) => {
    setTradingCurrency(event.target.value);
  };

  const strategies = [
    {
      id: 'smart',
      name: 'Smart AI',
      description: 'AI-driven trading based on market predictions and mining performance',
      icon: <Timeline />,
      recommended: true
    },
    {
      id: 'dca',
      name: 'DCA',
      description: 'Dollar Cost Averaging - regularly convert mining rewards at set intervals',
      icon: <Schedule />,
      recommended: false
    },
    {
      id: 'threshold',
      name: 'Threshold',
      description: 'Convert mining rewards only when reaching specific profit thresholds',
      icon: <TrendingUp />,
      recommended: false
    },
    {
      id: 'manual',
      name: 'Manual',
      description: 'Manually approve each conversion of mining rewards to trading',
      icon: <Settings />,
      recommended: false
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Mining-to-Trading Integration
        </Typography>
        <Button
          variant="contained"
          startIcon={<CompareArrows />}
          onClick={() => {
            // Save changes to store
          }}
        >
          Apply Settings
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Auto-Trading Settings */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader
              title="Auto-Trading Configuration"
              action={
                <Tooltip title="Automatically convert mining rewards to trading assets">
                  <IconButton>
                    <Info />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoTrading}
                      onChange={handleAutoTradingChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="subtitle1">
                      {autoTrading ? "Auto-Trading Enabled" : "Auto-Trading Disabled"}
                    </Typography>
                  }
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  When enabled, your mining rewards will be automatically converted based on your strategy settings.
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom>
                Preferred Trading Currency
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Trading Currency</InputLabel>
                <Select
                  value={tradingCurrency}
                  label="Trading Currency"
                  onChange={handleCurrencyChange}
                >
                  <MenuItem value="USDT">USDT (Tether)</MenuItem>
                  <MenuItem value="USDC">USDC (USD Coin)</MenuItem>
                  <MenuItem value="BTC">BTC (Bitcoin)</MenuItem>
                  <MenuItem value="ETH">ETH (Ethereum)</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle1" gutterBottom>
                Profit Threshold
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={profitThreshold}
                  onChange={handleThresholdChange}
                  aria-labelledby="profit-threshold-slider"
                  valueLabelDisplay="auto"
                  step={0.5}
                  marks
                  min={0.5}
                  max={10}
                  disabled={tradingStrategy !== 'threshold'}
                  valueLabelFormat={(value) => `${value}%`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">Conservative (0.5%)</Typography>
                  <Typography variant="body2" color="text.secondary">Aggressive (10%)</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Auto-Convert Schedule</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value="daily"
                    disabled={tradingStrategy !== 'dca'}
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Trading Strategy Selection */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader
              title="Trading Strategy"
              action={
                <Tooltip title="Select the strategy that best fits your mining and trading goals">
                  <IconButton>
                    <Info />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose how your mining rewards are converted into trading assets:
              </Typography>

              <Grid container spacing={2}>
                {strategies.map((strategy) => (
                  <Grid item xs={12} sm={6} key={strategy.id}>
                    <StrategyCard
                      active={tradingStrategy === strategy.id}
                      onClick={() => handleStrategyChange(strategy.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: tradingStrategy === strategy.id ? 'primary.main' : 'action.selected',
                              mr: 1.5
                            }}
                          >
                            {strategy.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {strategy.name}
                            </Typography>
                            {strategy.recommended && (
                              <Chip
                                label="Recommended"
                                color="success"
                                size="small"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {strategy.description}
                        </Typography>
                      </CardContent>
                    </StrategyCard>
                  </Grid>
                ))}
              </Grid>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  The <strong>Smart AI</strong> strategy analyzes market conditions and automatically adjusts your conversion timing for optimal profits.
                </Typography>
              </Alert>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Recent Trades */}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              title="Recent Auto-Trading Transactions"
              action={
                <Button size="small" endIcon={<ArrowRightAlt />}>
                  View All Transactions
                </Button>
              }
            />
            <Divider />
            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {store.tradingStats.recentTrades.map((trade: any) => (
                    <TableRow key={trade.id}>
                      <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          avatar={<Avatar><CurrencyBitcoin /></Avatar>}
                          label={trade.from}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          avatar={<Avatar><AttachMoney /></Avatar>}
                          label={trade.to}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{trade.amount}</TableCell>
                      <TableCell>${trade.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={trade.status === 'completed' ? <CheckCircle /> : <AccessTime />}
                          label={trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                          color={trade.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledCard>
        </Grid>

        {/* Mining to Trading Performance */}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              title="Mining-to-Trading Performance"
              action={
                <IconButton>
                  <BarChart />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Total Mining Revenue
                    </Typography>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      ${(store.tradingStats.profitLoss + 2500).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lifetime mining revenue
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Trading Profit/Loss
                    </Typography>
                    <Typography
                      variant="h3"
                      color={store.tradingStats.profitLoss >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      ${store.tradingStats.profitLoss.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From {store.tradingStats.totalTrades} trades
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      ROI
                    </Typography>
                    <Typography
                      variant="h3"
                      color={(store.tradingStats.profitLoss / (store.tradingStats.profitLoss + 2500) * 100) >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {((store.tradingStats.profitLoss / (store.tradingStats.profitLoss + 2500)) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall return on investment
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom>
                Performance by Coin
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Coin</TableCell>
                      <TableCell>Mined Amount</TableCell>
                      <TableCell>Trading Revenue</TableCell>
                      <TableCell>Mining Cost</TableCell>
                      <TableCell>Net Profit</TableCell>
                      <TableCell>ROI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Chip avatar={<Avatar>E</Avatar>} label="ETH" size="small" />
                      </TableCell>
                      <TableCell>2.5 ETH</TableCell>
                      <TableCell>$6,750.00</TableCell>
                      <TableCell>$1,250.00</TableCell>
                      <TableCell>$5,500.00</TableCell>
                      <TableCell>
                        <Chip label="+440%" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip avatar={<Avatar>B</Avatar>} label="BTC" size="small" />
                      </TableCell>
                      <TableCell>0.05 BTC</TableCell>
                      <TableCell>$2,800.00</TableCell>
                      <TableCell>$950.00</TableCell>
                      <TableCell>$1,850.00</TableCell>
                      <TableCell>
                        <Chip label="+195%" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip avatar={<Avatar>R</Avatar>} label="RVN" size="small" />
                      </TableCell>
                      <TableCell>8,500 RVN</TableCell>
                      <TableCell>$425.00</TableCell>
                      <TableCell>$310.00</TableCell>
                      <TableCell>$115.00</TableCell>
                      <TableCell>
                        <Chip label="+37%" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ textAlign: 'center' }}>
                <Button variant="outlined" startIcon={<AccountBalanceWallet />}>
                  View Complete Trading History
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withMiningObserver(TradingIntegration);
