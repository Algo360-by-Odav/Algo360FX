// A simple placeholder for the Backend Demo page
import React from 'react';
import { Box, Typography, Paper, Button, Card, CardContent, Grid } from '@mui/material';

// Create elements without JSX
function BackendDemoSimple() {
  return React.createElement(
    Box, 
    { sx: { p: 3 } },
    React.createElement(Typography, { variant: 'h4', gutterBottom: true }, 'Backend Demo'),
    React.createElement(
      Typography, 
      { variant: 'body1', paragraph: true }, 
      'This page demonstrates the connection to the local backend services.'
    ),
    React.createElement(
      Paper, 
      { sx: { p: 3 } },
      React.createElement(
        Typography, 
        { variant: 'h5', gutterBottom: true }, 
        'Mock API Server'
      ),
      React.createElement(
        Typography, 
        { variant: 'body1', paragraph: true }, 
        'The Mock API Server is running on http://localhost:8080'
      ),
      React.createElement(
        Typography, 
        { variant: 'body2', paragraph: true }, 
        'Available endpoints: /users, /marketData, /tradingStrategies, /subscriptionPlans, /marketplace'
      ),
      React.createElement(
        Button, 
        { 
          variant: 'contained', 
          onClick: () => window.open('http://localhost:8080', '_blank')
        }, 
        'Open API Server'
      )
    ),
    React.createElement(
      Paper, 
      { sx: { p: 3, mt: 3 } },
      React.createElement(
        Typography, 
        { variant: 'h5', gutterBottom: true }, 
        'WebSocket Server'
      ),
      React.createElement(
        Typography, 
        { variant: 'body1', paragraph: true }, 
        'The WebSocket Server is running on ws://localhost:8081'
      ),
      React.createElement(
        Typography, 
        { variant: 'body2', paragraph: true }, 
        'Available symbols: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, AAPL, MSFT, GOOGL, AMZN, TSLA, BTC/USD, ETH/USD'
      )
    ),
    React.createElement(
      Grid, 
      { container: true, spacing: 3, sx: { mt: 2 } },
      React.createElement(
        Grid, 
        { item: true, xs: 12, md: 6 },
        React.createElement(
          Card,
          null,
          React.createElement(
            CardContent,
            null,
            React.createElement(
              Typography, 
              { variant: 'h6', gutterBottom: true }, 
              'Backend Integration Status'
            ),
            React.createElement(
              Typography, 
              { variant: 'body1', color: 'success.main', paragraph: true }, 
              '✓ Mock API Server is running'
            ),
            React.createElement(
              Typography, 
              { variant: 'body1', color: 'success.main', paragraph: true }, 
              '✓ WebSocket Server is running'
            ),
            React.createElement(
              Typography, 
              { variant: 'body1', color: 'success.main' }, 
              '✓ Frontend is configured to connect to both services'
            )
          )
        )
      ),
      React.createElement(
        Grid, 
        { item: true, xs: 12, md: 6 },
        React.createElement(
          Card,
          null,
          React.createElement(
            CardContent,
            null,
            React.createElement(
              Typography, 
              { variant: 'h6', gutterBottom: true }, 
              'Next Steps'
            ),
            React.createElement(
              Typography, 
              { variant: 'body2', paragraph: true }, 
              '1. Enhance the mock data in the db.json file'
            ),
            React.createElement(
              Typography, 
              { variant: 'body2', paragraph: true }, 
              '2. Add more API endpoints to the JSON Server'
            ),
            React.createElement(
              Typography, 
              { variant: 'body2', paragraph: true }, 
              '3. Improve the WebSocket server with additional features'
            )
          )
        )
      )
    )
  );
}

export default BackendDemoSimple;
