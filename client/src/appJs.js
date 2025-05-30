// appJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import * as Pages from './pages/index.js';
import Navigation from './components/layout/Navigation';
// Import our NavigationHandler
import NavigationHandler from './components/navigation/NavigationHandler';
// Use the JavaScript version of the store provider
import { StoreProvider } from './stores/storeProviderJs';
// Import the intro container for the 3D splash screen
import IntroContainer from './components/intro/IntroContainer';

// Define standalone routes that don't need the dashboard layout
const standaloneRoutes = [
  '/welcome'
];

const AppContent = () => {
  // Get current location to check if we're on a standalone page
  const location = window.location.pathname;
  const isStandalonePage = standaloneRoutes.some(route => location === route || location.startsWith(`${route}/`));
  
  // If we're on a standalone page, render just that page without navigation
  if (isStandalonePage) {
    return React.createElement(
      Routes, 
      {}, 
      [
        React.createElement(Route, { 
          key: "welcome", 
          path: "/welcome", 
          element: React.createElement(
            IntroContainer, 
            {}, 
            React.createElement(Pages.WelcomePage)
          ) 
        })
      ]
    );
  }
  
  // Detect mobile devices using window.innerWidth for initial rendering
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Add resize listener to update mobile detection
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create the main app structure with responsive styling for all other pages
  return React.createElement(Box, { 
    sx: { 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      overflow: 'hidden',
      maxWidth: '100vw'
    } 
  }, [
    // NavigationHandler to listen for custom navigation events
    React.createElement(NavigationHandler, { key: "navigation-handler" }),
    // Navigation component
    React.createElement(Navigation, { key: "navigation" }),
    
    // Main content area - mobile responsive
    React.createElement(Box, {
      key: "main-content",
      component: "main",
      sx: { 
        flexGrow: 1, 
        height: isMobile ? 'calc(100vh - 56px)' : '100vh', // Account for mobile header height
        overflow: 'auto',
        width: '100%',
        maxWidth: '100vw',
        padding: isMobile ? '0.5rem' : '1rem',
        boxSizing: 'border-box'
      }
    }, [
      // Routes
      React.createElement(Routes, { key: "routes" }, [
        // Public routes
        React.createElement(Route, { key: "signin", path: "/auth/signin", element: React.createElement(Pages.SignInPage) }),
        React.createElement(Route, { key: "signup", path: "/auth/signup", element: React.createElement(Pages.SignUpPage) }),
        React.createElement(Route, { key: "forgot-password", path: "/auth/forgot-password", element: React.createElement(Pages.ForgotPasswordPage) }),
        React.createElement(Route, { key: "reset-password", path: "/auth/reset-password", element: React.createElement(Pages.ResetPasswordPage) }),
        React.createElement(Route, { key: "verify-email", path: "/auth/verify-email", element: React.createElement(Pages.VerifyEmail) }),

        // Dashboard
        React.createElement(Route, { key: "dashboard", path: "/dashboard", element: React.createElement(Pages.DashboardPage) }),

        // Trading
        React.createElement(Route, { key: "trading", path: "/dashboard/trading", element: React.createElement(Pages.TradingPlatform) }),
        React.createElement(Route, { key: "advanced-trading", path: "/dashboard/advanced-trading", element: React.createElement(Pages.AdvancedTradingPage) }),
        React.createElement(Route, { key: "hft", path: "/dashboard/hft", element: React.createElement(Pages.HFTPage) }),
        React.createElement(Route, { key: "mining", path: "/dashboard/mining", element: React.createElement(Pages.MultiMiningPage) }),
        React.createElement(Route, { key: "mining-pricing", path: "/dashboard/mining/pricing", element: React.createElement(Pages.MiningPricingPage) }),
        React.createElement(Route, { key: "mining-analytics", path: "/dashboard/mining/analytics", element: React.createElement(Pages.MiningAnalytics) }),
        React.createElement(Route, { key: "mining-admin", path: "/dashboard/admin/mining/subscriptions", element: React.createElement(Pages.MiningSubscriptionAdmin) }),
        React.createElement(Route, { key: "mt5", path: "/dashboard/mt5", element: React.createElement(Pages.MT5Page) }),

        // Portfolio & Analysis
        React.createElement(Route, { key: "portfolio", path: "/dashboard/portfolio", element: React.createElement(Pages.PortfolioPage) }),
        React.createElement(Route, { key: "analytics", path: "/dashboard/analysis", element: React.createElement(Pages.AnalysisPage) }),
        React.createElement(Route, { key: "strategies", path: "/dashboard/strategies", element: React.createElement(Pages.StrategiesPage) }),
        React.createElement(Route, { key: "risk-management", path: "/dashboard/risk-management", element: React.createElement(Pages.RiskManagementPage) }),
        React.createElement(Route, { key: "market-analysis", path: "/dashboard/market-analysis", element: React.createElement(Pages.MarketAnalysisPage) }),

        // Market & News
        React.createElement(Route, { key: "news", path: "/dashboard/news", element: React.createElement(Pages.NewsPage) }),
        React.createElement(Route, { key: "nft", path: "/dashboard/nft", element: React.createElement(Pages.NFTPage) }),
        React.createElement(Route, { key: "nft-marketplace", path: "/dashboard/nft-marketplace", element: React.createElement(Pages.NFTMarketplace) }),
        React.createElement(Route, { key: "nft-detail", path: "/dashboard/nft/:id", element: React.createElement(Pages.NFTDetail) }),

        // Portals
        React.createElement(Route, { key: "broker", path: "/dashboard/broker-portal", element: React.createElement(Pages.BrokerPortalPage) }),
        React.createElement(Route, { key: "investor", path: "/dashboard/investor-portal", element: React.createElement(Pages.InvestorPortalPage) }),
        React.createElement(Route, { key: "signal-provider", path: "/dashboard/signal-provider", element: React.createElement(Pages.SignalProviderPage) }),

        // Education
        React.createElement(Route, { key: "academy", path: "/dashboard/academy", element: React.createElement(Pages.AcademyPage) }),
        React.createElement(Route, { key: "ai-agent", path: "/dashboard/ai-agent", element: React.createElement(Pages.AIAgent) }),

        // User
        React.createElement(Route, { key: "profile", path: "/dashboard/settings", element: React.createElement(Pages.ProfileSettings) }),
        React.createElement(Route, { key: "subscription", path: "/dashboard/subscription", element: React.createElement(Pages.SubscriptionPage) }),
        React.createElement(Route, { key: "wallet", path: "/dashboard/wallet", element: React.createElement(Pages.WalletPage) }),
        React.createElement(Route, { key: "messages", path: "/dashboard/messages", element: React.createElement(Pages.MessagesPage) }),
        React.createElement(Route, { key: "message-detail", path: "/dashboard/messages/:messageId", element: React.createElement(Pages.MessagesPage) }),

        // API Demo
        React.createElement(Route, { key: "real-api", path: "/dashboard/real-api", element: React.createElement(Pages.RealApiDemo) }),

        // Premium features - redirect to dashboard
        React.createElement(Route, { key: "premium", path: "/premium/*", element: React.createElement(Navigate, { to: "/dashboard", replace: true }) }),

        // Admin routes
        React.createElement(Route, { key: "admin", path: "/admin/*", element: React.createElement(Navigate, { to: "/admin/mining/subscriptions", replace: true }) }),

        // Root and catch all routes
        React.createElement(Route, { key: "root", path: "/", element: React.createElement(Navigate, { to: "/dashboard", replace: true }) }),
        React.createElement(Route, { key: "catch-all", path: "*", element: React.createElement(Navigate, { to: "/dashboard", replace: true }) })
      ])
    ])
  ]);
};

// Wrap the AppContent with StoreProvider
const App = () => {
  return React.createElement(StoreProvider, null, 
    React.createElement(AppContent)
  );
};

export default App;
