import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import {
  SignalCellularAlt as SignalIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '../components/error/ErrorBoundary';
import { useRootStoreContext } from '../stores/RootStoreContext';
import SignalManagement from '../components/SignalManagement';
import PerformanceChart from '../components/PerformanceChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`signal-provider-tabpanel-${index}`}
      aria-labelledby={`signal-provider-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const SignalProviderPortal: React.FC = observer(() => {
  const { signalStore } = useRootStoreContext();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data - replace with actual data from store
  const stats = {
    activeSignals: 24,
    subscribers: 1580,
    successRate: '78.5%',
    monthlyRevenue: '$45.2K',
  };

  const recentSignals = [
    { pair: 'EUR/USD', type: 'BUY', profit: '+2.35%', time: '5m ago' },
    { pair: 'GBP/JPY', type: 'SELL', profit: '+1.82%', time: '15m ago' },
    { pair: 'USD/CHF', type: 'BUY', profit: '+3.15%', time: '1h ago' },
    { pair: 'AUD/USD', type: 'SELL', profit: '-0.95%', time: '2h ago' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Signal Provider Portal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and monitor your trading signals and subscriber base
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Signals
              </Typography>
              <Typography variant="h4">{stats.activeSignals}</Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ mt: 2 }}
                color="primary"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Subscribers
              </Typography>
              <Typography variant="h4">{stats.subscribers}</Typography>
              <LinearProgress
                variant="determinate"
                value={85}
                sx={{ mt: 2 }}
                color="secondary"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.successRate}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={78}
                sx={{ mt: 2 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h4">{stats.monthlyRevenue}</Typography>
              <LinearProgress
                variant="determinate"
                value={90}
                sx={{ mt: 2 }}
                color="info"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="signal provider portal tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Signal Management" icon={<SignalIcon />} iconPosition="start" />
          <Tab label="Performance" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Subscribers" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Signal Performance Overview
              </Typography>
              {/* Add Signal Performance Chart Component */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Recent Signals
              </Typography>
              <List>
                {recentSignals.map((signal, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography component="span" sx={{ mr: 1 }}>
                              {signal.pair}
                            </Typography>
                            <Chip
                              label={signal.type}
                              size="small"
                              color={signal.type === 'BUY' ? 'success' : 'error'}
                              sx={{ mr: 1 }}
                            />
                            <Typography
                              component="span"
                              color={signal.profit.startsWith('+') ? 'success.main' : 'error.main'}
                            >
                              {signal.profit}
                            </Typography>
                          </Box>
                        }
                        secondary={signal.time}
                      />
                    </ListItem>
                    {index < recentSignals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Signal Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <SignalManagement />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Performance Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Analytics
              </Typography>
              <PerformanceChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Success Rate',
                      data: [75, 78, 76, 79, 85, 78],
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    },
                    {
                      label: 'Profit',
                      data: [1200, 1350, 1100, 1400, 1600, 1300],
                      borderColor: 'rgb(255, 99, 132)',
                      tension: 0.1,
                    },
                  ],
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Subscribers Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Subscriber Management
              </Typography>
              {/* Add Subscriber Management Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Signal Provider Settings
              </Typography>
              {/* Add Settings Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Notifications
              </Typography>
              {/* Add Notifications Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
});

export default SignalProviderPortal;
