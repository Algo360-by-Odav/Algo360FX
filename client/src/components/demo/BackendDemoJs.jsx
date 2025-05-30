import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button, Chip, CircularProgress, Grid, Card, CardContent, CardHeader, Divider } from '@mui/material';
import { useMockData } from '../../hooks/useMockData';
import { useTradingSocket } from '../../hooks/useTradingSocket';

function TabPanel(props) {
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

const BackendDemoJs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedSymbols, setSelectedSymbols] = useState([]);

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

  // WebSocket hook
  const {
    isConnected: wsConnected,
    marketData: wsMarketData,
    connect: connectWs,
    disconnect: disconnectWs,
    subscribe: subscribeSymbol,
    unsubscribe: unsubscribeSymbol,
    subscribedSymbols
  } = useTradingSocket();

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  // Handle symbol selection
  const handleSymbolToggle = (symbol) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
      unsubscribeSymbol(symbol);
    } else {
      setSelectedSymbols([...selectedSymbols, symbol]);
      subscribeSymbol(symbol);
    }
  };

  // Connect to WebSocket on mount
  useEffect(() => {
    connectWs();
    return () => {
      disconnectWs();
    };
  }, [connectWs, disconnectWs]);

  // Render functions
  const renderConnectionStatus = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>WebSocket Connection</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip 
          label={wsConnected ? "Connected" : "Disconnected"} 
          color={wsConnected ? "success" : "error"} 
        />
        <Button 
          variant="contained" 
          color={wsConnected ? "error" : "primary"}
          onClick={wsConnected ? disconnectWs : connectWs}
        >
          {wsConnected ? "Disconnect" : "Connect"}
        </Button>
        <Typography variant="body2" color="text.secondary">
          WebSocket URL: ws://localhost:8081
        </Typography>
      </Box>
    </Box>
  );

  const renderMarketDataTab = () => (
    <TabPanel value={tabValue} index={0}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Market Data API</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={refetchMarketData}
            startIcon={marketDataLoading ? <CircularProgress size={20} /> : null}
            disabled={marketDataLoading}
          >
            Refresh Data
          </Button>
          <Typography variant="body2" color="text.secondary">
            Endpoint: http://localhost:8080/marketData
          </Typography>
        </Box>
        
        {marketDataError && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error: {marketDataError.message}
          </Typography>
        )}

        {marketDataLoading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {marketData && Object.entries(marketData).map(([category, assets]) => (
              <Grid item xs={12} md={6} key={category}>
                <Card>
                  <CardHeader 
                    title={category.charAt(0).toUpperCase() + category.slice(1)} 
                    subheader={`${assets.length} assets`}
                  />
                  <Divider />
                  <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <Grid container spacing={1}>
                      {assets.map((asset) => (
                        <Grid item xs={6} key={asset.symbol}>
                          <Card variant="outlined" sx={{ p: 1 }}>
                            <Typography variant="subtitle2">{asset.symbol}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Price: ${asset.price.toFixed(2)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={asset.change >= 0 ? "success.main" : "error.main"}
                            >
                              {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </TabPanel>
  );

  const renderWebSocketTab = () => (
    <TabPanel value={tabValue} index={1}>
      {renderConnectionStatus()}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Available Symbols</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BTC/USD', 'ETH/USD'].map((symbol) => (
            <Chip 
              key={symbol}
              label={symbol}
              onClick={() => handleSymbolToggle(symbol)}
              color={selectedSymbols.includes(symbol) ? "primary" : "default"}
              variant={selectedSymbols.includes(symbol) ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Real-time Market Data</Typography>
        {subscribedSymbols.length === 0 ? (
          <Typography color="text.secondary">
            Select symbols above to subscribe to real-time data
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {subscribedSymbols.map((symbol) => {
              const data = wsMarketData[symbol];
              return (
                <Grid item xs={12} sm={6} md={4} key={symbol}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{symbol}</Typography>
                      {data ? (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Price</Typography>
                            <Typography variant="body1">${data.price.toFixed(2)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Bid/Ask</Typography>
                            <Typography variant="body1">${data.bid.toFixed(2)} / ${data.ask.toFixed(2)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Change</Typography>
                            <Typography 
                              variant="body1" 
                              color={data.change >= 0 ? "success.main" : "error.main"}
                            >
                              {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Volume</Typography>
                            <Typography variant="body1">{data.volume.toLocaleString()}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Last update: {new Date(data.timestamp).toLocaleTimeString()}
                          </Typography>
                        </>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </TabPanel>
  );

  const renderTradingStrategiesTab = () => (
    <TabPanel value={tabValue} index={2}>
      <Typography variant="h6" gutterBottom>Trading Strategies API</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Endpoint: http://localhost:8080/tradingStrategies
        </Typography>
      </Box>
      
      {strategiesError && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {strategiesError.message}
        </Typography>
      )}

      {strategiesLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {tradingStrategies && tradingStrategies.map((strategy) => (
            <Grid item xs={12} md={6} key={strategy.id}>
              <Card>
                <CardHeader 
                  title={strategy.name} 
                  subheader={`${strategy.category} | ${strategy.timeframe}`}
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    {strategy.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Win Rate</Typography>
                    <Typography variant="body1">{strategy.performance.winRate}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Profit Factor</Typography>
                    <Typography variant="body1">{strategy.performance.profitFactor}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Max Drawdown</Typography>
                    <Typography variant="body1" color="error.main">
                      {strategy.performance.maxDrawdown}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </TabPanel>
  );

  const renderSubscriptionPlansTab = () => (
    <TabPanel value={tabValue} index={3}>
      <Typography variant="h6" gutterBottom>Subscription Plans API</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Endpoint: http://localhost:8080/subscriptionPlans
        </Typography>
      </Box>
      
      {plansError && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {plansError.message}
        </Typography>
      )}

      {plansLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {subscriptionPlans && subscriptionPlans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader 
                  title={plan.name} 
                  subheader={`$${plan.price}/${plan.billingCycle}`}
                />
                <Divider />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" paragraph>
                    {plan.description}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Features:
                  </Typography>
                  {plan.features.map((feature, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      • {feature}
                    </Typography>
                  ))}
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button variant="contained" fullWidth>
                    Select Plan
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </TabPanel>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Backend Demo
      </Typography>
      <Typography variant="body1" paragraph>
        This page demonstrates the connection to the local backend services: JSON Server (Mock API) and WebSocket Server.
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Market Data API" />
            <Tab label="WebSocket" />
            <Tab label="Trading Strategies" />
            <Tab label="Subscription Plans" />
          </Tabs>
        </Box>
        
        {renderMarketDataTab()}
        {renderWebSocketTab()}
        {renderTradingStrategiesTab()}
        {renderSubscriptionPlansTab()}
      </Paper>
    </Box>
  );
};

export default BackendDemoJs;
