// SubscriptionPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  CreditCard as CreditCardIcon,
  Autorenew as AutorenewIcon,
  CalendarToday as CalendarTodayIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useStores } from '../stores/storeProviderJs';

export const SubscriptionPage = observer(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { subscriptionService } = useStores();
  
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  
  // Get subscription tiers
  const tiers = subscriptionService.getTiers();
  
  // Load current subscription
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const subscription = await subscriptionService.getCurrentSubscription();
        setCurrentSubscription(subscription);
      } catch (err) {
        console.error('Failed to load subscription:', err);
        setError('Failed to load your current subscription. Please try again later.');
      }
    };
    
    loadSubscription();
  }, [subscriptionService]);
  
  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Calculate yearly price (20% discount)
  const getYearlyPrice = (monthlyPrice) => {
    const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
    return formatPrice(yearlyPrice);
  };
  
  // Handle subscription
  const handleSubscribe = async (tierId) => {
    setSelectedTier(tierId);
    setConfirmDialogOpen(true);
  };
  
  // Confirm subscription
  const confirmSubscription = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await subscriptionService.subscribe(selectedTier);
      if (result) {
        setSuccess(`Successfully subscribed to the ${tiers.find(t => t.id === selectedTier).name} plan!`);
        const subscription = await subscriptionService.getCurrentSubscription();
        setCurrentSubscription(subscription);
      } else {
        setError('Failed to process your subscription. Please try again later.');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('An error occurred while processing your subscription. Please try again later.');
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };
  
  // Cancel subscription
  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await subscriptionService.cancelSubscription();
      if (result) {
        setSuccess('Your subscription has been cancelled. You will still have access until the end of your billing period.');
        const subscription = await subscriptionService.getCurrentSubscription();
        setCurrentSubscription(subscription);
      } else {
        setError('Failed to cancel your subscription. Please try again later.');
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      setError('An error occurred while cancelling your subscription. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle billing period
  const toggleBillingPeriod = () => {
    setYearlyBilling(!yearlyBilling);
  };
  
  // Get feature icon
  const getFeatureIcon = (included) => {
    return included 
      ? React.createElement(CheckCircleIcon, { color: 'success' })
      : React.createElement(CancelIcon, { color: 'disabled' });
  };
  
  // Get subscription status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return React.createElement(Chip, { 
          label: 'Active', 
          color: 'success',
          icon: React.createElement(CheckCircleIcon)
        });
      case 'cancelled':
        return React.createElement(Chip, { 
          label: 'Cancelled', 
          color: 'warning',
          icon: React.createElement(CancelIcon)
        });
      case 'expired':
        return React.createElement(Chip, { 
          label: 'Expired', 
          color: 'error',
          icon: React.createElement(CancelIcon)
        });
      default:
        return React.createElement(Chip, { 
          label: 'Unknown', 
          color: 'default' 
        });
    }
  };
  
  // Render subscription plans
  const renderSubscriptionPlans = () => {
    return React.createElement(
      Box,
      { sx: { mb: 6 } },
      [
        // Billing toggle
        React.createElement(
          Box,
          { 
            sx: { 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 4 
            } 
          },
          [
            React.createElement(
              Typography,
              { variant: 'body1' },
              'Monthly'
            ),
            React.createElement(
              FormControlLabel,
              {
                control: React.createElement(Switch, {
                  checked: yearlyBilling,
                  onChange: toggleBillingPeriod,
                  color: 'primary'
                }),
                label: '',
                sx: { mx: 1 }
              }
            ),
            React.createElement(
              Box,
              { sx: { display: 'flex', alignItems: 'center' } },
              [
                React.createElement(
                  Typography,
                  { variant: 'body1', mr: 1 },
                  'Yearly'
                ),
                React.createElement(
                  Chip,
                  { 
                    label: 'Save 20%', 
                    color: 'success',
                    size: 'small'
                  }
                )
              ]
            )
          ]
        ),
        
        // Subscription tiers
        React.createElement(
          Grid,
          { container: true, spacing: 3 },
          tiers.map((tier) =>
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 4, key: tier.id },
              React.createElement(
                Card,
                { 
                  elevation: tier.recommended ? 8 : 2,
                  sx: { 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[tier.recommended ? 12 : 6]
                    },
                    border: tier.recommended ? `2px solid ${theme.palette.primary.main}` : 'none'
                  } 
                },
                [
                  // Recommended badge
                  tier.recommended && React.createElement(
                    Box,
                    {
                      sx: {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        py: 0.5,
                        px: 2,
                        borderBottomLeftRadius: 8
                      }
                    },
                    React.createElement(
                      Typography,
                      { variant: 'caption', fontWeight: 'bold' },
                      'RECOMMENDED'
                    )
                  ),
                  
                  React.createElement(
                    CardContent,
                    { sx: { flexGrow: 1 } },
                    [
                      React.createElement(
                        Typography,
                        { 
                          key: `tier-name-${tier.id}`,
                          variant: 'h5', 
                          gutterBottom: true, 
                          align: 'center', 
                          fontWeight: 'bold',
                          color: tier.recommended ? 'primary.main' : 'inherit'
                        },
                        tier.name
                      ),
                      React.createElement(
                        Box,
                        { sx: { textAlign: 'center', mb: 3 } },
                        [
                          React.createElement(
                            Typography,
                            { 
                              key: `tier-price-${tier.id}`,
                              variant: 'h3', 
                              fontWeight: 'bold',
                              color: 'text.primary'
                            },
                            yearlyBilling 
                              ? getYearlyPrice(tier.price)
                              : formatPrice(tier.price)
                          ),
                          React.createElement(
                            Typography,
                            { 
                              key: `tier-period-${tier.id}`,
                              color: 'text.secondary',
                              variant: 'subtitle1'
                            },
                            yearlyBilling ? 'per year' : 'per month'
                          ),
                        ]
                      ),
                      React.createElement(
                        Divider,
                        { sx: { my: 2 } }
                      ),
                      React.createElement(
                        List,
                        { dense: true },
                        tier.features.map((feature, index) =>
                          React.createElement(
                            ListItem,
                            { 
                              key: `feature-${tier.id}-${index}`,
                              disableGutters: true,
                              sx: { py: 0.5 }
                            },
                            [
                              React.createElement(
                                ListItemIcon,
                                { sx: { minWidth: 36 } },
                                getFeatureIcon(feature.included)
                              ),
                              React.createElement(
                                ListItemText,
                                { 
                                  primary: feature.name,
                                  secondary: feature.description,
                                  primaryTypographyProps: {
                                    variant: 'body2',
                                    fontWeight: feature.included ? 'medium' : 'regular'
                                  },
                                  secondaryTypographyProps: {
                                    variant: 'caption'
                                  }
                                }
                              )
                            ]
                          )
                        )
                      )
                    ]
                  ),
                  React.createElement(
                    CardActions,
                    { sx: { p: 2, pt: 0 } },
                    React.createElement(
                      Button,
                      {
                        variant: tier.recommended ? 'contained' : 'outlined',
                        size: 'large',
                        fullWidth: true,
                        color: tier.recommended ? 'primary' : 'inherit',
                        onClick: () => handleSubscribe(tier.id),
                        endIcon: React.createElement(ArrowForwardIcon),
                        disabled: loading || (currentSubscription && currentSubscription.tierId === tier.id && currentSubscription.status === 'active')
                      },
                      currentSubscription && currentSubscription.tierId === tier.id && currentSubscription.status === 'active'
                        ? 'Current Plan'
                        : 'Subscribe'
                    )
                  )
                ]
              )
            )
          )
        )
      ]
    );
  };
  
  // Render current subscription
  const renderCurrentSubscription = () => {
    if (!currentSubscription) {
      return React.createElement(
        Paper,
        { sx: { p: 3, textAlign: 'center' } },
        React.createElement(
          Typography,
          { variant: 'body1', color: 'text.secondary' },
          'You don\'t have an active subscription yet. Choose a plan above to get started.'
        )
      );
    }
    
    const tier = tiers.find(t => t.id === currentSubscription.tierId);
    
    if (!tier) {
      return React.createElement(
        Alert,
        { severity: 'error', sx: { mt: 2 } },
        'Unable to load subscription details. Please contact support.'
      );
    }
    
    return React.createElement(
      Paper,
      { 
        sx: { 
          p: 3,
          borderRadius: 2,
          boxShadow: 3
        } 
      },
      [
        React.createElement(
          Grid,
          { container: true, spacing: 3 },
          [
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              [
                React.createElement(
                  Box,
                  { sx: { display: 'flex', alignItems: 'center', mb: 2 } },
                  [
                    React.createElement(
                      Typography,
                      { variant: 'h5', fontWeight: 'bold', mr: 2 },
                      `${tier.name} Plan`
                    ),
                    getStatusChip(currentSubscription.status)
                  ]
                ),
                React.createElement(
                  Stack,
                  { spacing: 2 },
                  [
                    React.createElement(
                      Box,
                      { sx: { display: 'flex', alignItems: 'center' } },
                      [
                        React.createElement(
                          CreditCardIcon,
                          { color: 'primary', sx: { mr: 1 } }
                        ),
                        React.createElement(
                          Typography,
                          { variant: 'body1' },
                          `Billing: ${formatPrice(tier.price)} per month`
                        )
                      ]
                    ),
                    React.createElement(
                      Box,
                      { sx: { display: 'flex', alignItems: 'center' } },
                      [
                        React.createElement(
                          CalendarTodayIcon,
                          { color: 'primary', sx: { mr: 1 } }
                        ),
                        React.createElement(
                          Typography,
                          { variant: 'body1' },
                          `Next billing date: ${new Date(currentSubscription.endDate).toLocaleDateString()}`
                        )
                      ]
                    ),
                    React.createElement(
                      Box,
                      { sx: { display: 'flex', alignItems: 'center' } },
                      [
                        React.createElement(
                          AutorenewIcon,
                          { color: currentSubscription.autoRenew ? 'success' : 'disabled', sx: { mr: 1 } }
                        ),
                        React.createElement(
                          Typography,
                          { variant: 'body1' },
                          `Auto-renew: ${currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}`
                        )
                      ]
                    )
                  ]
                ),
                React.createElement(
                  Box,
                  { sx: { mt: 3 } },
                  currentSubscription.status === 'active' && React.createElement(
                    Button,
                    {
                      variant: 'outlined',
                      color: 'error',
                      onClick: handleCancelSubscription,
                      disabled: loading || currentSubscription.status !== 'active'
                    },
                    'Cancel Subscription'
                  )
                )
              ]
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              [
                React.createElement(
                  Typography,
                  { variant: 'h6', gutterBottom: true },
                  'Your Plan Features'
                ),
                React.createElement(
                  List,
                  { dense: true },
                  tier.features.filter(f => f.included).map((feature, index) =>
                    React.createElement(
                      ListItem,
                      { 
                        key: `current-feature-${index}`,
                        disableGutters: true
                      },
                      [
                        React.createElement(
                          ListItemIcon,
                          { sx: { minWidth: 36 } },
                          React.createElement(CheckCircleIcon, { color: 'success' })
                        ),
                        React.createElement(
                          ListItemText,
                          { 
                            primary: feature.name,
                            secondary: feature.description
                          }
                        )
                      ]
                    )
                  )
                )
              ]
            )
          ]
        )
      ]
    );
  };
  
  // Render confirmation dialog
  const renderConfirmDialog = () => {
    const tier = tiers.find(t => t.id === selectedTier);
    
    if (!tier) return null;
    
    return React.createElement(
      Dialog,
      {
        open: confirmDialogOpen,
        onClose: () => setConfirmDialogOpen(false)
      },
      [
        React.createElement(
          DialogTitle,
          {},
          `Confirm ${tier.name} Subscription`
        ),
        React.createElement(
          DialogContent,
          {},
          [
            React.createElement(
              DialogContentText,
              {},
              `You are about to subscribe to the ${tier.name} plan for ${yearlyBilling ? getYearlyPrice(tier.price) + ' per year' : formatPrice(tier.price) + ' per month'}. Would you like to proceed?`
            ),
            React.createElement(
              Box,
              { sx: { mt: 2 } },
              React.createElement(
                Typography,
                { variant: 'caption', color: 'text.secondary' },
                'Your payment method on file will be charged. You can cancel anytime.'
              )
            )
          ]
        ),
        React.createElement(
          DialogActions,
          {},
          [
            React.createElement(
              Button,
              {
                onClick: () => setConfirmDialogOpen(false),
                disabled: loading
              },
              'Cancel'
            ),
            React.createElement(
              Button,
              {
                onClick: confirmSubscription,
                variant: 'contained',
                color: 'primary',
                disabled: loading,
                startIcon: loading ? React.createElement(CircularProgress, { size: 20 }) : null
              },
              loading ? 'Processing...' : 'Confirm'
            )
          ]
        )
      ]
    );
  };
  
  return React.createElement(
    Box,
    { 
      sx: { 
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: 'auto'
      } 
    },
    [
      // Page header
      React.createElement(
        Box,
        { sx: { mb: 5, textAlign: 'center' } },
        [
          React.createElement(
            Typography,
            { variant: 'h4', gutterBottom: true, fontWeight: 'bold' },
            'Choose Your Subscription Plan'
          ),
          React.createElement(
            Typography,
            { variant: 'subtitle1', color: 'text.secondary', maxWidth: 700, mx: 'auto' },
            'Unlock the full potential of Algo360FX with our subscription plans. Choose the plan that best fits your trading needs and take your trading to the next level.'
          )
        ]
      ),
      
      // Status alerts
      error && React.createElement(
        Alert,
        { severity: 'error', sx: { mb: 3 }, onClose: () => setError(null) },
        error
      ),
      
      success && React.createElement(
        Alert,
        { severity: 'success', sx: { mb: 3 }, onClose: () => setSuccess(null) },
        success
      ),
      
      // Subscription plans
      renderSubscriptionPlans(),
      
      // Current subscription section
      React.createElement(
        Box,
        { sx: { mt: 6 } },
        [
          React.createElement(
            Typography,
            { variant: 'h5', gutterBottom: true, fontWeight: 'bold', mb: 3 },
            'Your Current Subscription'
          ),
          renderCurrentSubscription()
        ]
      ),
      
      // Confirmation dialog
      renderConfirmDialog(),
      
      // FAQ section
      React.createElement(
        Box,
        { sx: { mt: 8, textAlign: 'center' } },
        [
          React.createElement(
            Typography,
            { variant: 'h5', gutterBottom: true, fontWeight: 'bold' },
            'Frequently Asked Questions'
          ),
          React.createElement(
            Grid,
            { container: true, spacing: 3, sx: { mt: 2 } },
            [
              React.createElement(
                Grid,
                { item: true, xs: 12, md: 6 },
                React.createElement(
                  Paper,
                  { sx: { p: 3, height: '100%' } },
                  [
                    React.createElement(
                      Typography,
                      { variant: 'h6', gutterBottom: true },
                      'How do I change my subscription?'
                    ),
                    React.createElement(
                      Typography,
                      { variant: 'body2', color: 'text.secondary' },
                      'You can upgrade your subscription at any time. Simply select the new plan you want and confirm the change. Downgrades will take effect at the end of your current billing period.'
                    )
                  ]
                )
              ),
              React.createElement(
                Grid,
                { item: true, xs: 12, md: 6 },
                React.createElement(
                  Paper,
                  { sx: { p: 3, height: '100%' } },
                  [
                    React.createElement(
                      Typography,
                      { variant: 'h6', gutterBottom: true },
                      'What happens when I cancel?'
                    ),
                    React.createElement(
                      Typography,
                      { variant: 'body2', color: 'text.secondary' },
                      'When you cancel your subscription, you\'ll continue to have access to your plan features until the end of your current billing period. After that, your account will revert to the free tier.'
                    )
                  ]
                )
              )
            ]
          )
        ]
      )
    ]
  );
});

export default SubscriptionPage;
