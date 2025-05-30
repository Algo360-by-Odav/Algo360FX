import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button, Chip, CircularProgress, Grid, Card, CardContent, CardHeader, Divider } from '@mui/material';
import { useMockData } from '../../hooks/useMockData';
import { useTradingSocket } from '../../hooks/useTradingSocket';

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
      id={`backend-demo-tabpanel-${index}`}
      aria-labelledby={`backend-demo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BackendDemo: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);

  // Mock data hooks
  const { 
    data: marketData, 
    loading: marketDataLoading, 
    error: marketDataError,
    refetch: refetchMarketData
  } = useMockData('marketData');

  const { 
    data: tradingStrategies, 
    loading: strategiesLoading, 
    error: strategiesError 
  } = useMockData('tradingStrategies');

  const { 
    data: subscriptionPlans, 
    loading: plansLoading, 
    error: plansError 
  } = useMockData('subscriptionPlans');

  // WebSocket hook for real-time trading data
  const {
    isConnected,
    marketData: realtimeMarketData,
    subscribedSymbols,
    connect,
    disconnect,
    subscribeToSymbols,
    unsubscribeFromSymbols
  } = useTradingSocket({ autoConnect: false });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleConnectSocket = () => {
    connect();
  };

  const handleDisconnectSocket = () => {
    disconnect();
  };

  const handleSubscribe = (symbol: string) => {
    if (!subscribedSymbols.includes(symbol)) {
      subscribeToSymbols([symbol]);
      setSelectedSymbols(prev => [...prev, symbol]);
    }
  };

  const handleUnsubscribe = (symbol: string) => {
    unsubscribeFromSymbols([symbol]);
    setSelectedSymbols(prev => prev.filter(s => s !== symbol));
  };

  const renderMarketDataSection = () => {
    if (marketDataLoading) {
      return <CircularProgress />;
    }

    if (marketDataError) {
      return (
        <Box>
          <Typography color="error">Error loading market data: {marketDataError.message}</Typography>
          <Button variant="contained" onClick={refetchMarketData}>Retry</Button>
        </Box>
      );
    }

    if (!marketData) {
      return <Typography>No market data available</Typography>;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Forex" />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                {marketData.forex?.map((item: any) => (
                  <Grid item xs={12} key={item.pair}>
                    <Paper sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">{item.pair}</Typography>
                        <Typography variant="body2">
                          Bid: {item.bid} | Ask: {item.ask}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip 
                          label={`${item.change > 0 ? '+' : ''}${item.changePercent}%`} 
                          color={item.change > 0 ? 'success' : 'error'} 
                          size="small" 
                        />
                        <Button 
                          size="small" 
                          onClick={() => handleSubscribe(item.pair)}
                          disabled={subscribedSymbols.includes(item.pair) || !isConnected}
                          sx={{ ml: 1 }}
                        >
                          Subscribe
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Crypto" />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                {marketData.crypto?.map((item: any) => (
                  <Grid item xs={12} key={item.symbol}>
                    <Paper sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">{item.symbol}</Typography>
                        <Typography variant="body2">
                          Price: ${item.price.toLocaleString()} | Vol: {(item.volume / 1000000).toFixed(2)}M
                        </Typography>
                      </Box>
                      <Box>
                        <Chip 
                          label={`${item.change > 0 ? '+' : ''}${item.changePercent}%`} 
                          color={item.change > 0 ? 'success' : 'error'} 
                          size="small" 
                        />
                        <Button 
                          size="small" 
                          onClick={() => handleSubscribe(item.symbol)}
                          disabled={subscribedSymbols.includes(item.symbol) || !isConnected}
                          sx={{ ml: 1 }}
                        >
                          Subscribe
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTradingStrategiesSection = () => {
    if (strategiesLoading) {
      return <CircularProgress />;
    }

    if (strategiesError) {
      return <Typography color="error">Error loading strategies: {strategiesError.message}</Typography>;
    }

    if (!tradingStrategies) {
      return <Typography>No trading strategies available</Typography>;
    }

    return (
      <Grid container spacing={2}>
        {tradingStrategies.map((strategy: any) => (
          <Grid item xs={12} md={6} key={strategy.id}>
            <Card>
              <CardHeader 
                title={strategy.name} 
                subheader={strategy.description}
              />
              <Divider />
              <CardContent>
                <Typography variant="subtitle2">Performance Metrics:</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Win Rate: {strategy.performance.winRate}%</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Profit Factor: {strategy.performance.profitFactor}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Sharpe Ratio: {strategy.performance.sharpeRatio}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Max Drawdown: {strategy.performance.maxDrawdown}%</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Markets:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {strategy.markets.map((market: string) => (
                      <Chip key={market} label={market} size="small" />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Timeframes:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {strategy.timeframes.map((timeframe: string) => (
                      <Chip key={timeframe} label={timeframe} size="small" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderSubscriptionPlansSection = () => {
    if (plansLoading) {
      return <CircularProgress />;
    }

    if (plansError) {
      return <Typography color="error">Error loading subscription plans: {plansError.message}</Typography>;
    }

    if (!subscriptionPlans) {
      return <Typography>No subscription plans available</Typography>;
    }

    // Filter to show only monthly plans
    const monthlyPlans = subscriptionPlans.filter((plan: any) => plan.billingCycle === 'monthly');

    return (
      <Grid container spacing={2}>
        {monthlyPlans.map((plan: any) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card sx={{ position: 'relative', height: '100%' }}>
              {plan.recommended && (
                <Chip 
                  label="Recommended" 
                  color="primary" 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10 
                  }} 
                />
              )}
              <CardHeader 
                title={plan.name} 
                subheader={`$${plan.price}/month`}
              />
              <Divider />
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Features:</Typography>
                {plan.features.map((feature: string, index: number) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {feature}
                  </Typography>
                ))}
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderRealtimeDataSection = () => {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleConnectSocket}
            disabled={isConnected}
          >
            Connect
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleDisconnectSocket}
            disabled={!isConnected}
          >
            Disconnect
          </Button>
          <Chip 
            label={isConnected ? 'Connected' : 'Disconnected'} 
            color={isConnected ? 'success' : 'error'} 
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>Subscribed Symbols</Typography>
        
        {subscribedSymbols.length === 0 ? (
          <Typography>No symbols subscribed. Subscribe to symbols from the Market Data tab.</Typography>
        ) : (
          <Grid container spacing={2}>
            {subscribedSymbols.map(symbol => (
              <Grid item xs={12} md={6} key={symbol}>
                <Card>
                  <CardHeader 
                    title={symbol} 
                    action={
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleUnsubscribe(symbol)}
                      >
                        Unsubscribe
                      </Button>
                    }
                  />
                  <Divider />
                  <CardContent>
                    {realtimeMarketData[symbol] ? (
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">Bid: {realtimeMarketData[symbol].bid}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Ask: {realtimeMarketData[symbol].ask}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Price: {realtimeMarketData[symbol].price}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Change: {realtimeMarketData[symbol].change > 0 ? '+' : ''}
                            {realtimeMarketData[symbol].change} ({realtimeMarketData[symbol].changePercent}%)
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">Volume: {realtimeMarketData[symbol].volume.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption">
                            Last Update: {new Date(realtimeMarketData[symbol].timestamp).toLocaleTimeString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="backend demo tabs">
            <Tab label="Market Data" id="backend-demo-tab-0" />
            <Tab label="Trading Strategies" id="backend-demo-tab-1" />
            <Tab label="Subscription Plans" id="backend-demo-tab-2" />
            <Tab label="Real-time Data" id="backend-demo-tab-3" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {renderMarketDataSection()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderTradingStrategiesSection()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderSubscriptionPlansSection()}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderRealtimeDataSection()}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default BackendDemo;
