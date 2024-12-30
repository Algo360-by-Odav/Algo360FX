import { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShowChart as TradingIcon,
  Assessment as AnalyticsIcon,
  AccountBalance as PortfolioIcon,
  Article as NewsIcon,
  CalendarToday as CalendarIcon,
  AutoFixHigh as AutoTradingIcon,
  School as AcademyIcon,
  Menu as MenuIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Code as StrategyIcon,
  Timeline as MarketDataIcon,
  Security as SecurityIcon,
  BusinessCenter,
  SignalCellular4Bar,
  Groups,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { observer } from 'mobx-react-lite';

export const MobileNavigation = observer(() => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handlers = useSwipeable({
    onSwipedRight: () => setDrawerOpen(true),
    onSwipedLeft: () => setDrawerOpen(false),
    trackMouse: true,
  });

  // Main routes for bottom navigation
  const mainRoutes = [
    { path: '/app/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/app/trading', label: 'Trading', icon: <TradingIcon /> },
    { path: '/app/portfolio', label: 'Portfolio', icon: <PortfolioIcon /> },
    { path: '/app/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  // Basic features for drawer
  const basicRoutes = [
    { path: '/app/market-data', label: 'Market Data', icon: <MarketDataIcon /> },
    { path: '/app/strategy', label: 'Strategy', icon: <StrategyIcon /> },
    { path: '/app/auto-trading', label: 'Auto Trading', icon: <AutoTradingIcon /> },
    { path: '/app/news', label: 'News', icon: <NewsIcon /> },
    { path: '/app/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/app/hft', label: 'HFT', icon: <SpeedIcon /> },
    { path: '/app/academy', label: 'Academy', icon: <AcademyIcon /> },
  ];

  // Advanced features for drawer
  const advancedRoutes = [
    { path: '/app/advanced-trading', label: 'Advanced Trading', icon: <TradingIcon /> },
    { path: '/app/portfolio-optimizer', label: 'Portfolio Optimizer', icon: <AnalyticsIcon /> },
    { path: '/app/backtesting', label: 'Backtesting', icon: <MarketDataIcon /> },
    { path: '/app/risk-management', label: 'Risk Management', icon: <SecurityIcon /> },
  ];

  // Professional features for drawer
  const professionalRoutes = [
    { path: '/app/broker', label: 'Broker Portal', icon: <BusinessCenter /> },
    { path: '/app/money-manager', label: 'Money Manager', icon: <PortfolioIcon /> },
    { path: '/app/signal-provider', label: 'Signal Provider', icon: <SignalCellular4Bar /> },
    { path: '/app/investor', label: 'Investor Portal', icon: <Groups /> },
  ];

  // User-related routes
  const userRoutes = [
    { path: '/app/profile', label: 'Profile', icon: <ProfileIcon /> },
    { path: '/app/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <div {...handlers}>
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              background: (theme) => theme.palette.background.default,
              transition: (theme) =>
                theme.transitions.create(['transform', 'width'], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard,
                }),
            },
          }}
          transitionDuration={{
            enter: 225,
            exit: 195,
          }}
          SlideProps={{
            easing: {
              enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
              exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div">
              Menu
            </Typography>
          </Box>
          <Divider />

          {/* Basic Features */}
          <List>
            {basicRoutes.map((route) => (
              <ListItem
                button
                key={route.path}
                onClick={() => handleNavigation(route.path)}
                selected={location.pathname === route.path}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.label} />
              </ListItem>
            ))}
          </List>

          {/* Advanced Features */}
          <Divider />
          <ListItem>
            <ListItemText primary="Advanced Features" sx={{ opacity: 0.7 }} />
          </ListItem>
          <List>
            {advancedRoutes.map((route) => (
              <ListItem
                button
                key={route.path}
                onClick={() => handleNavigation(route.path)}
                selected={location.pathname === route.path}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.label} />
              </ListItem>
            ))}
          </List>

          {/* Professional Features */}
          <Divider />
          <ListItem>
            <ListItemText primary="Professional" sx={{ opacity: 0.7 }} />
          </ListItem>
          <List>
            {professionalRoutes.map((route) => (
              <ListItem
                button
                key={route.path}
                onClick={() => handleNavigation(route.path)}
                selected={location.pathname === route.path}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.label} />
              </ListItem>
            ))}
          </List>

          {/* User Routes */}
          <Divider />
          <List>
            {userRoutes.map((route) => (
              <ListItem
                button
                key={route.path}
                onClick={() => handleNavigation(route.path)}
                selected={location.pathname === route.path}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.label} />
              </ListItem>
            ))}
          </List>
        </SwipeableDrawer>
      </div>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: (theme) => theme.palette.background.paper,
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeOut,
            }),
        }}
        elevation={3}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={(_, newValue) => handleNavigation(newValue)}
          showLabels
          sx={{
            height: 56,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
              '&.Mui-selected': {
                paddingTop: '6px',
              },
            },
          }}
        >
          {mainRoutes.map((route) => (
            <BottomNavigationAction
              key={route.path}
              value={route.path}
              icon={route.icon}
              label={route.label}
            />
          ))}
          <BottomNavigationAction
            icon={<MenuIcon />}
            onClick={() => setDrawerOpen(true)}
            label="Menu"
          />
        </BottomNavigation>
      </Paper>
    </>
  );
});

export default MobileNavigation;
