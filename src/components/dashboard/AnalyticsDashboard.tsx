import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TradingIcon,
  AccountBalance as PortfolioIcon,
  Analytics as AnalyticsIcon,
  ShowChart as MarketDataIcon,
  Code as StrategyIcon,
  SmartToy as AutoTradingIcon,
  Newspaper as NewsIcon,
  CalendarMonth as CalendarIcon,
  School as AcademyIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Business as BrokerIcon,
  ManageAccounts as MoneyManagerIcon,
  SignalCellularAlt as SignalProviderIcon,
  AccountBalanceWallet as InvestorIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../stores/AuthStore';
import { UserRole } from '../../types/user';

const menuItems = [
  { 
    type: 'section',
    title: 'Trading',
    items: [
      { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { label: 'Trading', icon: <TradingIcon />, path: '/trading' },
      { label: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
      { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
      { label: 'Market Data', icon: <MarketDataIcon />, path: '/market-data' },
      { label: 'Strategy Builder', icon: <StrategyIcon />, path: '/strategy' },
      { label: 'Auto Trading', icon: <AutoTradingIcon />, path: '/auto-trading' },
      { 
        label: 'Algo Trading', 
        icon: <SpeedIcon />, 
        path: '/algo-trading',
        roles: [UserRole.ADMIN, UserRole.MONEY_MANAGER, UserRole.SIGNAL_PROVIDER]
      },
      { 
        label: 'HFT', 
        icon: <SpeedIcon />, 
        path: '/hft',
        roles: [UserRole.ADMIN, UserRole.BROKER, UserRole.MONEY_MANAGER]
      }
    ]
  },
  {
    type: 'section',
    title: 'Professional',
    items: [
      { 
        label: 'Broker Portal', 
        icon: <BrokerIcon />, 
        path: '/broker-portal',
        roles: [UserRole.ADMIN, UserRole.BROKER]
      },
      { 
        label: 'Money Manager', 
        icon: <MoneyManagerIcon />, 
        path: '/money-manager',
        roles: [UserRole.ADMIN, UserRole.MONEY_MANAGER]
      },
      { 
        label: 'Signal Provider', 
        icon: <SignalProviderIcon />, 
        path: '/signal-provider',
        roles: [UserRole.ADMIN, UserRole.SIGNAL_PROVIDER]
      },
      { 
        label: 'Investor Portal', 
        icon: <InvestorIcon />, 
        path: '/investor-portal',
        roles: [UserRole.ADMIN, UserRole.INVESTOR]
      }
    ]
  },
  {
    type: 'section',
    title: 'Resources',
    items: [
      { label: 'News', icon: <NewsIcon />, path: '/news' },
      { label: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
      { label: 'Academy', icon: <AcademyIcon />, path: '/academy' }
    ]
  },
  {
    type: 'section',
    title: 'Account',
    items: [
      { label: 'Profile', icon: <ProfileIcon />, path: '/profile' },
      { label: 'Settings', icon: <SettingsIcon />, path: '/settings' }
    ]
  }
];

interface AnalyticsDashboardProps {
  children: React.ReactNode;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = observer(({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isAuthorized = (roles?: UserRole[]) => {
    if (!roles || roles.length === 0) return true;
    return roles.includes(auth.currentUser?.role as UserRole);
  };

  const filteredMenuItems = menuItems.map(section => ({
    ...section,
    items: section.items.filter(item => isAuthorized(item.roles))
  }));

  const drawerContent = (
    <>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 600 }}>
          Algo360FX
        </Typography>
      </Box>
      {filteredMenuItems.map((section, index) => (
        <React.Fragment key={section.title}>
          <List>
            <ListItem>
              <Typography
                variant="overline"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  letterSpacing: '0.1em'
                }}
              >
                {section.title}
              </Typography>
            </ListItem>
            {section.items.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleMenuItemClick(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {index < filteredMenuItems.length - 1 && (
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          )}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${240}px)` },
          ml: { sm: `${240}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              backgroundColor: 'background.default',
              backgroundImage: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              backgroundColor: 'background.default',
              backgroundImage: 'none',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
});

export default AnalyticsDashboard;
