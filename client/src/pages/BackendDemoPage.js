import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Chip, CircularProgress, Grid, Card, CardContent } from '@mui/material';
import { observer } from 'mobx-react-lite';

// Backend Demo Page Component
const BackendDemoPage = observer(() => {
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
          <Chip 
            label={apiStatus === 'connected' ? 'Connected' : apiStatus === 'error' ? 'Error' : 'Checking...'} 
            color={apiStatus === 'connected' ? 'success' : apiStatus === 'error' ? 'error' : 'warning'} 
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>WebSocket Server (Port 8081):</Typography>
          <Chip 
            label={wsStatus === 'connected' ? 'Connected' : wsStatus === 'error' ? 'Error' : 'Checking...'} 
            color={wsStatus === 'connected' ? 'success' : wsStatus === 'error' ? 'error' : 'warning'} 
          />
        </Box>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Market Data API" />
          <Tab label="WebSocket" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <>
              <Typography variant="h6" gutterBottom>Market Data API</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Endpoint: http://localhost:8080/marketData
                </Typography>
              </Box>
              
              {!marketData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Typography>Market data loaded successfully.</Typography>
              )}
            </>
          )}
          
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

export default BackendDemoPage;
