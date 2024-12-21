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
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '../components/error/ErrorBoundary';
import { useRootStoreContext } from '../stores/RootStoreContext';

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
      id={`money-manager-tabpanel-${index}`}
      aria-labelledby={`money-manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const MoneyManagerPortal: React.FC = observer(() => {
  const { portfolioStore } = useRootStoreContext();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data - replace with actual data from store
  const stats = {
    aum: '$125M',
    activePortfolios: 85,
    monthlyReturn: '+8.5%',
    clientCount: 320,
  };

  const portfolioPerformance = [
    { name: 'Conservative', return: '+5.2%', risk: 'Low' },
    { name: 'Balanced', return: '+7.8%', risk: 'Medium' },
    { name: 'Aggressive', return: '+12.4%', risk: 'High' },
    { name: 'Forex Focus', return: '+9.6%', risk: 'Medium-High' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Money Manager Portal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Professional portfolio management and performance tracking
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Assets Under Management
              </Typography>
              <Typography variant="h4">{stats.aum}</Typography>
              <LinearProgress
                variant="determinate"
                value={80}
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
                Active Portfolios
              </Typography>
              <Typography variant="h4">{stats.activePortfolios}</Typography>
              <LinearProgress
                variant="determinate"
                value={70}
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
                Monthly Return
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.monthlyReturn}
              </Typography>
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
                Total Clients
              </Typography>
              <Typography variant="h4">{stats.clientCount}</Typography>
              <LinearProgress
                variant="determinate"
                value={65}
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
          aria-label="money manager portal tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Portfolio Management" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Performance Analytics" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Asset Allocation" icon={<PieChartIcon />} iconPosition="start" />
          <Tab label="Trading Activity" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Client Reports" icon={<GroupIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance Overview
              </Typography>
              {/* Add Portfolio Performance Chart Component */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Strategy Performance
              </Typography>
              <List>
                {portfolioPerformance.map((portfolio, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={portfolio.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="success.main"
                              sx={{ mr: 2 }}
                            >
                              {portfolio.return}
                            </Typography>
                            <Chip
                              label={portfolio.risk}
                              size="small"
                              color={
                                portfolio.risk === 'Low'
                                  ? 'success'
                                  : portfolio.risk === 'Medium'
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < portfolioPerformance.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Portfolio Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Overview
              </Typography>
              {/* Add Portfolio Management Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Performance Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              {/* Add Performance Analytics Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Asset Allocation Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Asset Distribution
              </Typography>
              {/* Add Asset Allocation Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Trading Activity Tab */}
      <TabPanel value={tabValue} index={4}>
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

      {/* Client Reports Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Client Performance Reports
              </Typography>
              {/* Add Client Reports Component */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
});

export default MoneyManagerPortal;
