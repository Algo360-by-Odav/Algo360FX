import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AdvancedChart from '../components/Trading/AdvancedChart';
import { observer } from 'mobx-react-lite';

const AdvancedTrading: React.FC = observer(() => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Advanced Trading
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AdvancedChart
            symbol="EURUSD"
            interval="1H"
          />
        </Grid>
      </Grid>
    </Box>
  );
});

export default AdvancedTrading;
