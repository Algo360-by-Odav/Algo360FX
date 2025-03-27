import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShowChart as ShowChartIcon,
  Security as SecurityIcon,
  Gavel as GavelIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { ClientManagement } from '../components/broker/ClientManagement';
import { TradingActivity } from '../components/broker/TradingActivity';
import { RiskManagement } from '../components/broker/RiskManagement';
import { Compliance } from '../components/broker/Compliance';
import { Notifications } from '../components/broker/Notifications';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`broker-tabpanel-${index}`}
      aria-labelledby={`broker-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const BrokerPortalPage: React.FC = observer(() => {
  const { brokerStore } = useStores();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const metrics = {
    totalClients: 1250,
    activeTraders: 856,
    dailyVolume: 2500000,
    dailyTrades: 3420,
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      {/* Header Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                Total Clients
              </Typography>
              <Typography variant="h4">
                {metrics.totalClients.toLocaleString()}
              </Typography>
              <Box sx={{ mt: 1, height: 4, bgcolor: 'primary.main', borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                Active Traders
              </Typography>
              <Typography variant="h4">
                {metrics.activeTraders.toLocaleString()}
              </Typography>
              <Box sx={{ mt: 1, height: 4, bgcolor: 'error.main', borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                Daily Volume
              </Typography>
              <Typography variant="h4">
                €{(metrics.dailyVolume / 1000000).toFixed(1)}M
              </Typography>
              <Box sx={{ mt: 1, height: 4, bgcolor: 'success.main', borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">
                Daily Trades
              </Typography>
              <Typography variant="h4">
                {metrics.dailyTrades.toLocaleString()}
              </Typography>
              <Box sx={{ mt: 1, height: 4, bgcolor: 'info.main', borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="broker portal tabs"
          variant="fullWidth"
        >
          <Tab icon={<DashboardIcon />} label="DASHBOARD" />
          <Tab icon={<PeopleIcon />} label="CLIENT MANAGEMENT" />
          <Tab icon={<ShowChartIcon />} label="TRADING ACTIVITY" />
          <Tab icon={<SecurityIcon />} label="RISK MANAGEMENT" />
          <Tab icon={<GavelIcon />} label="COMPLIANCE" />
          <Tab icon={<NotificationsIcon />} label="NOTIFICATIONS" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 2 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trading Volume Overview
                </Typography>
                {/* Add trading volume chart here */}
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2">
                    New client registration: John Doe
                    <Typography variant="caption" display="block" color="textSecondary">
                      5 minutes ago
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    Trading volume alert: High activity detected
                    <Typography variant="caption" display="block" color="textSecondary">
                      15 minutes ago
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    Risk level update: Portfolio rebalancing required
                    <Typography variant="caption" display="block" color="textSecondary">
                      1 hour ago
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    Compliance check: Monthly audit completed
                    <Typography variant="caption" display="block" color="textSecondary">
                      2 hours ago
                    </Typography>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <ClientManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <TradingActivity />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <RiskManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={4}>
        <Compliance />
      </TabPanel>
      <TabPanel value={currentTab} index={5}>
        <Notifications />
      </TabPanel>
    </Box>
  );
});

export default BrokerPortalPage;

