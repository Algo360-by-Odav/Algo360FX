import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled components
const DemoSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3]
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600
}));

const DataCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10]
  }
}));

const BackendDemo: React.FC = () => {
  // State for API data
  const [users, setUsers] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any>({});
  const [tradingStrategies, setTradingStrategies] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  
  // State for WebSocket data
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  // State for loading indicators
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the mock API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersResponse = await fetch('http://localhost:8080/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Fetch market data
        const marketDataResponse = await fetch('http://localhost:8080/marketData');
        const marketDataData = await marketDataResponse.json();
        setMarketData(marketDataData);
        
        // Fetch trading strategies
        const strategiesResponse = await fetch('http://localhost:8080/tradingStrategies');
        const strategiesData = await strategiesResponse.json();
        setTradingStrategies(strategiesData);
        
        // Fetch subscription plans
        const plansResponse = await fetch('http://localhost:8080/subscriptionPlans');
        const plansData = await plansResponse.json();
        setSubscriptionPlans(plansData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from the mock API. Make sure the server is running.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Connect to WebSocket server
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
      
      // Subscribe to some symbols
      ws.send(JSON.stringify({ 
        type: 'subscribe', 
        symbols: ['EUR/USD', 'GBP/USD', 'BTC/USD', 'AAPL'] 
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'marketData') {
          setLiveData(prevData => {
            // Keep only the latest 10 updates
            const newData = [...prevData, data];
            if (newData.length > 10) {
              return newData.slice(newData.length - 10);
            }
            return newData;
          });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };
    
    setSocket(ws);
    
    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Backend Demo</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        This page demonstrates the integration with the local backend services.
      </Typography>
      
      {/* WebSocket Connection Status */}
      <Box sx={{ mb: 3 }}>
        <Chip 
          label={wsConnected ? "WebSocket Connected" : "WebSocket Disconnected"} 
          color={wsConnected ? "success" : "error"} 
          variant="outlined"
        />
      </Box>
      
      {/* Mock API Data */}
      <DemoSection>
        <SectionTitle variant="h5">Mock API Data</SectionTitle>
        
        <Grid container spacing={3}>
          {/* Users */}
          <Grid item xs={12} md={6}>
            <DataCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Users</Typography>
                <List>
                  {users.slice(0, 3).map((user, index) => (
                    <React.Fragment key={user.id}>
                      <ListItem>
                        <ListItemText 
                          primary={user.name} 
                          secondary={`Email: ${user.email} | Role: ${user.role}`} 
                        />
                      </ListItem>
                      {index < users.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </DataCard>
          </Grid>
          
          {/* Trading Strategies */}
          <Grid item xs={12} md={6}>
            <DataCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Trading Strategies</Typography>
                <List>
                  {tradingStrategies.slice(0, 3).map((strategy, index) => (
                    <React.Fragment key={strategy.id}>
                      <ListItem>
                        <ListItemText 
                          primary={strategy.name} 
                          secondary={`Win Rate: ${strategy.winRate}% | Risk: ${strategy.riskLevel}`} 
                        />
                      </ListItem>
                      {index < tradingStrategies.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </DataCard>
          </Grid>
          
          {/* Market Data */}
          <Grid item xs={12} md={6}>
            <DataCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Market Data</Typography>
                <List>
                  {marketData.forex && marketData.forex.slice(0, 3).map((item, index) => (
                    <React.Fragment key={item.symbol}>
                      <ListItem>
                        <ListItemText 
                          primary={item.symbol} 
                          secondary={`Bid: ${item.bid} | Ask: ${item.ask} | Spread: ${item.spread}`} 
                        />
                      </ListItem>
                      {index < 2 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </DataCard>
          </Grid>
          
          {/* Subscription Plans */}
          <Grid item xs={12} md={6}>
            <DataCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Subscription Plans</Typography>
                <List>
                  {subscriptionPlans.slice(0, 3).map((plan, index) => (
                    <React.Fragment key={plan.id}>
                      <ListItem>
                        <ListItemText 
                          primary={plan.name} 
                          secondary={`Price: $${plan.price}/month | Features: ${plan.features.join(', ')}`} 
                        />
                      </ListItem>
                      {index < subscriptionPlans.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </DataCard>
          </Grid>
        </Grid>
      </DemoSection>
      
      {/* Real-time WebSocket Data */}
      <DemoSection>
        <SectionTitle variant="h5">Real-time WebSocket Data</SectionTitle>
        
        <List>
          {liveData.length > 0 ? (
            liveData.map((data, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText 
                    primary={`${data.symbol} - ${new Date(data.timestamp).toLocaleTimeString()}`} 
                    secondary={`Price: ${data.price} | Change: ${data.change > 0 ? '+' : ''}${data.change}%`} 
                    primaryTypographyProps={{ 
                      color: data.change > 0 ? 'success.main' : data.change < 0 ? 'error.main' : 'inherit' 
                    }}
                  />
                </ListItem>
                {index < liveData.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Waiting for real-time data..." />
            </ListItem>
          )}
        </List>
      </DemoSection>
    </Box>
  );
};

export default BackendDemo;
