// StandaloneTopBarWrapper.js
// A wrapper component that adds the enhanced topbar to standalone pages

import React from 'react';
import { Box, ThemeProvider, createTheme, CssBaseline, Button } from '@mui/material';
import TopBar from './TopBar';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';
import {
  Home as HomeIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
  TrendingUp as TradingIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  School as EducationIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const StandaloneTopBarWrapper = observer(({ children, pageType }) => {
  const { themeStore } = useStores();
  
  // Define page metadata based on page type
  const getPageMetadata = () => {
    switch (pageType) {
      case 'welcome':
        return {
          title: 'Welcome',
          icon: React.createElement(HomeIcon),
          actions: [
            React.createElement(
              Button, 
              {
                key: 'get-started',
                variant: 'contained',
                size: 'small',
                startIcon: React.createElement(ArrowForwardIcon),
                color: 'primary'
              },
              'Get Started'
            ),
            React.createElement(
              Button, 
              {
                key: 'learn-more',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(InfoIcon),
                color: 'primary'
              },
              'Learn More'
            )
          ]
        };
      case 'signin':
        return {
          title: 'Sign In',
          icon: React.createElement(LoginIcon),
          actions: [
            React.createElement(
              Button, 
              {
                key: 'create-account',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(SignUpIcon),
                color: 'primary'
              },
              'Create Account'
            )
          ]
        };
      case 'signup':
        return {
          title: 'Sign Up',
          icon: React.createElement(SignUpIcon),
          actions: [
            React.createElement(
              Button, 
              {
                key: 'sign-in',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(LoginIcon),
                color: 'primary'
              },
              'Sign In'
            )
          ]
        };
      case 'trading':
        return {
          title: 'Trading Platform',
          icon: React.createElement(TradingIcon),
          actions: [
            React.createElement(
              Button, 
              {
                key: 'refresh-data',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(RefreshIcon),
                color: 'primary'
              },
              'Refresh Data'
            ),
            React.createElement(
              Button, 
              {
                key: 'learn-trading',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(EducationIcon),
                color: 'primary'
              },
              'Trading Guides'
            )
          ]
        };
      default:
        return {
          title: 'Algo360FX',
          icon: React.createElement(HomeIcon),
        };
    }
  };
  
  const pageMetadata = getPageMetadata();
  
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeStore.isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          background: {
            default: themeStore.isDarkMode ? '#0A192F' : '#f5f5f5',
            paper: themeStore.isDarkMode ? '#1A2B45' : '#ffffff',
          },
        },
      }),
    [themeStore.isDarkMode]
  );
  
  const handleMenuToggle = () => {
    themeStore.toggleMenu();
  };
  
  return React.createElement(
    ThemeProvider,
    { theme: theme },
    [
      React.createElement(CssBaseline, { key: 'cssbaseline' }),
      React.createElement(
        Box,
        { 
          key: 'main-container',
          sx: { display: 'flex', flexDirection: 'column', minHeight: '100vh' } 
        },
        [
          React.createElement(TopBar, {
            key: 'topbar',
            onMenuClick: handleMenuToggle,
            pageTitle: pageMetadata.title,
            pageIcon: pageMetadata.icon,
            actions: pageMetadata.actions,
            showSearch: true,
            showLanguageSelector: true,
            showNotifications: true,
            showMessages: true,
            showProfileMenu: true,
            showThemeToggle: true
          }),
          React.createElement(
            Box,
            {
              key: 'content',
              component: "main",
              sx: {
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }
            },
            children
          )
        ]
      )
    ]
  );
});

export default StandaloneTopBarWrapper;
