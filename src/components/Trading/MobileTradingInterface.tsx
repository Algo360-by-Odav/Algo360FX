import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Slider,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  SwapVert as SwapIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/stores/RootStoreContext';

interface MobileTradingInterfaceProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

const MobileTradingInterface: React.FC<MobileTradingInterfaceProps> = observer(({
  symbol,
  onSymbolChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tradingStore } = useRootStore();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [riskAmount, setRiskAmount] = useState<number>(10);
  const [lots, setLots] = useState<string>('0.01');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');

  const handleRiskChange = (event: Event, newValue: number | number[]) => {
    setRiskAmount(newValue as number);
    // Calculate lots based on risk amount
    const newLots = (newValue as number / 1000).toFixed(2);
    setLots(newLots);
  };

  const handleBuy = () => {
    tradingStore.placeTrade({
      symbol,
      type: 'BUY',
      lots: parseFloat(lots),
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      orderType,
    });
  };

  const handleSell = () => {
    tradingStore.placeTrade({
      symbol,
      type: 'SELL',
      lots: parseFloat(lots),
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      orderType,
    });
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Main Trading Interface */}
      <Paper 
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.drawer + 1,
          borderRadius: '16px 16px 0 0',
          pb: 2,
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Symbol and Type */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{symbol}</Typography>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Risk Amount Slider */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Risk Amount ($)
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <IconButton size="small" onClick={() => setRiskAmount(Math.max(0, riskAmount - 5))}>
                  <RemoveIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Slider
                  value={riskAmount}
                  onChange={handleRiskChange}
                  min={0}
                  max={100}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item>
                <IconButton size="small" onClick={() => setRiskAmount(Math.min(100, riskAmount + 5))}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Lots Size */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Size (Lots)
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={lots}
              onChange={(e) => setLots(e.target.value)}
              type="number"
              inputProps={{ step: 0.01, min: 0.01 }}
            />
          </Box>

          {/* Buy/Sell Buttons */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={handleBuy}
                sx={{ height: 56 }}
              >
                BUY
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="large"
                onClick={handleSell}
                sx={{ height: 56 }}
              >
                SELL
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Trading Settings Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        PaperProps={{
          sx: {
            borderRadius: '16px 16px 0 0',
            maxHeight: '80vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Trading Settings</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            {/* Stop Loss */}
            <ListItem>
              <ListItemText 
                primary="Stop Loss"
                secondary="Set your stop loss level"
              />
              <TextField
                size="small"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                type="number"
                sx={{ width: 120 }}
              />
            </ListItem>
            
            {/* Take Profit */}
            <ListItem>
              <ListItemText 
                primary="Take Profit"
                secondary="Set your take profit level"
              />
              <TextField
                size="small"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                type="number"
                sx={{ width: 120 }}
              />
            </ListItem>

            <Divider />

            {/* Order Type */}
            <ListItem>
              <ListItemText 
                primary="Order Type"
                secondary="Choose market or limit order"
              />
              <Button
                variant={orderType === 'market' ? 'contained' : 'outlined'}
                onClick={() => setOrderType('market')}
                size="small"
                sx={{ mr: 1 }}
              >
                Market
              </Button>
              <Button
                variant={orderType === 'limit' ? 'contained' : 'outlined'}
                onClick={() => setOrderType('limit')}
                size="small"
              >
                Limit
              </Button>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>

      {/* Quick Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 240,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Tooltip title="Chart Settings" placement="left">
          <Fab color="primary" size="small">
            <TimelineIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Trading Settings" placement="left">
          <Fab color="primary" size="small">
            <SettingsIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Market Analysis" placement="left">
          <Fab color="primary" size="small">
            <TrendingUpIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
});

export default MobileTradingInterface;
