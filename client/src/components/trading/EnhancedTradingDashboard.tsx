import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Paper,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Button,
  useTheme,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AddAlert as AlertIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  ViewModule as ViewModuleIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import TradingWidget from './TradingWidget';
import PriceChart from './PriceChart';
import OrderBook from './OrderBook';
import TradeHistory from './TradeHistory';
import TradingIndicators from './TradingIndicators';
import PositionsTable from './PositionsTable';
import { marketService } from '../../services/marketService';
import {
  MarketPrice,
  Order,
  PriceChartProps,
  TradingWidgetProps,
  OrderBookProps,
  TradeHistoryProps,
  TradingIndicatorsProps,
  PositionsTableProps,
} from './types';

interface EnhancedTradingDashboardProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

const EnhancedTradingDashboard: React.FC<EnhancedTradingDashboardProps> = ({
  symbol,
  onSymbolChange,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<MarketPrice>({ ask: 0, bid: 0 });
  const [timeframe, setTimeframe] = useState('5m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'default' | 'advanced'>('default');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  // Handle symbol changes
  useEffect(() => {
    if (onSymbolChange) {
      onSymbolChange(symbol);
    }
  }, [symbol, onSymbolChange]);

  // Fetch initial chart data
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await marketService.getMarketData([symbol]);
        if (data && data[0]) {
          setCurrentPrice({
            ask: data[0].price + 0.00020,
            bid: data[0].price - 0.00020,
          });
        }
        const historicalData = await marketService.getHistoricalData(symbol, timeframe);
        setChartData(historicalData);
      } catch (err) {
        setError('Failed to load market data');
        console.error('Error loading market data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
    const interval = setInterval(loadChartData, 1000); // Real-time updates

    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  const handlePlaceOrder = async (order: Order) => {
    try {
      await marketService.placeOrder(order);
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
  };

  const handleAddIndicator = (indicator: string) => {
    setSelectedIndicators(prev => [...prev, indicator]);
  };

  const handleRemoveIndicator = (indicator: string) => {
    setSelectedIndicators(prev => prev.filter(i => i !== indicator));
  };

  const handleLayoutChange = () => {
    setLayoutMode(prev => prev === 'default' ? 'advanced' : 'default');
  };

  const renderTradingTools = () => (
    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
      <Tooltip title="Add Alert">
        <IconButton>
          <AlertIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Save Layout">
        <IconButton>
          <SaveIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Trading Settings">
        <IconButton>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Change Layout">
        <IconButton onClick={handleLayoutChange}>
          <ViewModuleIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="outlined"
        size="small"
        startIcon={<TimelineIcon />}
        onClick={() => setActiveTab(1)}
      >
        Indicators
      </Button>
    </Box>
  );

  const renderMarketInfo = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2" color="text.secondary">
            Daily Range
          </Typography>
          <Typography variant="body1">
            {currentPrice.bid.toFixed(5)} - {currentPrice.ask.toFixed(5)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2" color="text.secondary">
            24h Volume
          </Typography>
          <Typography variant="body1">
            $1.2B
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2" color="text.secondary">
            Spread
          </Typography>
          <Typography variant="body1">
            {((currentPrice.ask - currentPrice.bid) * 10000).toFixed(1)} pips
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2" color="text.secondary">
            Market Status
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.success.main }}>
            Open
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderTradingTools()}
          {renderMarketInfo()}
        </Grid>

        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : layoutMode === 'default' ? (
          <>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ height: '600px' }}>
                <PriceChart
                  symbol={symbol}
                  data={chartData}
                  onTimeframeChange={setTimeframe}
                  indicators={selectedIndicators}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TradingWidget
                    symbol={symbol}
                    currentPrice={currentPrice}
                    onPlaceOrder={handlePlaceOrder}
                  />
                </Grid>
                <Grid item xs={12}>
                  <OrderBook symbol={symbol} />
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={8}>
              <Paper sx={{ height: '800px' }}>
                <PriceChart
                  symbol={symbol}
                  data={chartData}
                  onTimeframeChange={setTimeframe}
                  indicators={selectedIndicators}
                  advanced
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TradingWidget
                    symbol={symbol}
                    currentPrice={currentPrice}
                    onPlaceOrder={handlePlaceOrder}
                    advanced
                  />
                </Grid>
                <Grid item xs={12}>
                  <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="Order Book" />
                    <Tab label="Indicators" />
                    <Tab label="Positions" />
                    <Tab label="History" />
                  </Tabs>
                  <TabPanel value={activeTab} index={0}>
                    <OrderBook symbol={symbol} advanced />
                  </TabPanel>
                  <TabPanel value={activeTab} index={1}>
                    <TradingIndicators
                      selected={selectedIndicators}
                      onAdd={handleAddIndicator}
                      onRemove={handleRemoveIndicator}
                    />
                  </TabPanel>
                  <TabPanel value={activeTab} index={2}>
                    <PositionsTable symbol={symbol} />
                  </TabPanel>
                  <TabPanel value={activeTab} index={3}>
                    <TradeHistory symbol={symbol} />
                  </TabPanel>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default EnhancedTradingDashboard;
