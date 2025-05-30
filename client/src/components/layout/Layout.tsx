import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Button,
  useTheme,
} from '@mui/material';
import { createResponsiveTheme } from '../../styles/themeConfig';
import { observer } from 'mobx-react-lite';
import TopBar from './TopBar';
import SideMenu from './SideMenu';
import MobileNavigation from './MobileNavigation';
import { useStores } from '../../stores/storeProviderJs';
import ChatAssistant from '../chat/ChatAssistant';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Dashboard as DashboardIcon,
  School as EducationIcon,
  TrendingUp as TradingIcon,
  ShoppingCart as MarketplaceIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  AccountCircle as ProfileIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  Newspaper as NewspaperIcon,
  SignalCellularAlt as SignalIcon,
  Business as BusinessIcon,
  Subscriptions as SubscriptionsIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';

const Layout = observer(() => {
  const { themeStore } = useStores();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Define page metadata based on current route
  // Define standard action buttons that all pages will use (same as Trading Platform)
  const standardActions = [
    <Button 
      key="new-order" 
      variant="contained" 
      size="small" 
      startIcon={<AddIcon />}
      color="primary"
    >
      New Order
    </Button>,
    <Button 
      key="refresh-data" 
      variant="outlined" 
      size="small" 
      startIcon={<RefreshIcon />}
      color="primary"
    >
      Refresh
    </Button>,
    <Button 
      key="download-data" 
      variant="outlined" 
      size="small" 
      startIcon={<DownloadIcon />}
      color="primary"
    >
      Export
    </Button>
  ];

  const pageMetadata = useMemo(() => {
    const path = location.pathname;
    
    // Default metadata with consistent action buttons across all pages
    const defaultMetadata = {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      actions: [
        <Button 
          key="refresh" 
          variant="outlined" 
          size="small" 
          startIcon={<RefreshIcon />}
          sx={{ mr: 1 }}
        >
          Refresh
        </Button>,
        <Button 
          key="download" 
          variant="outlined" 
          size="small" 
          startIcon={<DownloadIcon />}
          sx={{ mr: 1 }}
        >
          Reports
        </Button>
      ],
    };

    // Map routes to their metadata (title and icon)
    if (path.includes('/dashboard/trading')) {
      return {
        title: 'Trading Platform',
        icon: <TradingIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/education') || path.includes('/dashboard/academy')) {
      return {
        title: path.includes('/dashboard/academy') ? 'Academy' : 'Education Center',
        icon: <EducationIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/marketplace') || path.includes('/dashboard/nft-marketplace')) {
      return {
        title: path.includes('/dashboard/nft-marketplace') ? 'NFT Marketplace' : 'Marketplace',
        icon: <MarketplaceIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/settings')) {
      return {
        title: 'Settings',
        icon: <SettingsIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/profile')) {
      return {
        title: 'My Profile',
        icon: <ProfileIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/help')) {
      return {
        title: 'Help & Support',
        icon: <HelpIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/notifications')) {
      return {
        title: 'Notifications',
        icon: <NotificationsIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/strategies')) {
      return {
        title: 'Strategies',
        icon: <TradingIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/advanced-trading')) {
      return {
        title: 'Advanced Trading',
        icon: <TradingIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/hft')) {
      return {
        title: 'High Frequency Trading',
        icon: <TradingIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/mt5')) {
      return {
        title: 'MT5 Integration',
        icon: <TradingIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/analysis') || path.includes('/dashboard/market-analysis')) {
      return {
        title: path.includes('/dashboard/market-analysis') ? 'Market Analysis' : 'Analysis',
        icon: <BarChartIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/ai-agent')) {
      return {
        title: 'AI Assistant',
        icon: <AIIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/news')) {
      return {
        title: 'News',
        icon: <NewspaperIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/risk-management')) {
      return {
        title: 'Risk Management',
        icon: <BarChartIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/signal-provider')) {
      return {
        title: 'Signal Provider',
        icon: <SignalIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/broker-portal')) {
      return {
        title: 'Broker Portal',
        icon: <BusinessIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/investor-portal')) {
      return {
        title: 'Investor Portal',
        icon: <BusinessIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/portfolio')) {
      return {
        title: 'Portfolio',
        icon: <BarChartIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/subscription')) {
      return {
        title: 'Subscription',
        icon: <SubscriptionsIcon />,
        actions: standardActions
      };
    } else if (path.includes('/dashboard/')) {
      // Default dashboard view
      return {
        ...defaultMetadata,
        title: 'Dashboard'
      };
    }
    
    // Fallback for all other routes
    return defaultMetadata;
  }, [location.pathname]);

  const theme = React.useMemo(
    () => createResponsiveTheme(themeStore.isDarkMode ? 'dark' : 'light'),
    [themeStore.isDarkMode]
  );

  const handleMenuToggle = () => {
    themeStore.toggleMenu();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Enhanced TopBar with dynamic page title and icon */}
        <TopBar 
          open={themeStore.isMenuOpen}
          handleDrawerToggle={handleMenuToggle}
          pageTitle={pageMetadata?.title}
          pageIcon={pageMetadata?.icon}
          actions={pageMetadata?.actions}
        />
        <SideMenu open={themeStore.isMenuOpen} handleDrawerToggle={handleMenuToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            width: '100%',
            maxWidth: '100vw',
            overflowX: 'hidden',
            transition: (theme) => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          <Container 
            maxWidth="xl"
            sx={{ 
              px: { xs: 1, sm: 2, md: 3 },
              py: { xs: 1.5, sm: 2 },
              mb: isMobile ? '60px' : 0 // Add bottom margin on mobile to account for bottom navigation
            }}
          >
            <Outlet />
          </Container>
        </Box>
        {/* Using ChatAssistant directly instead of FloatingChatButton */}
        <ChatAssistant />
        
        {/* Mobile Navigation - only shown on small screens */}
        {isMobile && <MobileNavigation />}
      </Box>
    </ThemeProvider>
  );
});

export default Layout;
