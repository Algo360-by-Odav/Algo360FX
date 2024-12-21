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
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/trading', label: 'Trading', icon: <TradingIcon /> },
    { path: '/portfolio', label: 'Portfolio', icon: <PortfolioIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  // Additional routes for drawer
  const drawerRoutes = [
    { path: '/market-data', label: 'Market Data', icon: <MarketDataIcon /> },
    { path: '/strategy', label: 'Strategy', icon: <StrategyIcon /> },
    { path: '/auto-trading', label: 'Auto Trading', icon: <AutoTradingIcon /> },
    { path: '/news', label: 'News', icon: <NewsIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/academy', label: 'Academy', icon: <AcademyIcon /> },
  ];

  // User-related routes
  const userRoutes = [
    { path: '/profile', label: 'Profile', icon: <ProfileIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Algo360FX
            </Typography>
          </Box>
          <Divider />
          
          <List>
            {mainRoutes.map((route) => (
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
          
          <Divider />
          
          <List>
            {drawerRoutes.map((route) => (
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
          borderTop: 1,
          borderColor: 'divider',
          transform: 'translateZ(0)',
          transition: (theme) =>
            theme.transitions.create(['transform'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.short,
            }),
        }}
        elevation={3}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={(_, newValue) => {
            navigate(newValue);
          }}
          showLabels
        >
          {mainRoutes.map((route) => (
            <BottomNavigationAction
              key={route.path}
              label={route.label}
              value={route.path}
              icon={route.icon}
            />
          ))}
          <BottomNavigationAction
            icon={<MenuIcon />}
            onClick={(e) => {
              e.preventDefault();
              setDrawerOpen(true);
            }}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
});
