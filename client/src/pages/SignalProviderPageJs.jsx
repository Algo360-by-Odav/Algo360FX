import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Container,
  Grid,
  Button,
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  People,
  Settings,
  Sync,
  School,
  Forum,
  Notifications,
  Assessment,
} from '@mui/icons-material';
import { SignalDashboard } from '../components/signal-provider/SignalDashboard';
import { SignalFilters } from '../components/signal-provider/SignalFilters';
import { PerformanceAnalytics } from '../components/signal-provider/PerformanceAnalytics';
import { CopyTradingIntegration } from '../components/signal-provider/CopyTradingIntegration';
import { useStores } from '../stores/storeProviderJs';

// Interface for tab panel props
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`signal-tabpanel-${index}`}
      aria-labelledby={`signal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const SignalProviderPageJs = observer(() => {
  const { signalProviderStore } = useStores();
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    searchQuery: '',
    currencyPair: 'all',
    timeframe: 'all',
    riskLevel: 'all',
    profitability: 'all',
    sortBy: 'newest',
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Signal Provider
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Follow top-performing signal providers, analyze their performance, and copy their trades directly to your MT5 account.
        </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="signal provider tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Dashboard />} label="Dashboard" />
            <Tab icon={<Analytics />} label="Performance Analytics" />
            <Tab icon={<Sync />} label="Copy Trading" />
            <Tab icon={<People />} label="Providers" />
            <Tab icon={<Forum />} label="Community" />
            <Tab icon={<School />} label="Education" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<Settings />} label="Settings" />
            <Tab icon={<Assessment />} label="Risk Assessment" />
          </Tabs>
        </Paper>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
          <SignalFilters onFilterChange={handleFilterChange} />
          <SignalDashboard filters={filters} />
        </TabPanel>

        {/* Performance Analytics Tab */}
        <TabPanel value={tabValue} index={1}>
          <PerformanceAnalytics />
        </TabPanel>

        {/* Copy Trading Tab */}
        <TabPanel value={tabValue} index={2}>
          <CopyTradingIntegration />
        </TabPanel>

        {/* Providers Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Signal Providers Directory
          </Typography>
          <Typography paragraph>
            Browse and compare all available signal providers. This section would include a directory of providers with filtering and sorting options.
          </Typography>
          <Button variant="contained" color="primary">
            View All Providers
          </Button>
        </TabPanel>

        {/* Community Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" gutterBottom>
            Community Forum
          </Typography>
          <Typography paragraph>
            Connect with other traders, discuss signals, and share your experiences. This section would include discussion forums, comments, and social features.
          </Typography>
          <Button variant="contained" color="primary">
            Join Discussion
          </Button>
        </TabPanel>

        {/* Education Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h5" gutterBottom>
            Educational Resources
          </Typography>
          <Typography paragraph>
            Learn trading strategies, signal interpretation, and risk management. This section would include educational content, webinars, and strategy explanations.
          </Typography>
          <Button variant="contained" color="primary">
            Browse Resources
          </Button>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h5" gutterBottom>
            Notification Settings
          </Typography>
          <Typography paragraph>
            Configure how and when you receive alerts for new signals and updates. This section would include notification preferences, sound settings, and quiet hours.
          </Typography>
          <Button variant="contained" color="primary">
            Configure Notifications
          </Button>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={7}>
          <Typography variant="h5" gutterBottom>
            Account Settings
          </Typography>
          <Typography paragraph>
            Manage your subscription preferences, payment methods, and account details. This section would include subscription management and account settings.
          </Typography>
          <Button variant="contained" color="primary">
            Manage Subscriptions
          </Button>
        </TabPanel>

        {/* Risk Assessment Tab */}
        <TabPanel value={tabValue} index={8}>
          <Typography variant="h5" gutterBottom>
            Risk Assessment Tools
          </Typography>
          <Typography paragraph>
            Analyze your portfolio risk, exposure across different providers, and correlation between signals. This section would include risk visualization tools.
          </Typography>
          <Button variant="contained" color="primary">
            Analyze Portfolio Risk
          </Button>
        </TabPanel>
      </Box>
    </Container>
  );
});

export default SignalProviderPageJs;
