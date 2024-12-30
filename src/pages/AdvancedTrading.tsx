import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
} from '@mui/material';
import {
  AddCircleOutline,
  RemoveCircleOutline,
  Timeline,
  ShowChart,
  TrendingUp,
  TrendingDown,
  Settings,
  Refresh,
  Save,
  Delete,
  Notifications,
} from '@mui/icons-material';
import AdvancedChart from '@components/Trading/AdvancedChart';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trading-tabpanel-${index}`}
      aria-labelledby={`trading-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AdvancedTrading: React.FC = observer(() => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [timeframe, setTimeframe] = useState('1H');
  const [indicators, setIndicators] = useState<string[]>(['RSI', 'MACD']);
  const [orderType, setOrderType] = useState('LIMIT');
  const [volume, setVolume] = useState('1.0');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [showAlerts, setShowAlerts] = useState(true);

  const availableSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD'];
  const availableTimeframes = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W'];
  const availableIndicators = ['RSI', 'MACD', 'Bollinger Bands', 'Moving Average', 'Stochastic', 'ATR', 'Ichimoku'];
  const orderTypes = ['MARKET', 'LIMIT', 'STOP', 'STOP LIMIT'];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddIndicator = (indicator: string) => {
    if (!indicators.includes(indicator)) {
      setIndicators([...indicators, indicator]);
    }
  };

  const handleRemoveIndicator = (indicator: string) => {
    setIndicators(indicators.filter(i => i !== indicator));
  };

  const handlePlaceOrder = () => {
    // Implement order placement logic
    console.log('Placing order:', {
      symbol: selectedSymbol,
      type: orderType,
      volume,
      price,
      stopLoss,
      takeProfit,
    });
  };

  const mockPositions = [
    { id: 1, symbol: 'EURUSD', type: 'BUY', volume: 1.0, openPrice: 1.0950, currentPrice: 1.0955, profit: 50 },
    { id: 2, symbol: 'GBPUSD', type: 'SELL', volume: 0.5, openPrice: 1.2650, currentPrice: 1.2645, profit: 25 },
  ];

  const mockAlerts = [
    { id: 1, symbol: 'EURUSD', condition: 'Price above', value: 1.1000, active: true },
    { id: 2, symbol: 'GBPUSD', condition: 'RSI oversold', value: 30, active: true },
  ];

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">Advanced Trading</Typography>
            <Box>
              <FormControl variant="outlined" size="small" sx={{ mr: 1, minWidth: 120 }}>
                <InputLabel>Symbol</InputLabel>
                <Select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  label="Symbol"
                >
                  {availableSymbols.map((symbol) => (
                    <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  label="Timeframe"
                >
                  {availableTimeframes.map((tf) => (
                    <MenuItem key={tf} value={tf}>{tf}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Chart" />
              <Tab label="Order Form" />
              <Tab label="Positions" />
              <Tab label="Alerts" />
            </Tabs>

            {/* Chart Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box height={600}>
                <AdvancedChart
                  symbol={selectedSymbol}
                  interval={timeframe}
                  indicators={indicators}
                />
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>Active Indicators</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {indicators.map((indicator) => (
                    <Chip
                      key={indicator}
                      label={indicator}
                      onDelete={() => handleRemoveIndicator(indicator)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  <FormControl variant="outlined" size="small">
                    <Select
                      value=""
                      onChange={(e) => handleAddIndicator(e.target.value)}
                      displayEmpty
                      renderValue={() => 'Add Indicator'}
                    >
                      {availableIndicators
                        .filter(i => !indicators.includes(i))
                        .map((indicator) => (
                          <MenuItem key={indicator} value={indicator}>{indicator}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </TabPanel>

            {/* Order Form Tab */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Order Type</InputLabel>
                    <Select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      label="Order Type"
                    >
                      {orderTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Volume"
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    margin="normal"
                  />
                  {orderType !== 'MARKET' && (
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      margin="normal"
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stop Loss"
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Take Profit"
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    margin="normal"
                  />
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePlaceOrder}
                      fullWidth
                    >
                      Place Order
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Positions Tab */}
            <TabPanel value={activeTab} index={2}>
              <List>
                {mockPositions.map((position) => (
                  <ListItem key={position.id}>
                    <ListItemText
                      primary={`${position.symbol} ${position.type} ${position.volume}`}
                      secondary={`Open: ${position.openPrice} | Current: ${position.currentPrice}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={`P/L: $${position.profit}`}
                        color={position.profit >= 0 ? 'success' : 'error'}
                      />
                      <IconButton edge="end" aria-label="close" onClick={() => {}}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            {/* Alerts Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">Price Alerts</Typography>
                <Switch
                  checked={showAlerts}
                  onChange={(e) => setShowAlerts(e.target.checked)}
                  color="primary"
                />
              </Box>
              <List>
                {mockAlerts.map((alert) => (
                  <ListItem key={alert.id}>
                    <ListItemText
                      primary={`${alert.symbol} - ${alert.condition}`}
                      secondary={`Value: ${alert.value}`}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={alert.active}
                        onChange={() => {}}
                        color="primary"
                      />
                      <IconButton edge="end" aria-label="delete" onClick={() => {}}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          {/* Market Overview */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Market Overview</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="EURUSD" secondary="1.0955" />
                  <Chip size="small" label="+0.05%" color="success" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="GBPUSD" secondary="1.2645" />
                  <Chip size="small" label="-0.02%" color="error" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Save />}
                sx={{ mb: 1 }}
              >
                Save Template
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Settings />}
                sx={{ mb: 1 }}
              >
                Chart Settings
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Notifications />}
              >
                Set Alert
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default AdvancedTrading;

