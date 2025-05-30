// ComparisonPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CompareArrows as CompareArrowsIcon,
  School as SchoolIcon,
  Memory as MemoryIcon,
  Psychology as AIIcon,
  Business as PortalIcon,
  Subscriptions as SubscriptionIcon,
} from '@mui/icons-material';
import { useStores } from '../stores/storeProviderJs';

// Mock data for different comparison sections
const comparisonData = {
  // Subscription tiers
  subscription: {
    title: 'Subscription Plans',
    icon: React.createElement(SubscriptionIcon),
    items: [
      {
        id: 'basic',
        name: 'Basic',
        price: 0.00,
        features: [
          { id: 'basic-trading', name: 'Basic Trading Features', included: true },
          { id: 'market-data', name: 'Real-time Market Data', included: true },
          { id: 'basic-analysis', name: 'Basic Technical Analysis', included: true },
          { id: 'portfolio', name: 'Portfolio Management', included: true },
          { id: 'ai-basic', name: 'Basic AI Analysis', included: true },
          { id: 'support', name: 'Email Support', included: true },
        ],
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 99.99,
        recommended: true,
        features: [
          { id: 'advanced-trading', name: 'Advanced Trading Features', included: true },
          { id: 'premium-data', name: 'Premium Market Data', included: true },
          { id: 'advanced-analysis', name: 'Advanced Technical Analysis', included: true },
          { id: 'portfolio-pro', name: 'Advanced Portfolio Tools', included: true },
          { id: 'ai-pro', name: 'Advanced AI Analysis', included: true },
          { id: 'priority-support', name: 'Priority Support', included: true },
          { id: 'api-access', name: 'API Access', included: true },
          { id: 'custom-alerts', name: 'Custom Alerts', included: true },
        ],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 299.99,
        features: [
          { id: 'enterprise-trading', name: 'Enterprise Trading Suite', included: true },
          { id: 'enterprise-data', name: 'Enterprise Market Data', included: true },
          { id: 'enterprise-analysis', name: 'Enterprise Analysis Tools', included: true },
          { id: 'portfolio-enterprise', name: 'Enterprise Portfolio Management', included: true },
          { id: 'ai-enterprise', name: 'Enterprise AI Solutions', included: true },
          { id: 'dedicated-support', name: 'Dedicated Support Team', included: true },
          { id: 'white-label', name: 'White Label Solutions', included: true },
          { id: 'custom-integration', name: 'Custom Integrations', included: true },
          { id: 'advanced-security', name: 'Advanced Security', included: true },
        ],
      },
    ]
  },
  
  // Mining plans
  mining: {
    title: 'Mining Plans',
    icon: React.createElement(MemoryIcon),
    items: [
      {
        id: 'starter',
        name: 'Starter Mining',
        price: 49.99,
        features: [
          { id: 'basic-hashrate', name: 'Basic Hashrate (10 TH/s)', included: true },
          { id: 'single-algorithm', name: 'Single Algorithm Support', included: true },
          { id: 'daily-payouts', name: 'Daily Payouts', included: true },
          { id: 'basic-monitoring', name: 'Basic Monitoring Tools', included: true },
          { id: 'email-alerts', name: 'Email Alerts', included: true },
          { id: 'standard-support', name: 'Standard Support', included: true },
        ],
      },
      {
        id: 'advanced',
        name: 'Advanced Mining',
        price: 149.99,
        recommended: true,
        features: [
          { id: 'medium-hashrate', name: 'Medium Hashrate (50 TH/s)', included: true },
          { id: 'multi-algorithm', name: 'Multi-Algorithm Support', included: true },
          { id: 'hourly-payouts', name: 'Hourly Payouts', included: true },
          { id: 'advanced-monitoring', name: 'Advanced Monitoring Tools', included: true },
          { id: 'sms-alerts', name: 'SMS & Email Alerts', included: true },
          { id: 'priority-support', name: 'Priority Support', included: true },
          { id: 'profit-switching', name: 'Automatic Profit Switching', included: true },
          { id: 'performance-analytics', name: 'Performance Analytics', included: true },
        ],
      },
      {
        id: 'professional',
        name: 'Professional Mining',
        price: 399.99,
        features: [
          { id: 'high-hashrate', name: 'High Hashrate (200 TH/s)', included: true },
          { id: 'all-algorithms', name: 'All Algorithm Support', included: true },
          { id: 'instant-payouts', name: 'Instant Payouts', included: true },
          { id: 'enterprise-monitoring', name: 'Enterprise Monitoring Suite', included: true },
          { id: 'all-alerts', name: 'Comprehensive Alert System', included: true },
          { id: 'dedicated-support', name: 'Dedicated Support Team', included: true },
          { id: 'custom-optimization', name: 'Custom Mining Optimization', included: true },
          { id: 'advanced-analytics', name: 'Advanced Analytics & Reporting', included: true },
          { id: 'api-access', name: 'Full API Access', included: true },
        ],
      },
    ]
  },
  
  // Education plans
  education: {
    title: 'Education Plans',
    icon: React.createElement(SchoolIcon),
    items: [
      {
        id: 'beginner',
        name: 'Beginner Trader',
        price: 0.00,
        features: [
          { id: 'basic-courses', name: 'Basic Trading Courses', included: true },
          { id: 'market-fundamentals', name: 'Market Fundamentals', included: true },
          { id: 'beginner-webinars', name: 'Beginner Webinars', included: true },
          { id: 'community-forum', name: 'Community Forum Access', included: true },
          { id: 'basic-tutorials', name: 'Basic Video Tutorials', included: true },
          { id: 'weekly-newsletter', name: 'Weekly Newsletter', included: true },
        ],
      },
      {
        id: 'intermediate',
        name: 'Intermediate Trader',
        price: 79.99,
        recommended: true,
        features: [
          { id: 'advanced-courses', name: 'Advanced Trading Courses', included: true },
          { id: 'technical-analysis', name: 'Technical Analysis Training', included: true },
          { id: 'live-webinars', name: 'Live Weekly Webinars', included: true },
          { id: 'mentorship-basic', name: 'Basic Mentorship Program', included: true },
          { id: 'strategy-guides', name: 'Trading Strategy Guides', included: true },
          { id: 'practice-accounts', name: 'Practice Trading Accounts', included: true },
          { id: 'market-insights', name: 'Market Insights Reports', included: true },
          { id: 'certification', name: 'Trading Certification', included: true },
        ],
      },
      {
        id: 'expert',
        name: 'Expert Trader',
        price: 199.99,
        features: [
          { id: 'master-courses', name: 'Master Trading Curriculum', included: true },
          { id: 'advanced-analysis', name: 'Advanced Analysis Techniques', included: true },
          { id: 'private-webinars', name: 'Private Webinar Sessions', included: true },
          { id: 'one-on-one', name: '1-on-1 Mentorship', included: true },
          { id: 'proprietary-strategies', name: 'Proprietary Trading Strategies', included: true },
          { id: 'live-trading', name: 'Live Trading Sessions', included: true },
          { id: 'institutional-insights', name: 'Institutional Market Insights', included: true },
          { id: 'networking-events', name: 'Professional Networking Events', included: true },
          { id: 'career-guidance', name: 'Trading Career Guidance', included: true },
        ],
      },
    ]
  },
  
  // Portal plans
  portal: {
    title: 'Portal Access',
    icon: React.createElement(PortalIcon),
    items: [
      {
        id: 'individual',
        name: 'Individual Portal',
        price: 29.99,
        features: [
          { id: 'basic-dashboard', name: 'Basic Dashboard', included: true },
          { id: 'single-user', name: 'Single User Access', included: true },
          { id: 'market-data', name: 'Standard Market Data', included: true },
          { id: 'basic-reports', name: 'Basic Reporting', included: true },
          { id: 'email-support', name: 'Email Support', included: true },
          { id: 'mobile-access', name: 'Mobile Access', included: true },
        ],
      },
      {
        id: 'business',
        name: 'Business Portal',
        price: 149.99,
        recommended: true,
        features: [
          { id: 'advanced-dashboard', name: 'Advanced Dashboard', included: true },
          { id: 'multi-user', name: 'Multi-User Access (5 Users)', included: true },
          { id: 'premium-data', name: 'Premium Market Data', included: true },
          { id: 'advanced-reports', name: 'Advanced Reporting & Analytics', included: true },
          { id: 'priority-support', name: 'Priority Support', included: true },
          { id: 'api-access', name: 'API Access', included: true },
          { id: 'custom-alerts', name: 'Custom Alerts & Notifications', included: true },
          { id: 'team-collaboration', name: 'Team Collaboration Tools', included: true },
        ],
      },
      {
        id: 'enterprise',
        name: 'Enterprise Portal',
        price: 499.99,
        features: [
          { id: 'enterprise-dashboard', name: 'Enterprise Dashboard', included: true },
          { id: 'unlimited-users', name: 'Unlimited User Access', included: true },
          { id: 'institutional-data', name: 'Institutional-Grade Data', included: true },
          { id: 'custom-reports', name: 'Custom Reporting Solutions', included: true },
          { id: 'dedicated-support', name: 'Dedicated Account Manager', included: true },
          { id: 'full-api', name: 'Full API Integration', included: true },
          { id: 'white-label', name: 'White Label Options', included: true },
          { id: 'advanced-security', name: 'Advanced Security Features', included: true },
          { id: 'data-export', name: 'Data Export & Integration', included: true },
        ],
      },
    ]
  },
  
  // AI plans
  ai: {
    title: 'AI Assistant Plans',
    icon: React.createElement(AIIcon),
    items: [
      {
        id: 'basic-ai',
        name: 'Basic AI',
        price: 0.00,
        features: [
          { id: 'market-insights', name: 'Basic Market Insights', included: true },
          { id: 'simple-analysis', name: 'Simple Technical Analysis', included: true },
          { id: 'daily-tips', name: 'Daily Trading Tips', included: true },
          { id: 'news-summaries', name: 'News Summaries', included: true },
          { id: 'limited-queries', name: 'Limited Queries (50/day)', included: true },
          { id: 'standard-model', name: 'Standard AI Model', included: true },
        ],
      },
      {
        id: 'advanced-ai',
        name: 'Advanced AI',
        price: 59.99,
        recommended: true,
        features: [
          { id: 'advanced-insights', name: 'Advanced Market Insights', included: true },
          { id: 'full-technical', name: 'Full Technical Analysis', included: true },
          { id: 'strategy-suggestions', name: 'Trading Strategy Suggestions', included: true },
          { id: 'real-time-analysis', name: 'Real-time News Analysis', included: true },
          { id: 'unlimited-queries', name: 'Unlimited Queries', included: true },
          { id: 'advanced-model', name: 'Advanced AI Model (GPT-4)', included: true },
          { id: 'portfolio-analysis', name: 'Portfolio Analysis', included: true },
          { id: 'custom-alerts', name: 'Custom AI Alerts', included: true },
        ],
      },
      {
        id: 'premium-ai',
        name: 'Premium AI',
        price: 129.99,
        features: [
          { id: 'premium-insights', name: 'Premium Market Insights', included: true },
          { id: 'predictive-analysis', name: 'Predictive Analysis', included: true },
          { id: 'custom-strategies', name: 'Custom Trading Strategies', included: true },
          { id: 'sentiment-analysis', name: 'Advanced Sentiment Analysis', included: true },
          { id: 'unlimited-premium', name: 'Unlimited Premium Queries', included: true },
          { id: 'cutting-edge', name: 'Cutting-edge AI Models', included: true },
          { id: 'risk-assessment', name: 'Risk Assessment Tools', included: true },
          { id: 'market-simulation', name: 'Market Simulation', included: true },
          { id: 'api-integration', name: 'API Integration', included: true },
        ],
      },
    ]
  }
};

