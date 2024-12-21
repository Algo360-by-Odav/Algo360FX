import React from 'react';
import { Box, Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import PositionManagerWidget from '../Position/PositionManagerWidget';
import TradingViewChart from '../Chart/TradingViewChart';

const DashboardLayout: React.FC = observer(() => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TradingViewChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PositionManagerWidget />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default DashboardLayout;
