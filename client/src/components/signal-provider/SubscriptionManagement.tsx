import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Badge,
  LinearProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  Star,
  StarBorder,
  MoreVert,
  CheckCircle,
  Cancel,
  Refresh,
  CreditCard,
  History,
  Settings,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';
import { format, addMonths, isAfter } from 'date-fns';

// Mock subscription plans
const subscriptionPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 29.99,
    features: [
      'Access to basic signals',
      'Daily market updates',
      'Standard support',
    ],
    recommended: false,
  },
  {
    id: 2,
    name: 'Pro',
    price: 59.99,
    features: [
      'Access to all signals',
      'Real-time notifications',
      'Performance analytics',
      'Priority support',
    ],
    recommended: true,
  },
  {
    id: 3,
    name: 'Premium',
    price: 99.99,
    features: [
      'Access to all signals',
      'Real-time notifications',
      'Advanced performance analytics',
      'One-on-one strategy sessions',
      'VIP support',
      'Custom risk management',
    ],
    recommended: false,
  },
];

// Mock active subscriptions
const mockActiveSubscriptions = [
  {
    id: 1,
    providerId: 1,
    providerName: 'Alpha Signals',
    providerAvatar: 'A',
    plan: 'Pro',
    startDate: '2025-03-15T00:00:00Z',
    endDate: '2025-06-15T00:00:00Z',
    autoRenew: true,
    price: 59.99,
    status: 'active',
    notifications: true,
  },
  {
    id: 2,
    providerId: 3,
    providerName: 'FX Masters',
    providerAvatar: 'F',
    plan: 'Basic',
    startDate: '2025-04-01T00:00:00Z',
    endDate: '2025-05-01T00:00:00Z',
    autoRenew: false,
    price: 29.99,
    status: 'expiring',
    notifications: true,
  },
];

