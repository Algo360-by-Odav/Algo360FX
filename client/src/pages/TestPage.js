import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

// Simple Test Page Component
const TestPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test Page
        </Typography>
        <Typography variant="body1">
          This is a simple test page to verify that routing is working correctly.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestPage;
