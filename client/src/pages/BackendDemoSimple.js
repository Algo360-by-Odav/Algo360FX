import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Chip, CircularProgress, Grid, Card, CardContent } from '@mui/material';
import { observer } from 'mobx-react-lite';

// Simple Backend Demo Page
const BackendDemoSimple = observer(() => {
  const [tabValue, setTabValue] = useState(0);
  const [apiStatus, setApiStatus] = useState('checking');
  const [wsStatus, setWsStatus] = useState('checking');
  const [marketData, setMarketData] = useState(null);

  // Check API status
  useEffect(() => {
    fetch('http://localhost:8080/marketData')
      .then(response => {
        if (response.ok) {
          setApiStatus('connected');
          return response.json();
        } else {
          setApiStatus('error');
          throw new Error('API server not responding');
        }
      })
      .then(data => {
        setMarketData(data);
      })
      .catch(error => {
        console.error('Error checking API status:', error);
        setApiStatus('error');
      });
  }, []);

  // Check WebSocket status
  useEffect(() => {
    const wsUrl = 'ws://localhost:8081';
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      setWsStatus('connected');
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsStatus('error');
    };
    
    return () => {
      socket.close();
    };
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Render API status
  const renderApiStatus = () => {
    let color = 'warning';
    let message = 'Checking...';
    
    if (apiStatus === 'connected') {
      color = 'success';
      message = 'Connected';
    } else if (apiStatus === 'error') {
      color = 'error';
      message = 'Error';
    }
    
    return (
      <Chip 
        label={message} 
        color={color} 
        sx={{ mr: 1 }}
      />
    );
  };

  // Render WebSocket status
  const renderWsStatus = () => {
    let color = 'warning';
    let message = 'Checking...';
    
    if (wsStatus === 'connected') {
      color = 'success';
      message = 'Connected';
    } else if (wsStatus === 'error') {
      color = 'error';
      message = 'Error';
    }
    
    return (
      <Chip 
        label={message} 
        color={color} 
        sx={{ mr: 1 }}
      />
    );
  };

  // Render market data
  const renderMarketData = () => {
    if (!marketData) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {Object.entries(marketData).map(([category, assets]) => (
          <Grid item xs={12} md={6} key={category}>
            <Card>
              <CardContent>
                <Typography variant="h6">{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                <Typography variant="body2" color="text.secondary">{assets.length} assets</Typography>
                
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {assets.slice(0, 4).map((asset, index) => (
                    <Grid item xs={6} key={index}>
                      <Card variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="subtitle2">{asset.symbol || asset.pair}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${typeof asset.price === 'number' ? asset.price.toFixed(2) : '—'}
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
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Backend Demo
      </Typography>
      <Typography variant="body1" paragraph>
        This page demonstrates the connection to the local backend services: JSON Server (Mock API) and WebSocket Server.
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Backend Services Status</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>Mock API Server (Port 8080):</Typography>
          {renderApiStatus()}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>WebSocket Server (Port 8081):</Typography>
          {renderWsStatus()}
        </Box>
      </Box>
      
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
          </Tabs>
        </Box>
        
        <Box
          role="tabpanel"
          hidden={tabValue !== 0}
          id="backend-demo-tabpanel-0"
          aria-labelledby="backend-demo-tab-0"
          sx={{ p: 3 }}
        >
          {tabValue === 0 && (
            <>
              <Typography variant="h6" gutterBottom>Market Data API</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Endpoint: http://localhost:8080/marketData
                </Typography>
              </Box>
              {renderMarketData()}
            </>
          )}
        </Box>
        
        <Box
          role="tabpanel"
          hidden={tabValue !== 1}
          id="backend-demo-tabpanel-1"
          aria-labelledby="backend-demo-tab-1"
          sx={{ p: 3 }}
        >
          {tabValue === 1 && (
            <>
              <Typography variant="h6" gutterBottom>WebSocket Server</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  WebSocket URL: ws://localhost:8081
                </Typography>
              </Box>
              <Typography>
                WebSocket server is {wsStatus === 'connected' ? 'connected' : 'not connected'}.
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
});

export default BackendDemoSimple;
