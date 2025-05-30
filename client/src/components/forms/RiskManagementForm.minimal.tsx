import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Minimal Risk Management Form component to avoid Vite errors
 */
const RiskManagementForm: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Risk Management Settings
        </Typography>
        <Typography variant="body1">
          Risk management settings are temporarily unavailable.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RiskManagementForm;
