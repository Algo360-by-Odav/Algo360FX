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
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Menu,
} from '@mui/material';
import {
  SignalCellularAlt as SignalIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  Mail as MailIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Payments as PaymentsIcon,
  Notifications as NotificationsSettingsIcon,
  Language as LanguageIcon,
  AccountCircle as ProfileIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  DoneAll as MarkReadIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@components/error/ErrorBoundary';
import { useRootStore } from '@/hooks/useRootStore';
import SignalManagement from '@components/SignalManagement';
import PerformanceChart from '@components/PerformanceChart';

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
  const { signalStore } = useRootStore();
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

  // Mock subscribers data
  const subscribers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      joinDate: '2023-12-01',
      status: 'Active',
      profitLoss: '+15.8%',
      subscription: 'Premium',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      joinDate: '2023-11-15',
      status: 'Active',
      profitLoss: '+22.3%',
      subscription: 'Premium',
      lastActive: '5 hours ago',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      joinDate: '2023-12-10',
      status: 'Inactive',
      profitLoss: '-5.2%',
      subscription: 'Basic',
      lastActive: '1 day ago',
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      joinDate: '2023-12-05',
      status: 'Active',
      profitLoss: '+18.9%',
      subscription: 'Premium',
      lastActive: '1 hour ago',
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      joinDate: '2023-11-20',
      status: 'Active',
      profitLoss: '+10.5%',
      subscription: 'Basic',
      lastActive: '3 hours ago',
    },
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'New Subscriber',
      message: 'John Doe has subscribed to your signal service',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Signal Performance Alert',
      message: 'EUR/USD signal hit stop loss level',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'New features have been added to your dashboard',
      time: '1 hour ago',
      read: true,
    },
    {
      id: 4,
      type: 'error',
      title: 'Failed Payment',
      message: 'Subscription payment failed for user Alice Smith',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 5,
      type: 'success',
      title: 'Signal Success',
      message: 'GBP/JPY signal reached take profit level',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 6,
      type: 'info',
      title: 'New Feature Available',
      message: 'Try out our new risk management tools',
      time: '5 hours ago',
      read: true,
    },
    {
      id: 7,
      type: 'warning',
      title: 'Subscription Expiring',
      message: '5 subscriber subscriptions ending in 3 days',
      time: '6 hours ago',
      read: true,
    },
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
          {/* Subscriber Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Subscriber Growth
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h4">+12.5%</Typography>
                </Box>
                <Typography color="text.secondary">
                  Month over month growth
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
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Subscribers
                </Typography>
                <Typography variant="h4">1,425</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Out of 1,580 total subscribers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Premium: 856" color="primary" />
                  <Chip label="Basic: 569" color="default" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Profit/Loss
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h4" color="success.main">
                    +16.8%
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  Across all subscribers
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ mt: 2 }}
                  color="success"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Subscriber List */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Subscriber Management
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search subscribers..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subscriber</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Subscription</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell>Profit/Loss</TableCell>
                      <TableCell>Last Active</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2 }}>{subscriber.name[0]}</Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {subscriber.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {subscriber.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={subscriber.status}
                            color={subscriber.status === 'Active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={subscriber.subscription}
                            color={subscriber.subscription === 'Premium' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{subscriber.joinDate}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {subscriber.profitLoss.startsWith('+') ? (
                              <TrendingUpIcon color="success" sx={{ mr: 0.5, fontSize: 16 }} />
                            ) : (
                              <TrendingDownIcon color="error" sx={{ mr: 0.5, fontSize: 16 }} />
                            )}
                            <Typography
                              color={subscriber.profitLoss.startsWith('+') ? 'success.main' : 'error.main'}
                            >
                              {subscriber.profitLoss}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{subscriber.lastActive}</TableCell>
                        <TableCell>
                          <IconButton size="small" title="Send Message">
                            <MailIcon />
                          </IconButton>
                          <IconButton size="small" color="error" title="Block Subscriber">
                            <BlockIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={100}
                page={0}
                onPageChange={() => {}}
                rowsPerPage={10}
                onRowsPerPageChange={() => {}}
              />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={4}>
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
                    label="Display Name"
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={4}
                    defaultValue="Professional forex trader with over 10 years of experience. Specialized in technical analysis and trend following strategies."
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

            {/* Signal Settings */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SignalIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Signal Settings</Typography>
              </Box>
              <FormGroup>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Default Signal Duration</InputLabel>
                      <Select defaultValue="24h" label="Default Signal Duration">
                        <MenuItem value="12h">12 Hours</MenuItem>
                        <MenuItem value="24h">24 Hours</MenuItem>
                        <MenuItem value="48h">48 Hours</MenuItem>
                        <MenuItem value="72h">72 Hours</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Risk Level</InputLabel>
                      <Select defaultValue="medium" label="Risk Level">
                        <MenuItem value="low">Low Risk</MenuItem>
                        <MenuItem value="medium">Medium Risk</MenuItem>
                        <MenuItem value="high">High Risk</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto-close signals after duration"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Include take profit and stop loss levels"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="contained" color="primary">
                        Save Signal Settings
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </FormGroup>
            </Paper>
          </Grid>

          {/* Subscription & Security Settings */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PaymentsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Subscription Settings</Typography>
              </Box>
              <FormGroup>
                <TextField
                  fullWidth
                  label="Monthly Subscription Price"
                  type="number"
                  defaultValue="29.99"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Offer annual subscription"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow trial period"
                />
                <TextField
                  fullWidth
                  label="Trial Period (days)"
                  type="number"
                  defaultValue="7"
                  sx={{ mt: 2 }}
                />
              </FormGroup>
            </Paper>

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
                  label="Email notifications for login attempts"
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

            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsSettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Notification Preferences</Typography>
              </Box>
              <FormGroup>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="New subscriber alerts"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Signal performance updates"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Subscription renewals"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Marketing updates"
                />
              </FormGroup>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Changes to advanced settings may require a system restart
                  </Alert>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Save All Settings
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                    >
                      Reset to Default
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          {/* Notification Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Unread Notifications
                </Typography>
                <Typography variant="h4">2</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Out of 7 total notifications
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(2 / 7) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
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
                    icon={<SuccessIcon />}
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
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: `${notification.type}.main`,
                          }}
                        >
                          {notification.type === 'success' && <SuccessIcon />}
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

export default SignalProviderPortal;


