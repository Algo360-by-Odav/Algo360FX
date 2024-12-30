import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Container, Grid, Paper } from '@mui/material';
import WelcomeCard from './WelcomeCard';
import StatsCards from './StatsCards';
import ThemeSettings from '../../components/theme/ThemeSettings';
import AccountSummary from './AccountSummary';
import TradingChart from './TradingChart';

const Dashboard: React.FC = observer(() => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12}>
            <WelcomeCard />
          </Grid>

          {/* Trading Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '400px' }}>
              <TradingChart />
            </Paper>
          </Grid>

          {/* Account Summary */}
          <Grid item xs={12} md={4}>
            <AccountSummary />
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12}>
            <StatsCards />
          </Grid>
        </Grid>

        <ThemeSettings
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onOpen={() => setSettingsOpen(true)}
        />
      </Container>
    </Box>
  );
});

export default Dashboard;