// Mock subscription history
const mockSubscriptionHistory = [
  {
    id: 101,
    providerId: 2,
    providerName: 'Trend Traders',
    providerAvatar: 'T',
    plan: 'Premium',
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2025-01-01T00:00:00Z',
    price: 99.99,
    status: 'expired',
  },
  {
    id: 102,
    providerId: 4,
    providerName: 'Swing Signals',
    providerAvatar: 'S',
    plan: 'Basic',
    startDate: '2024-11-15T00:00:00Z',
    endDate: '2024-12-15T00:00:00Z',
    price: 29.99,
    status: 'cancelled',
  },
];

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`subscription-tabpanel-${index}`}
      aria-labelledby={`subscription-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const SubscriptionManagement = observer(() => {
  const { signalProviderStore } = useStores();
  
  // State for active subscriptions and history
  const [activeSubscriptions, setActiveSubscriptions] = useState(mockActiveSubscriptions);
  const [subscriptionHistory, setSubscriptionHistory] = useState(mockSubscriptionHistory);
  const [tabValue, setTabValue] = useState(0);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle open upgrade dialog
  const handleOpenUpgradeDialog = (subscription: any) => {
    setSelectedSubscription(subscription);
    setUpgradeDialogOpen(true);
  };
  
  // Handle close upgrade dialog
  const handleCloseUpgradeDialog = () => {
    setUpgradeDialogOpen(false);
    setSelectedSubscription(null);
  };
  
  // Handle open cancel dialog
  const handleOpenCancelDialog = (subscription: any) => {
    setSelectedSubscription(subscription);
    setCancelDialogOpen(true);
  };
  
  // Handle close cancel dialog
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedSubscription(null);
  };
  
  // Handle confirm cancel
  const handleConfirmCancel = () => {
    if (selectedSubscription) {
      // Update active subscriptions
      setActiveSubscriptions(activeSubscriptions.filter(sub => sub.id !== selectedSubscription.id));
      
      // Add to history
      setSubscriptionHistory([
        {
          ...selectedSubscription,
          id: Date.now(),
          status: 'cancelled',
          endDate: new Date().toISOString(),
        },
        ...subscriptionHistory,
      ]);
      
      handleCloseCancelDialog();
    }
  };
  
  // Handle open renew dialog
  const handleOpenRenewDialog = (subscription: any) => {
    setSelectedSubscription(subscription);
    setRenewDialogOpen(true);
  };
  
  // Handle close renew dialog
  const handleCloseRenewDialog = () => {
    setRenewDialogOpen(false);
    setSelectedSubscription(null);
  };
  
  // Handle confirm renew
  const handleConfirmRenew = () => {
    if (selectedSubscription) {
      // Update subscription
      setActiveSubscriptions(
        activeSubscriptions.map(sub => 
          sub.id === selectedSubscription.id
            ? {
                ...sub,
                endDate: addMonths(new Date(sub.endDate), 1).toISOString(),
                status: 'active',
                autoRenew: true,
              }
            : sub
        )
      );
      
      handleCloseRenewDialog();
    }
  };
  
  // Handle toggle auto renew
  const handleToggleAutoRenew = (subscriptionId: number, newValue: boolean) => {
    setActiveSubscriptions(
      activeSubscriptions.map(sub => 
        sub.id === subscriptionId
          ? { ...sub, autoRenew: newValue }
          : sub
      )
    );
  };
  
  // Handle toggle notifications
  const handleToggleNotifications = (subscriptionId: number, newValue: boolean) => {
    setActiveSubscriptions(
      activeSubscriptions.map(sub => 
        sub.id === subscriptionId
          ? { ...sub, notifications: newValue }
          : sub
      )
    );
  };
  
  // Calculate days remaining for subscription
  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get subscription status text and color
  const getStatusInfo = (subscription: any) => {
    const daysRemaining = calculateDaysRemaining(subscription.endDate);
    
    if (subscription.status === 'active' && daysRemaining > 7) {
      return { text: 'Active', color: 'success' };
    } else if (subscription.status === 'active' && daysRemaining <= 7) {
      return { text: `Expires in ${daysRemaining} days`, color: 'warning' };
    } else if (subscription.status === 'expiring') {
      return { text: `Expires in ${daysRemaining} days`, color: 'warning' };
    } else if (subscription.status === 'expired') {
      return { text: 'Expired', color: 'error' };
    } else if (subscription.status === 'cancelled') {
      return { text: 'Cancelled', color: 'error' };
    }
    
    return { text: subscription.status, color: 'default' };
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Subscription Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your signal provider subscriptions, view billing history, and update your preferences.
        </Typography>
      </Box>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="subscription tabs">
          <Tab label="Active Subscriptions" />
          <Tab label="Subscription History" />
          <Tab label="Available Plans" />
        </Tabs>
      </Box>
      
      {/* Active Subscriptions Tab */}
      <TabPanel value={tabValue} index={0}>
        {activeSubscriptions.length > 0 ? (
          <Grid container spacing={3}>
            {activeSubscriptions.map((subscription) => {
              const daysRemaining = calculateDaysRemaining(subscription.endDate);
              const percentRemaining = Math.max(
                0,
                Math.min(
                  100,
                  (daysRemaining / 30) * 100
                )
              );
              const statusInfo = getStatusInfo(subscription);
              
              return (
                <Grid item xs={12} md={6} key={subscription.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 48,
                              height: 48,
                              mr: 2,
                            }}
                          >
                            {subscription.providerAvatar}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {subscription.providerName}
                            </Typography>
                            <Chip
                              label={subscription.plan}
                              color="primary"
                              size="small"
                            />
                          </Box>
                        </Box>
                        <Chip
                          label={statusInfo.text}
                          color={statusInfo.color as any}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Subscription Period
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(subscription.startDate), 'MMM d, yyyy')} - {format(new Date(subscription.endDate), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Time Remaining
                          </Typography>
                          <Typography variant="body2">
                            {daysRemaining} days
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentRemaining}
                          color={daysRemaining <= 7 ? "warning" : "primary"}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={subscription.autoRenew}
                              onChange={(e) => handleToggleAutoRenew(subscription.id, e.target.checked)}
                            />
                          }
                          label="Auto-renew"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={subscription.notifications}
                              onChange={(e) => handleToggleNotifications(subscription.id, e.target.checked)}
                            />
                          }
                          label="Notifications"
                        />
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          ${subscription.price}/mo
                        </Typography>
                        <Box>
                          {subscription.status === 'expiring' && !subscription.autoRenew && (
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => handleOpenRenewDialog(subscription)}
                              sx={{ mr: 1 }}
                            >
                              Renew
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleOpenUpgradeDialog(subscription)}
                            sx={{ mr: 1 }}
                          >
                            Upgrade
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOpenCancelDialog(subscription)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You don't have any active subscriptions.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setTabValue(2)}
              sx={{ mt: 2 }}
            >
              Browse Available Plans
            </Button>
          </Box>
        )}
      </TabPanel>
      
      {/* Subscription History Tab */}
      <TabPanel value={tabValue} index={1}>
        {subscriptionHistory.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Provider</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptionHistory.map((subscription) => {
                  const statusInfo = getStatusInfo(subscription);
                  
                  return (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 32,
                              height: 32,
                              mr: 1,
                            }}
                          >
                            {subscription.providerAvatar}
                          </Avatar>
                          <Typography variant="body2">
                            {subscription.providerName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>
                        {format(new Date(subscription.startDate), 'MMM d, yyyy')} - {format(new Date(subscription.endDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>${subscription.price}/mo</TableCell>
                      <TableCell>
                        <Chip
                          label={statusInfo.text}
                          color={statusInfo.color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                        >
                          Resubscribe
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You don't have any subscription history.
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      {/* Available Plans Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {subscriptionPlans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.recommended ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                }}
              >
                {plan.recommended && (
                  <Chip
                    label="Recommended"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 16,
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ${plan.price}
                    <Typography variant="caption" color="text.secondary">
                      /month
                    </Typography>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    {plan.features.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    variant={plan.recommended ? "contained" : "outlined"}
                    color="primary"
                    fullWidth
                  >
                    Select Plan
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      
      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onClose={handleCloseUpgradeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upgrade Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are currently subscribed to the <strong>{selectedSubscription?.plan}</strong> plan for <strong>{selectedSubscription?.providerName}</strong>.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Would you like to upgrade to a higher tier plan?
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {subscriptionPlans
              .filter(plan => 
                (selectedSubscription?.plan === 'Basic' && (plan.name === 'Pro' || plan.name === 'Premium')) ||
                (selectedSubscription?.plan === 'Pro' && plan.name === 'Premium')
              )
              .map(plan => (
                <Grid item xs={12} key={plan.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {plan.name} Plan
                      </Typography>
                      <Typography variant="h5" color="primary" gutterBottom>
                        ${plan.price}/month
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {plan.features.map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">{feature}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Button variant="contained" color="primary" fullWidth>
                        Upgrade to {plan.name}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpgradeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog} maxWidth="sm">
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel your subscription to <strong>{selectedSubscription?.providerName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Your subscription will remain active until {selectedSubscription ? format(new Date(selectedSubscription.endDate), 'MMMM d, yyyy') : ''}.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            After cancellation, you will lose access to all signals and features provided by this provider.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Keep Subscription</Button>
          <Button onClick={handleConfirmCancel} color="error">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Renew Dialog */}
      <Dialog open={renewDialogOpen} onClose={handleCloseRenewDialog} maxWidth="sm">
        <DialogTitle>Renew Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Would you like to renew your subscription to <strong>{selectedSubscription?.providerName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Your subscription will be extended for another month at ${selectedSubscription?.price}.
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={selectedSubscription?.autoRenew || false}
                onChange={(e) => {
                  if (selectedSubscription) {
                    setSelectedSubscription({
                      ...selectedSubscription,
                      autoRenew: e.target.checked,
                    });
                  }
                }}
              />
            }
            label="Enable auto-renewal for future billing cycles"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenewDialog}>Cancel</Button>
          <Button onClick={handleConfirmRenew} color="primary" variant="contained">
            Renew Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default SubscriptionManagement;
