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
  CardMedia,
  CardActions,
  Button,
  Avatar,
  Chip,
  Rating,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Badge,
} from '@mui/material';
import {
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  Notifications as NotificationsSettingsIcon,
  Language as LanguageIcon,
  AccountCircle as ProfileIcon,
  CreditCard as PaymentIcon,
  Tune as PreferencesIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  DoneAll as MarkReadIcon,
} from '@mui/icons-material';
import {
  AccountBalance as AccountBalanceIcon,
  SignalCellularAlt as SignalIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@components/error/ErrorBoundary';
import { useRootStore } from '@/hooks/useRootStore';
import PortfolioManagement from '@components/Portfolio/PortfolioManagement';
import PerformanceChart from '@components/PerformanceChart';
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
  const { investmentStore } = useRootStore();
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

  // Mock subscriptions data
  const subscriptions = [
    {
      id: 1,
      providerName: "FX Master Signals",
      providerAvatar: "/avatars/provider1.jpg",
      rating: 4.8,
      subscribers: 1250,
      monthlyPrice: 29.99,
      status: "active",
      subscriptionType: "Premium",
      startDate: "2023-11-01",
      nextBilling: "2024-01-01",
      performance: {
        winRate: 68,
        totalSignals: 156,
        avgPips: 35,
      },
    },
    {
      id: 2,
      providerName: "Pro Forex Signals",
      providerAvatar: "/avatars/provider2.jpg",
      rating: 4.5,
      subscribers: 850,
      monthlyPrice: 19.99,
      status: "active",
      subscriptionType: "Basic",
      startDate: "2023-12-01",
      nextBilling: "2024-01-01",
      performance: {
        winRate: 65,
        totalSignals: 98,
        avgPips: 28,
      },
    },
    {
      id: 3,
      providerName: "Elite Trading Signals",
      providerAvatar: "/avatars/provider3.jpg",
      rating: 4.2,
      subscribers: 620,
      monthlyPrice: 39.99,
      status: "expired",
      subscriptionType: "Premium",
      startDate: "2023-10-01",
      nextBilling: "2023-12-01",
      performance: {
        winRate: 72,
        totalSignals: 134,
        avgPips: 42,
      },
    },
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Trade Executed',
      message: 'Buy order for EUR/USD executed at 1.0950',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Signal Alert',
      message: 'New sell signal for GBP/JPY from FX Master Signals',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Market News',
      message: 'Fed announces interest rate decision at 2:00 PM EST',
      time: '1 hour ago',
      read: true,
    },
    {
      id: 4,
      type: 'error',
      title: 'Connection Error',
      message: 'Lost connection to trading server. Attempting to reconnect...',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 5,
      type: 'success',
      title: 'Take Profit Hit',
      message: 'USD/JPY trade closed with +45 pips profit',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 6,
      type: 'info',
      title: 'Account Update',
      message: 'Monthly performance report is now available',
      time: '5 hours ago',
      read: true,
    },
    {
      id: 7,
      type: 'warning',
      title: 'Risk Alert',
      message: 'Current drawdown approaching your set limit of 5%',
      time: '6 hours ago',
      read: true,
    },
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
          {/* Subscription Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Subscriptions</Typography>
                </Box>
                <Typography variant="h4">2</Typography>
                <Typography color="text.secondary" variant="body2">
                  Total monthly cost: $49.98
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Average Performance</Typography>
                </Box>
                <Typography variant="h4">66.5%</Typography>
                <Typography color="text.secondary" variant="body2">
                  Win rate across all subscriptions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimeIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Next Renewal</Typography>
                </Box>
                <Typography variant="h4">9 Days</Typography>
                <Typography color="text.secondary" variant="body2">
                  Until next subscription renewal
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Subscription List */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Subscriptions
              </Typography>
              
              <List>
                {subscriptions.map((subscription, index) => (
                  <React.Fragment key={subscription.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: subscription.status === 'expired' ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        my: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={subscription.providerAvatar}
                          alt={subscription.providerName}
                        >
                          {subscription.providerName[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {subscription.providerName}
                            </Typography>
                            <Chip
                              size="small"
                              label={subscription.status === 'active' ? 'Active' : 'Expired'}
                              color={subscription.status === 'active' ? 'success' : 'default'}
                              sx={{ height: 20 }}
                            />
                            <Chip
                              size="small"
                              label={subscription.subscriptionType}
                              color="primary"
                              variant="outlined"
                              sx={{ height: 20 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Rating
                                  value={subscription.rating}
                                  precision={0.1}
                                  size="small"
                                  readOnly
                                />
                                <Typography variant="body2">
                                  ({subscription.rating})
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                ${subscription.monthlyPrice}/month
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2">
                                Win Rate: {subscription.performance.winRate}%
                              </Typography>
                              <Typography variant="body2">
                                Total Signals: {subscription.performance.totalSignals}
                              </Typography>
                              <Typography variant="body2">
                                Avg. Pips: {subscription.performance.avgPips}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2">
                                Started: {new Date(subscription.startDate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2">
                                Next Billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          title="View Provider"
                          sx={{ mr: 1 }}
                        >
                          <ViewIcon />
                        </IconButton>
                        {subscription.status === 'active' ? (
                          <IconButton
                            edge="end"
                            color="error"
                            title="Cancel Subscription"
                          >
                            <CancelIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            edge="end"
                            color="primary"
                            title="Renew Subscription"
                          >
                            <RefreshIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < subscriptions.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonIcon />}
                >
                  Browse Signal Providers
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          {/* Profile Settings */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ProfileIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Profile Settings</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    defaultValue="John Smith"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue="john.smith@example.com"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue="+1 234 567 8900"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Trading Experience</InputLabel>
                    <Select defaultValue="intermediate" label="Trading Experience">
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                      <MenuItem value="professional">Professional</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Trading Goals"
                    multiline
                    rows={3}
                    defaultValue="Achieve consistent monthly returns through forex trading while managing risk effectively."
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary">
                      Save Profile
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Trading Preferences */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PreferencesIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Trading Preferences</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Default Lot Size</InputLabel>
                    <Select defaultValue="0.1" label="Default Lot Size">
                      <MenuItem value="0.01">0.01</MenuItem>
                      <MenuItem value="0.1">0.1</MenuItem>
                      <MenuItem value="1">1.0</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Risk Per Trade</InputLabel>
                    <Select defaultValue="2" label="Risk Per Trade">
                      <MenuItem value="1">1% of Account</MenuItem>
                      <MenuItem value="2">2% of Account</MenuItem>
                      <MenuItem value="3">3% of Account</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto-calculate position size based on risk"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Use stop loss and take profit for all trades"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary">
                      Save Preferences
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Security & Notifications */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Security Settings</Typography>
              </Box>
              <FormGroup>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Two-factor authentication"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Login notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Suspicious activity alerts"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </FormGroup>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsSettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Notification Settings</Typography>
              </Box>
              <FormGroup>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Signal alerts"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Trade execution notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Price alerts"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="News alerts"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Marketing updates"
                />
              </FormGroup>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PaymentIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Payment Settings</Typography>
              </Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Your next billing date is January 1, 2024
              </Alert>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mb: 1 }}
              >
                Update Payment Method
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
              >
                View Billing History
              </Button>
            </Paper>
          </Grid>

          {/* Advanced Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LanguageIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Advanced Settings</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Time Zone</InputLabel>
                    <Select defaultValue="UTC+8" label="Time Zone">
                      <MenuItem value="UTC+8">UTC+8 (Singapore/Hong Kong)</MenuItem>
                      <MenuItem value="UTC+0">UTC+0 (London)</MenuItem>
                      <MenuItem value="UTC-5">UTC-5 (New York)</MenuItem>
                      <MenuItem value="UTC-8">UTC-8 (Los Angeles)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select defaultValue="en" label="Language">
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="zh">Chinese</MenuItem>
                      <MenuItem value="ja">Japanese</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Chart Theme</InputLabel>
                    <Select defaultValue="dark" label="Chart Theme">
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Default Chart Timeframe</InputLabel>
                    <Select defaultValue="H1" label="Default Chart Timeframe">
                      <MenuItem value="M5">5 Minutes</MenuItem>
                      <MenuItem value="M15">15 Minutes</MenuItem>
                      <MenuItem value="H1">1 Hour</MenuItem>
                      <MenuItem value="H4">4 Hours</MenuItem>
                      <MenuItem value="D1">Daily</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Some settings changes may require a page refresh to take effect
                  </Alert>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                    >
                      Reset All Settings
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                    >
                      Save All Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={6}>
        <Grid container spacing={3}>
          {/* Notification Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge badgeContent={2} color="error" sx={{ mr: 1 }}>
                    <NotificationsIcon color="primary" />
                  </Badge>
                  <Typography variant="h6">Unread Notifications</Typography>
                </Box>
                <Typography variant="h4">2</Typography>
                <Typography color="text.secondary" variant="body2">
                  Out of 7 total notifications
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(2 / 7) * 100}
                  sx={{ height: 8, borderRadius: 4, mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Types
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<CheckIcon />}
                    label="Success (2)"
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    icon={<WarningIcon />}
                    label="Warning (2)"
                    color="warning"
                    variant="outlined"
                  />
                  <Chip
                    icon={<ErrorIcon />}
                    label="Error (1)"
                    color="error"
                    variant="outlined"
                  />
                  <Chip
                    icon={<InfoIcon />}
                    label="Info (2)"
                    color="info"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Button
                    variant="outlined"
                    startIcon={<MarkReadIcon />}
                    fullWidth
                  >
                    Mark All as Read
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    fullWidth
                  >
                    Clear All Notifications
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification List */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Recent Notifications
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select defaultValue="all">
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="success">Success</MenuItem>
                      <MenuItem value="warning">Warning</MenuItem>
                      <MenuItem value="error">Error</MenuItem>
                      <MenuItem value="info">Info</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select defaultValue="all">
                      <MenuItem value="all">All Time</MenuItem>
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="week">This Week</MenuItem>
                      <MenuItem value="month">This Month</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: `${notification.type}.main`,
                          }}
                        >
                          {notification.type === 'success' && <CheckIcon />}
                          {notification.type === 'warning' && <WarningIcon />}
                          {notification.type === 'error' && <ErrorIcon />}
                          {notification.type === 'info' && <InfoIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" component="span">
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Chip
                                label="New"
                                size="small"
                                color="primary"
                                sx={{ height: 20 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              {notification.time}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" size="small" title="Mark as read">
                          <MarkReadIcon />
                        </IconButton>
                        <IconButton edge="end" size="small" color="error" title="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="text" color="primary">
                  Load More Notifications
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
});

export default InvestorPortal;


