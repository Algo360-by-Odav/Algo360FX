import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  CardHeader,
  Menu,
  MenuItem,
  ButtonGroup
} from '@mui/material';
import { 
  Memory, 
  Speed, 
  AttachMoney, 
  PowerSettingsNew, 
  Warning, 
  MoreVert, 
  Bolt, 
  TrendingUp, 
  TrendingDown, 
  EvStation,
  CurrencyBitcoin,
  AccountBalanceWallet,
  CompareArrows,
  Refresh,
  Visibility,
  BarChart,
  Timeline
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import withMiningObserver from './withMiningObserver';

// Styled components for enhanced visuals
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const GradientLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundImage: `linear-gradient(90deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[300]} 100%)`
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: '16px',
  fontWeight: 'bold',
  boxShadow: theme.shadows[2],
}));

const MiningDataCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[8],
  }
}));

interface Props {
  store: any; // Using any for now, should be properly typed with the actual store interface
}

const MiningDashboard: React.FC<Props> = ({ store }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCoin, setSelectedCoin] = useState('ALL');

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: string | null) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    handleMenuClose();
  };

  const coins = ['ALL', 'BTC', 'ETH', 'RVN', 'ERGO'];

  // Get most profitable coin prediction
  const mostProfitableCoin = store.mostProfitableCoin;

  // Calculate daily profit
  const dailyProfit = store.miningStats.dailyEarnings - store.miningStats.powerCost;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Mining Overview
        </Typography>
        <Box>
          <ButtonGroup variant="outlined" size="small" sx={{ mr: 2 }}>
            <Button onClick={() => store.fetchMiningStats()} startIcon={<Refresh />}>
              Refresh
            </Button>
            <Button startIcon={<Visibility />}>
              Live View
            </Button>
          </ButtonGroup>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
            size="small"
          >
            <ToggleButton value="24h" aria-label="24 hours">
              24H
            </ToggleButton>
            <ToggleButton value="7d" aria-label="7 days">
              7D
            </ToggleButton>
            <ToggleButton value="30d" aria-label="30 days">
              30D
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Key Performance Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Active Miners */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  <Memory />
                </Avatar>
                <Typography variant="h6">Active Miners</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                {store.miningStats.activeMiners}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {store.miningStats.activeMiners} of {store.miningEquipment.length} online
                </Typography>
                <StatusChip 
                  label={`${Math.round(store.miningStats.uptime)}% Uptime`} 
                  color="success" 
                  size="small" 
                  icon={<PowerSettingsNew />} 
                />
              </Box>
              <GradientLinearProgress 
                variant="determinate" 
                value={(store.miningStats.activeMiners / store.miningEquipment.length) * 100} 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Total Hashrate */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 1 }}>
                  <Speed />
                </Avatar>
                <Typography variant="h6">Total Hashrate</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                {store.miningStats.totalHashrate.toFixed(1)}
                <Typography component="span" variant="h6" sx={{ ml: 1 }}>MH/s</Typography>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedCoin === 'ALL' ? 'All coins' : `Mining ${selectedCoin}`}
                </Typography>
                <Button
                  size="small"
                  endIcon={<MoreVert />}
                  onClick={handleMenuClick}
                  aria-label="select coin"
                >
                  {selectedCoin}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {coins.map((coin) => (
                    <MenuItem 
                      key={coin} 
                      onClick={() => handleCoinSelect(coin)}
                      selected={coin === selectedCoin}
                    >
                      {coin}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <GradientLinearProgress 
                variant="determinate" 
                value={(store.miningStats.totalHashrate / 1000) * 100} 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Daily Earnings */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 1 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h6">Daily Earnings</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                ${store.miningStats.dailyEarnings.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Net profit: ${dailyProfit.toFixed(2)}/day
                </Typography>
                <Tooltip title="Estimated based on current hashrate and market conditions">
                  <IconButton size="small" color="primary">
                    <TrendingUp />
                  </IconButton>
                </Tooltip>
              </Box>
              <GradientLinearProgress 
                variant="determinate" 
                value={(store.miningStats.dailyEarnings / 50) * 100} 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Power Efficiency */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 1 }}>
                  <Bolt />
                </Avatar>
                <Typography variant="h6">Power Efficiency</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                {store.miningStats.efficiency.toFixed(3)}
                <Typography component="span" variant="h6" sx={{ ml: 1 }}>$/W</Typography>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {store.miningStats.powerConsumption.toFixed(0)} W total consumption
                </Typography>
                <Chip 
                  icon={<EvStation />} 
                  label={`$${store.miningStats.powerCost.toFixed(2)}/day`}
                  size="small" 
                  color="default" 
                />
              </Box>
              <GradientLinearProgress 
                variant="determinate" 
                value={(store.miningStats.efficiency / 0.05) * 100} 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Market & AI Insights */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Market & AI Insights
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Market Predictions */}
        <Grid item xs={12} md={6}>
          <MiningDataCard>
            <CardHeader
              title="Next 24h Profitability Forecast"
              action={
                <Tooltip title="AI-driven predictions based on market trends">
                  <IconButton>
                    <Timeline />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1 }}>
              <List>
                {store.marketPredictions.nextDayProfitability.map((prediction: any, index: number) => (
                  <ListItem key={index} divider={index < store.marketPredictions.nextDayProfitability.length - 1}>
                    <ListItemText
                      primaryTypographyProps={{
                        variant: "subtitle1",
                        fontWeight: "bold",
                        component: "div"
                      }}
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CurrencyBitcoin sx={{ mr: 1, color: 'primary.main' }} />
                          {prediction.coin}
                          <Box sx={{ flexGrow: 1 }} />
                          <Chip 
                            label={prediction.estimatedReturn} 
                            color={parseFloat(prediction.estimatedReturn) > 0 ? 'success' : 'error'}
                            size="small"
                            icon={parseFloat(prediction.estimatedReturn) > 0 ? <TrendingUp /> : <TrendingDown />}
                          />
                        </Box>
                      }
                      secondaryTypographyProps={{
                        variant: "body2",
                        component: "div"
                      }}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <div>
                            Prediction: <strong>{prediction.prediction.toUpperCase()}</strong> 
                            <Chip 
                              label={`${(prediction.confidence * 100).toFixed(0)}% confidence`} 
                              size="small" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          </div>
                          <LinearProgress 
                            variant="determinate" 
                            value={prediction.confidence * 100}
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                            color={prediction.prediction === 'high' ? 'success' : 
                                  prediction.prediction === 'low' ? 'error' : 'warning'}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderTop: 1, borderColor: 'divider' }}>
              <Box component="div" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                Most profitable coin: <Chip label={mostProfitableCoin?.coin || 'ERGO'} color="primary" size="small" />
              </Box>
            </Box>
          </MiningDataCard>
        </Grid>
        
        {/* Mining to Trading */}
        <Grid item xs={12} md={6}>
          <MiningDataCard>
            <CardHeader
              title="Mining-to-Trading Pipeline"
              action={
                <Tooltip title="Configure auto-conversion of mining rewards">
                  <IconButton>
                    <CompareArrows />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <CurrencyBitcoin />
                </Avatar>
                <Box>
                  <Box component="div" sx={{ typography: 'h6' }}>Today's Mining Rewards</Box>
                  <Box component="div" sx={{ typography: 'body2', color: 'text.secondary' }}>
                    Estimated value across all coins
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  ${store.miningStats.dailyEarnings.toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<CompareArrows />}
                  sx={{ borderRadius: 4, px: 3 }}
                >
                  Auto-Convert to Trading
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <AccountBalanceWallet />
                </Avatar>
                <Box>
                  <Box component="div" sx={{ typography: 'h6' }}>Available in Wallet</Box>
                  <Box component="div" sx={{ typography: 'body2', color: 'text.secondary' }}>
                    Ready for trading or withdrawal
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  ${(store.miningStats.dailyEarnings * 7).toFixed(2)}
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="outlined" fullWidth>
                  Transfer to Trading
                </Button>
                <Button variant="outlined" fullWidth>
                  Withdraw
                </Button>
              </Stack>
            </CardContent>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
              <Button size="small" startIcon={<BarChart />}>
                View Full Analytics
              </Button>
              <Button size="small" color="primary">
                Configure Auto-Trading
              </Button>
            </Box>
          </MiningDataCard>
        </Grid>
      </Grid>
      
      {/* Recent Activity */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Recent Mining Activity
      </Typography>
      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {store.miningEquipment.slice(0, 3).map((equipment: any, index: number) => (
            <ListItem 
              key={equipment.id} 
              divider={index < 2}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label={`${equipment.hashrate.toFixed(1)} MH/s`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`${equipment.powerUsage.toFixed(0)} W`} 
                    size="small" 
                    color="default" 
                    variant="outlined"
                    icon={<Bolt />}
                  />
                </Stack>
              }
            >
              <ListItemText
                primaryTypographyProps={{ 
                  variant: "subtitle1", 
                  fontWeight: "bold",
                  component: "div"
                }}
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {equipment.name}
                    {equipment.alerts.length > 0 && (
                      <Tooltip title={equipment.alerts[0].message}>
                        <Warning color="warning" sx={{ ml: 1 }} />
                      </Tooltip>
                    )}
                  </Box>
                }
                secondaryTypographyProps={{ 
                  variant: "body2", 
                  color: "text.secondary",
                  component: "div"
                }}
                secondary={
                  <>{equipment.type} Miner | {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)} | 
                    Temperature: {equipment.temperature}°C</>
                }
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Button color="primary">
            View All Equipment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default withMiningObserver(MiningDashboard);
