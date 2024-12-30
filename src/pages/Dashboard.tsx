import React from 'react';
import { Grid, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useResponsive } from '@/hooks/useResponsive';
import AccountSummaryWidget from '@components/Account/AccountSummaryWidget';
import TradingDashboard from '@components/Trading/TradingDashboard';

const Dashboard: React.FC = observer(() => {
  const { deviceType } = useResponsive('up', 'xs');
  const isMobile = deviceType === 'mobile';

  return (
    <Box sx={{ 
      flexGrow: 1,
      minHeight: '100%',
      p: 3,
      backgroundColor: 'background.default',
    }}>
      <Grid 
        container 
        spacing={3}
      >
        <Grid item xs={12}>
          <AccountSummaryWidget />
        </Grid>
        <Grid item xs={12}>
          <TradingDashboard />
        </Grid>
      </Grid>
    </Box>
  );
});

export default Dashboard;
