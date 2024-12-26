import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  styled,
  Theme,
  CssBaseline,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  TrendingUp,
  ShowChart,
  AccountBalance,
  School,
  Security,
  Build,
  Store,
  Analytics,
  Description,
  Notifications,
  Settings,
  Person,
  ChevronLeft,
  ChevronRight,
  AutoGraph,
  PrecisionManufacturing,
  Timeline,
  Assessment,
  Speed,
  Business,
  AccountBalanceWallet,
  SignalCellularAlt,
  People,
  GppGood,
  Tune,
  History,
  MenuBook,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const menuItems = [
  // Basic Features
  { title: 'Dashboard', path: '/app/dashboard', icon: <Dashboard /> },
  { title: 'Trading', path: '/app/trading', icon: <TrendingUp /> },
  { title: 'Market Data', path: '/app/market-data', icon: <ShowChart /> },
  { title: 'Portfolio', path: '/app/portfolio', icon: <AccountBalance /> },
  { title: 'Money Manager', path: '/app/money-manager', icon: <AccountBalanceWallet /> },
  { title: 'Strategy Builder', path: '/app/strategy-builder', icon: <Build /> },
  // Portals
  { type: 'divider' },
  { type: 'subheader', title: 'Portals' },
  { title: 'Broker Portal', path: '/app/broker', icon: <Business /> },
  { title: 'Signal Provider', path: '/app/signal-provider', icon: <SignalCellularAlt /> },
  { title: 'Investor Portal', path: '/app/investor', icon: <People /> },
  // Professional Features
  { type: 'divider' },
  { type: 'subheader', title: 'Professional Tools' },
  { title: 'Auto Trading', path: '/app/auto-trading', icon: <AutoGraph /> },
  { title: 'Advanced Trading', path: '/app/advanced-trading', icon: <PrecisionManufacturing /> },
  { title: 'HFT', path: '/app/hft', icon: <Speed /> },
  { title: 'Risk Management', path: '/app/risk', icon: <GppGood /> },
  { title: 'Strategy Marketplace', path: '/app/marketplace', icon: <Store /> },
  { title: 'Analytics', path: '/app/analytics', icon: <Assessment /> },
  { title: 'Portfolio Optimizer', path: '/app/portfolio-optimizer', icon: <Tune /> },
  { title: 'Backtesting', path: '/app/backtesting', icon: <History /> },
  // Education
  { type: 'divider' },
  { type: 'subheader', title: 'Education' },
  { title: 'Trading Academy', path: '/app/academy', icon: <School /> },
  { title: 'Documentation', path: '/app/docs', icon: <MenuBook /> },
];

const AppLayout: React.FC = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { userStore } = useRootStore();
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Algo360FX
          </Typography>
          <IconButton
            size="large"
            aria-label="notifications"
            color="inherit"
            onClick={() => handleNavigate('/app/notifications')}
          >
            <Notifications />
          </IconButton>
          <IconButton
            size="large"
            aria-label="settings"
            color="inherit"
            onClick={() => handleNavigate('/app/settings')}
          >
            <Settings />
          </IconButton>
          <IconButton
            size="large"
            aria-label="profile"
            color="inherit"
            onClick={() => handleNavigate('/app/profile')}
          >
            <Person />
          </IconButton>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(17, 25, 40, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>

        {menuItems.map((item) => (
          item.type === 'divider' ? (
            <Divider key={item.type} sx={{ mt: 1, mb: 1 }} />
          ) : item.type === 'subheader' ? (
            <Typography
              key={item.title}
              variant="overline"
              sx={{
                px: 3,
                mt: 3,
                mb: 1,
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 500,
              }}
            >
              {item.title}
            </Typography>
          ) : (
            <ListItem
              key={item.title}
              button
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path
                    ? 'primary.main'
                    : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 500 : 400,
                    color: location.pathname === item.path
                      ? 'primary.main'
                      : 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </ListItem>
          )
        ))}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box component="div" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
});

export default AppLayout;
