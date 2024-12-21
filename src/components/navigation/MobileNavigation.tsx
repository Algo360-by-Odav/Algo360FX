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
  const additionalRoutes = [
    { path: '/market-data', label: 'Market Data', icon: <MarketDataIcon /> },
    { path: '/strategy', label: 'Strategy', icon: <StrategyIcon /> },
    { path: '/auto-trading', label: 'Auto Trading', icon: <AutoTradingIcon /> },
    { path: '/news', label: 'News', icon: <NewsIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/academy', label: 'Academy', icon: <AcademyIcon /> },
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
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '80%',
              maxWidth: 360,
              background: (theme) => theme.palette.background.default,
              transition: (theme) =>
                theme.transitions.create(['transform'], {
                  duration: theme.transitions.duration.standard,
                }),
              zIndex: (theme) => theme.zIndex.drawer - 1, // Lower z-index than dashboard drawer
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div" sx={{ display: 'block' }}>
              Menu
            </Typography>
          </Box>
          <Divider />
          <List>
            {additionalRoutes.map((route) => (
              <ListItem
                button
                key={route.path}
                onClick={() => handleNavigation(route.path)}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography component="span" variant="body1">
                      {route.label}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => handleNavigation('/profile')}>
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </SwipeableDrawer>
      </div>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: (theme) => theme.palette.background.default,
          transition: (theme) =>
            theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.shortest,
            }),
        }}
        elevation={3}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={(_, newValue) => handleNavigation(newValue)}
          showLabels
        >
          <BottomNavigationAction
            sx={{ minWidth: 0 }}
            icon={<MenuIcon />}
            onClick={(e) => {
              e.preventDefault();
              setDrawerOpen(true);
            }}
          />
          {mainRoutes.map((route) => (
            <BottomNavigationAction
              key={route.path}
              value={route.path}
              label={route.label}
              icon={route.icon}
              sx={{ minWidth: 0 }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
});
