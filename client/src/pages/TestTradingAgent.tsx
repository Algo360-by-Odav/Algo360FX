import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const TestTradingAgent: React.FC = () => {
  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Trading Agent Test Page
        </Typography>
        <Typography variant="body1">
          This is a simple test page to verify that the Trading Agent route is working.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestTradingAgent;
