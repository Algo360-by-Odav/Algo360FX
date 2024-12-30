import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useRootStore } from '@/hooks/useRootStore';

const Strategy = observer(() => {
  const { strategyStore } = useRootStore();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Strategy Builder
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            {/* Strategy Builder Interface */}
            <Typography variant="h6" gutterBottom>
              Build Your Strategy
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            {/* Strategy Performance */}
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default Strategy;
