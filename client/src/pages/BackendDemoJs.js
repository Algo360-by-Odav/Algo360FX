// BackendDemoJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Chip, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import { observer } from 'mobx-react-lite';

// Backend Demo Page using React.createElement instead of JSX
// This component is exported and used in routes.tsx
const BackendDemoJs = observer(() => {
  const [tabValue, setTabValue] = React.useState(0);
  const [apiStatus, setApiStatus] = React.useState('checking');
  const [wsStatus, setWsStatus] = React.useState('checking');
  const [marketData, setMarketData] = React.useState(null);

  // Check API status
  React.useEffect(() => {
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
  React.useEffect(() => {
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
    
    return React.createElement(
      Chip, 
      { 
        label: message, 
        color: color, 
        sx: { mr: 1 }
      }
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
    
    return React.createElement(
      Chip, 
      { 
        label: message, 
        color: color, 
        sx: { mr: 1 }
      }
    );
  };

  // Render market data
  const renderMarketData = () => {
    if (!marketData) {
      return React.createElement(
        Box, 
        { 
          sx: { display: 'flex', justifyContent: 'center', p: 3 }
        },
        React.createElement(CircularProgress)
      );
    }

    return React.createElement(
      Grid, 
      { container: true, spacing: 2 },
      Object.entries(marketData).map(([category, assets]) => 
        React.createElement(
          Grid, 
          { item: true, xs: 12, md: 6, key: category },
          React.createElement(
            Card,
            null,
            [
              React.createElement(
                CardContent,
                null,
                [
                  React.createElement(
                    Typography, 
                    { variant: 'h6' },
                    category.charAt(0).toUpperCase() + category.slice(1)
                  ),
                  React.createElement(
                    Typography, 
                    { variant: 'body2', color: 'text.secondary' },
                    `${assets.length} assets`
                  ),
                  React.createElement(
                    Divider,
                    { sx: { my: 1 } }
                  ),
                  React.createElement(
                    Grid, 
                    { container: true, spacing: 1, sx: { mt: 1 } },
                    assets.slice(0, 4).map((asset, index) => 
                      React.createElement(
                        Grid, 
                        { item: true, xs: 6, key: index },
                        React.createElement(
                          Card, 
                          { variant: 'outlined', sx: { p: 1 } },
                          [
                            React.createElement(
                              Typography, 
                              { variant: 'subtitle2' },
                              asset.symbol || asset.pair
                            ),
                            React.createElement(
                              Typography, 
                              { variant: 'body2', color: 'text.secondary' },
                              `Price: $${typeof asset.price === 'number' ? asset.price.toFixed(2) : '—'}`
                            )
                          ]
                        )
                      )
                    )
                  )
                ]
              )
            ]
          )
        )
      )
    );
  };

  // Render WebSocket tab content
  const renderWebSocketContent = () => {
    return React.createElement(
      React.Fragment,
      null,
      [
        React.createElement(
          Typography, 
          { variant: 'h6', gutterBottom: true },
          'WebSocket Server'
        ),
        React.createElement(
          Box, 
          { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 } },
          React.createElement(
            Typography, 
            { variant: 'body2', color: 'text.secondary' },
            'WebSocket URL: ws://localhost:8081'
          )
        ),
        React.createElement(
          Typography,
          null,
          `WebSocket server is ${wsStatus === 'connected' ? 'connected' : 'not connected'}.`
        )
      ]
    );
  };

  return React.createElement(
    Box, 
    { sx: { p: 3 } },
    [
      // Title
      React.createElement(
        Typography, 
        { variant: 'h4', gutterBottom: true },
        'Backend Demo'
      ),
      
      // Description
      React.createElement(
        Typography, 
        { variant: 'body1', paragraph: true },
        'This page demonstrates the connection to the local backend services: JSON Server (Mock API) and WebSocket Server.'
      ),
      
      // Status section
      React.createElement(
        Box, 
        { sx: { mb: 3 } },
        [
          React.createElement(
            Typography, 
            { variant: 'h6', gutterBottom: true },
            'Backend Services Status'
          ),
          React.createElement(
            Box, 
            { sx: { display: 'flex', alignItems: 'center', mb: 2 } },
            [
              React.createElement(
                Typography, 
                { variant: 'body1', sx: { mr: 2 } },
                'Mock API Server (Port 8080):'
              ),
              renderApiStatus()
            ]
          ),
          React.createElement(
            Box, 
            { sx: { display: 'flex', alignItems: 'center' } },
            [
              React.createElement(
                Typography, 
                { variant: 'body1', sx: { mr: 2 } },
                'WebSocket Server (Port 8081):'
              ),
              renderWsStatus()
            ]
          )
        ]
      ),
      
      // Tabs section
      React.createElement(
        Paper, 
        { sx: { mb: 3 } },
        [
          React.createElement(
            Box, 
            { sx: { borderBottom: 1, borderColor: 'divider' } },
            React.createElement(
              Tabs,
              {
                value: tabValue,
                onChange: handleTabChange,
                variant: 'scrollable',
                scrollButtons: 'auto'
              },
              [
                React.createElement(Tab, { label: 'Market Data API' }),
                React.createElement(Tab, { label: 'WebSocket' })
              ]
            )
          ),
          
          // Tab panels
          React.createElement(
            Box,
            {
              role: 'tabpanel',
              hidden: tabValue !== 0,
              id: 'backend-demo-tabpanel-0',
              'aria-labelledby': 'backend-demo-tab-0',
              sx: { p: 3 }
            },
            tabValue === 0 && [
              React.createElement(
                Typography, 
                { variant: 'h6', gutterBottom: true },
                'Market Data API'
              ),
              React.createElement(
                Box, 
                { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 } },
                React.createElement(
                  Typography, 
                  { variant: 'body2', color: 'text.secondary' },
                  'Endpoint: http://localhost:8080/marketData'
                )
              ),
              renderMarketData()
            ]
          ),
          
          React.createElement(
            Box,
            {
              role: 'tabpanel',
              hidden: tabValue !== 1,
              id: 'backend-demo-tabpanel-1',
              'aria-labelledby': 'backend-demo-tab-1',
              sx: { p: 3 }
            },
            tabValue === 1 && renderWebSocketContent()
          )
        ]
      )
    ]
  );
});

export default BackendDemoJs;