export const ComparisonPage = observer(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState('subscription');
  
  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Get feature icon
  const getFeatureIcon = (included) => {
    return included 
      ? React.createElement(CheckCircleIcon, { color: 'success', fontSize: 'small' })
      : React.createElement(CancelIcon, { color: 'disabled', fontSize: 'small' });
  };
  
  // All features from current section for comparison table
  const getCurrentSectionData = () => {
    return comparisonData[currentTab] || comparisonData.subscription;
  };
  
  const currentSection = getCurrentSectionData();
  const items = currentSection.items;
  
  // Get all unique features
  const allFeatures = [];
  items.forEach(item => {
    item.features.forEach(feature => {
      if (!allFeatures.some(f => f.id === feature.id)) {
        allFeatures.push(feature);
      }
    });
  });
  
  // Render comparison table
  const renderComparisonTable = () => {
    return React.createElement(
      Paper,
      { elevation: 2, sx: { overflow: 'hidden', borderRadius: 2 } },
      React.createElement(
        TableContainer,
        { sx: { maxHeight: 600 } },
        React.createElement(
          Table,
          { stickyHeader: true },
          [
            // Table Header
            React.createElement(
              TableHead,
              null,
              React.createElement(
                TableRow,
                null,
                [
                  // Feature column
                  React.createElement(
                    TableCell,
                    { 
                      sx: { 
                        backgroundColor: theme.palette.background.paper,
                        fontWeight: 'bold',
                        width: '30%',
                        borderBottom: `2px solid ${theme.palette.divider}`
                      } 
                    },
                    'Features'
                  ),
                  // Item columns
                  ...items.map(item => 
                    React.createElement(
                      TableCell,
                      { 
                        key: `header-${item.id}`,
                        align: 'center',
                        sx: { 
                          backgroundColor: item.recommended ? theme.palette.primary.light : theme.palette.background.paper,
                          color: item.recommended ? theme.palette.primary.contrastText : theme.palette.text.primary,
                          fontWeight: 'bold',
                          borderBottom: item.recommended ? `2px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.divider}`
                        } 
                      },
                      [
                        React.createElement(
                          Typography,
                          { variant: 'h6', fontWeight: 'bold', gutterBottom: true },
                          item.name
                        ),
                        React.createElement(
                          Typography,
                          { variant: 'h5', fontWeight: 'bold' },
                          formatPrice(item.price)
                        ),
                        item.price === 0 
                          ? React.createElement(
                              Chip,
                              { 
                                label: 'FREE', 
                                color: 'success',
                                size: 'small',
                                sx: { mt: 1, mb: 1 }
                              }
                            )
                          : null,
                        item.recommended 
                          ? React.createElement(
                              Chip,
                              { 
                                label: 'RECOMMENDED', 
                                color: 'primary',
                                size: 'small',
                                sx: { mt: 1, mb: 1 }
                              }
                            )
                          : null,
                        React.createElement(
                          Box,
                          { sx: { mt: 1 } },
                          React.createElement(
                            Button,
                            {
                              variant: item.recommended ? 'contained' : 'outlined',
                              size: 'small',
                              color: item.recommended ? 'primary' : 'inherit',
                            },
                            item.price === 0 ? 'Get Started Free' : 'Subscribe'
                          )
                        )
                      ]
                    )
                  )
                ]
              )
            ),
            
            // Table Body
            React.createElement(
              TableBody,
              null,
              allFeatures.map((feature, featureIndex) => 
                React.createElement(
                  TableRow,
                  { key: `feature-${feature.id}` },
                  [
                    // Feature name
                    React.createElement(
                      TableCell,
                      { 
                        sx: { 
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          pl: 2
                        } 
                      },
                      React.createElement(
                        Typography,
                        { variant: 'body2', fontWeight: 'medium' },
                        feature.name
                      )
                    ),
                    // Feature availability in each item
                    ...items.map(item => {
                      const itemFeature = item.features.find(f => f.id === feature.id);
                      const included = itemFeature ? itemFeature.included : false;
                      
                      return React.createElement(
                        TableCell,
                        { 
                          key: `${item.id}-${feature.id}`,
                          align: 'center',
                          sx: { 
                            backgroundColor: item.recommended ? 'rgba(25, 118, 210, 0.04)' : 'transparent'
                          } 
                        },
                        getFeatureIcon(included)
                      );
                    })
                  ]
                )
              )
            )
          ]
        )
      )
    );
  };
  
  return React.createElement(
    Box,
    { sx: { p: 3 } },
    [
      // Page Header
      React.createElement(
        Typography,
        { variant: 'h4', gutterBottom: true, sx: { display: 'flex', alignItems: 'center' } },
        [
          React.createElement(CompareArrowsIcon, { sx: { mr: 1 } }),
          'Comprehensive Comparisons'
        ]
      ),
      
      React.createElement(
        Typography,
        { variant: 'body1', color: 'text.secondary', mb: 4 },
        'Compare features across different plans and services to find the perfect fit for your trading needs.'
      ),
      
      // Tabs for different comparison sections
      React.createElement(
        Paper,
        { sx: { mb: 4 } },
        React.createElement(
          Tabs,
          {
            value: currentTab,
            onChange: (e, newValue) => setCurrentTab(newValue),
            variant: isMobile ? 'scrollable' : 'fullWidth',
            scrollButtons: 'auto',
            indicatorColor: 'primary',
            textColor: 'primary'
          },
          [
            React.createElement(
              Tab,
              { 
                key: 'subscription-tab',
                label: 'Subscription Plans', 
                value: 'subscription',
                icon: comparisonData.subscription.icon,
                iconPosition: 'start'
              }
            ),
            React.createElement(
              Tab,
              { 
                key: 'mining-tab',
                label: 'Mining Plans', 
                value: 'mining',
                icon: comparisonData.mining.icon,
                iconPosition: 'start'
              }
            ),
            React.createElement(
              Tab,
              { 
                key: 'education-tab',
                label: 'Education Plans', 
                value: 'education',
                icon: comparisonData.education.icon,
                iconPosition: 'start'
              }
            ),
            React.createElement(
              Tab,
              { 
                key: 'portal-tab',
                label: 'Portal Access', 
                value: 'portal',
                icon: comparisonData.portal.icon,
                iconPosition: 'start'
              }
            ),
            React.createElement(
              Tab,
              { 
                key: 'ai-tab',
                label: 'AI Assistant Plans', 
                value: 'ai',
                icon: comparisonData.ai.icon,
                iconPosition: 'start'
              }
            )
          ]
        )
      ),
      
      // Section Title
      React.createElement(
        Box,
        { sx: { display: 'flex', alignItems: 'center', mb: 3 } },
        [
          currentSection.icon,
          React.createElement(
            Typography,
            { variant: 'h5', ml: 1 },
            currentSection.title
          )
        ]
      ),
      
      // Comparison Table
      renderComparisonTable()
    ]
  );
});

export default ComparisonPage;
