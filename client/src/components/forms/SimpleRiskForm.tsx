import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

/**
 * A simplified Risk Management Form component that avoids Vite errors
 */
const SimpleRiskForm: React.FC = () => {
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
};

export default SimpleRiskForm;
