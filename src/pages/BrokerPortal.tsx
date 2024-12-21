import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@components/error/ErrorBoundary';
import { useRootStoreContext } from '@/stores/RootStoreContext';

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
      id={`broker-tabpanel-${index}`}
      aria-labelledby={`broker-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const BrokerPortal: React.FC = observer(() => {
  const { brokerStore } = useRootStoreContext();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data - replace with actual data from store
  const stats = {
    totalClients: 1250,
    activeTraders: 856,
    totalVolume: '€2.5M',
    dailyTrades: 3420,
  };

  const recentActivities = [
    { text: 'New client registration: John Doe', time: '5 minutes ago' },
    { text: 'Trading volume alert: High activity detected', time: '15 minutes ago' },
    { text: 'Risk level update: Portfolio rebalancing required', time: '1 hour ago' },
    { text: 'Compliance check: Monthly audit completed', time: '2 hours ago' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Broker Portal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive broker management and monitoring system
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Clients
              </Typography>
              <Typography variant="h4">{stats.totalClients}</Typography>
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
                Active Traders
              </Typography>
              <Typography variant="h4">{stats.activeTraders}</Typography>
              <LinearProgress
                variant="determinate"
                value={65}
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
                Daily Volume
              </Typography>
              <Typography variant="h4">{stats.totalVolume}</Typography>
              <LinearProgress
                variant="determinate"
                value={85}
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
                Daily Trades
              </Typography>
              <Typography variant="h4">{stats.dailyTrades}</Typography>
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
          aria-label="broker portal tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Client Management" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Trading Activity" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Risk Management" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Compliance" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Trading Volume Overview
              </Typography>
              {/* Add Trading Volume Chart Component */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Client Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Client Overview
              </Typography>
              {/* Add Client Management Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Trading Activity Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Live Trading Activity
              </Typography>
              {/* Add Trading Activity Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Management Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Analytics
              </Typography>
              {/* Add Risk Management Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Compliance Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Compliance Dashboard
              </Typography>
              {/* Add Compliance Component */}
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

export default BrokerPortal;
