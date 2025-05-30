// InvestorPortalPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  Search,
  AccountBalance,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { InvestorDashboard } from '../components/investor-portal/InvestorDashboardJs';

// Mock components for the other tabs
const PortfolioOverview = () => React.createElement(
  Box, 
  { sx: { p: 2 } }, 
  React.createElement(Typography, { variant: 'h5' }, 'Portfolio Overview (Mock Component)')
);

const InvestmentOpportunities = () => React.createElement(
  Box, 
  { sx: { p: 2 } }, 
  React.createElement(Typography, { variant: 'h5' }, 'Investment Opportunities (Mock Component)')
);

const InvestmentAnalytics = () => React.createElement(
  Box, 
  { sx: { p: 2 } }, 
  React.createElement(Typography, { variant: 'h5' }, 'Investment Analytics (Mock Component)')
);

const InvestorSettings = () => React.createElement(
  Box, 
  { sx: { p: 2 } }, 
  React.createElement(Typography, { variant: 'h5' }, 'Investor Settings (Mock Component)')
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return React.createElement(
    'div',
    {
      role: 'tabpanel',
      hidden: value !== index,
      id: `investor-portal-tabpanel-${index}`,
      'aria-labelledby': `investor-portal-tab-${index}`,
      ...other
    },
    value === index && React.createElement(Box, { sx: { p: 3 } }, children)
  );
}

export const InvestorPortalPage = observer(() => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return React.createElement(
    Box,
    { sx: { flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' } },
    [
      React.createElement(
        Paper,
        {
          sx: {
            borderRadius: 0,
            boxShadow: 'none',
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          key: 'tabs-container'
        },
        React.createElement(
          Tabs,
          {
            value: activeTab,
            onChange: handleTabChange,
            variant: 'scrollable',
            scrollButtons: 'auto',
            sx: {
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.875rem',
              },
            }
          },
          [
            React.createElement(
              Tab,
              {
                icon: React.createElement(Dashboard),
                label: 'Dashboard',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'dashboard-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(AccountBalance),
                label: 'Portfolio',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'portfolio-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(Search),
                label: 'Opportunities',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'opportunities-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(Assessment),
                label: 'Analytics',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'analytics-tab'
              }
            ),
            React.createElement(
              Tab,
              {
                icon: React.createElement(Settings),
                label: 'Settings',
                iconPosition: 'start',
                sx: { textTransform: 'none' },
                key: 'settings-tab'
              }
            )
          ]
        )
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 0, key: 'dashboard-panel' },
        React.createElement(InvestorDashboard)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 1, key: 'portfolio-panel' },
        React.createElement(PortfolioOverview)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 2, key: 'opportunities-panel' },
        React.createElement(InvestmentOpportunities)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 3, key: 'analytics-panel' },
        React.createElement(InvestmentAnalytics)
      ),
      React.createElement(
        TabPanel,
        { value: activeTab, index: 4, key: 'settings-panel' },
        React.createElement(InvestorSettings)
      )
    ]
  );
});

export default InvestorPortalPage;
