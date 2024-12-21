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
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  SignalCellularAlt as SignalIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@components/error/ErrorBoundary';
import { useRootStoreContext } from '@/stores/RootStoreContext';
import PortfolioManagement from '@components/portfolio/PortfolioManagement';
import PerformanceChart from '@components/charts/PerformanceChart';
import StockMarket from '@components/stock/StockMarket';

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
      id={`investor-tabpanel-${index}`}
      aria-labelledby={`investor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const InvestorPortal: React.FC = observer(() => {
  const { investmentStore } = useRootStoreContext();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data - replace with actual data from store
  const stats = {
    totalInvestment: '$250K',
    currentValue: '$285K',
    totalReturn: '+14%',
    activeStrategies: 8,
  };

  const portfolioItems = [
    { name: 'Forex Growth Fund', allocation: '40%', return: '+15.2%', risk: 'Medium' },
    { name: 'Algo Trading Strategy', allocation: '25%', return: '+8.7%', risk: 'Low' },
    { name: 'Signal Provider Bundle', allocation: '20%', return: '+12.4%', risk: 'Medium' },
    { name: 'Money Manager Portfolio', allocation: '15%', return: '+18.9%', risk: 'High' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Investor Portal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor and manage your investment portfolio
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Investment
              </Typography>
              <Typography variant="h4">{stats.totalInvestment}</Typography>
              <LinearProgress
                variant="determinate"
                value={85}
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
                Current Value
              </Typography>
              <Typography variant="h4">{stats.currentValue}</Typography>
              <LinearProgress
                variant="determinate"
                value={90}
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
                Total Return
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.totalReturn}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={70}
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
                Active Strategies
              </Typography>
              <Typography variant="h4">{stats.activeStrategies}</Typography>
              <LinearProgress
                variant="determinate"
                value={80}
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
          aria-label="investor portal tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Portfolio" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Trading Activity" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Stock Market" icon={<SignalIcon />} iconPosition="start" />
          <Tab label="Signal Subscriptions" icon={<SignalIcon />} iconPosition="start" />
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
                Portfolio Performance
              </Typography>
              {/* Add Portfolio Performance Chart Component */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Asset Allocation
              </Typography>
              <List>
                {portfolioItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography component="span">
                              {item.name}
                            </Typography>
                            <Typography
                              component="span"
                              color="success.main"
                              sx={{ ml: 1 }}
                            >
                              {item.return}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip
                              label={item.allocation}
                              size="small"
                              color="primary"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={item.risk}
                              size="small"
                              color={
                                item.risk === 'Low'
                                  ? 'success'
                                  : item.risk === 'Medium'
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < portfolioItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Portfolio Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <PortfolioManagement />
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
                Portfolio Performance
              </Typography>
              <PerformanceChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Portfolio Value',
                      data: [250000, 265000, 258000, 275000, 285000, 282000],
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    },
                    {
                      label: 'Benchmark',
                      data: [250000, 255000, 262000, 268000, 272000, 275000],
                      borderColor: 'rgb(255, 99, 132)',
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      text: 'Portfolio Performance vs Benchmark',
                    },
                  },
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Stock Market Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <StockMarket />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Signal Subscriptions Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Active Subscriptions
              </Typography>
              {/* Add Signal Subscriptions Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              {/* Add Settings Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={6}>
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

export default InvestorPortal;
