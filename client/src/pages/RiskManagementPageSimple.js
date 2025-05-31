// Risk Management Page with Emergency Close button at bottom right
import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Alert } from '@mui/material';

// Create elements without JSX
function RiskManagementPageSimple() {
  const [showAlert, setShowAlert] = useState(false);
  
  const handleEmergencyClose = () => {
    setShowAlert(true);
    // Implement emergency close logic here
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  return React.createElement(
    Box, 
    { sx: { p: 3, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' } },
    [
      // Alert for emergency close
      showAlert && React.createElement(
        Alert,
        { 
          severity: 'warning', 
          sx: { mb: 3 },
          onClose: () => setShowAlert(false)
        },
        'Emergency close initiated. Closing all open positions...'
      ),
      
      // Main content
      React.createElement(
        Paper, 
        { 
          sx: { 
            p: 3, 
            mb: 3, 
            flex: 1,
            overflow: 'auto'
          } 
        },
        [
          React.createElement(Typography, { variant: 'body1', paragraph: true }, 
            'The Risk Management page is temporarily unavailable.'
          ),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary', paragraph: true }, 
            'We are working on improving this feature. Please check back later.'
          ),
          React.createElement(
            Button, 
            { variant: 'contained', disabled: true }, 
            'Save Settings'
          )
        ]
      ),
      
      // Emergency Close Button at bottom right
      React.createElement(
        Box,
        { sx: { display: 'flex', justifyContent: 'flex-end', mt: 'auto' } },
        React.createElement(
          Button,
          {
            variant: 'contained',
            color: 'error',
            onClick: handleEmergencyClose,
            size: 'large',
            sx: { fontWeight: 'bold', px: 3, py: 1.5 }
          },
          'Emergency Close All Positions'
        )
      )
    ]
  );
}

export default RiskManagementPageSimple;
