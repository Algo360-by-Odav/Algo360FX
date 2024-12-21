import React from 'react';
import { Grid, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../stores/RootStoreContext';
import AccountSummaryWidget from '../components/Account/AccountSummaryWidget';
import PerformanceAnalyticsWidget from '../components/Analytics/PerformanceAnalyticsWidget';
import PositionManagerWidget from '../components/Position/PositionManagerWidget';

const Portfolio: React.FC = observer(() => {
  const { tradingStore } = useRootStoreContext();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Account Summary Section */}
        <Grid item xs={12} md={4}>
          <AccountSummaryWidget />
        </Grid>

        {/* Performance Analytics Section */}
        <Grid item xs={12} md={8}>
          <PerformanceAnalyticsWidget />
        </Grid>

        {/* Open Positions Section */}
        <Grid item xs={12}>
          <PositionManagerWidget />
        </Grid>
      </Grid>
    </Box>
  );
});

export default Portfolio;
