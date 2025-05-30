import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

/**
 * A basic Risk Management Form component using JavaScript instead of TypeScript
 * to avoid Vite errors
 */
function BasicRiskForm() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Risk Management Settings
        </Typography>
        <Typography variant="body1" paragraph>
          Risk management settings are temporarily unavailable.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          We're working on improving this feature. Please check back later.
        </Typography>
        <Button variant="contained" disabled>
          Save Settings
        </Button>
      </Paper>
    </Box>
  );
}

export default BasicRiskForm;
