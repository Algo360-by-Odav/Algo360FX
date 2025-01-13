import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

export const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Overview
            </Typography>
            {/* Add portfolio summary here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add recent activity here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
