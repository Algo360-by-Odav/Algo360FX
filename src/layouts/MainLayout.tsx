import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
  Badge,
  InputBase,
  alpha,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard,
  ShowChart,
  Timeline,
  AccountBalance,
  Analytics as AnalyticsIcon,
  Article,
  CalendarToday,
  AutoFixHigh,
  Search as SearchIcon,
  Speed,
  Assessment,
  Notifications,
  AccountCircle,
  Person,
  ExitToApp,
  Code,
  Settings as SettingsIcon,
  School,
  Security as SecurityIcon,
  BusinessCenter,
  SignalCellular4Bar,
  Groups,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';
import { useSearch } from '../context/SearchContext';
import SearchResults from '@components/SearchResults/SearchResults';
import useHFTInitialize from '@/hooks/useHFTInitialize';
import { MobileNavigation } from '@components/MobileNavigation';

const DRAWER_WIDTH = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = observer(({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm, performSearch } = useSearch();
  const [open, setOpen] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useHFTInitialize();

  const menuItems = {
    basic: [
      { title: 'Dashboard', icon: <Dashboard />, path: '/app/dashboard' },
      { title: 'Trading', icon: <ShowChart />, path: '/app/trading', badge: '3' },
      { title: 'Market Data', icon: <Timeline />, path: '/app/market-data' },
      { title: 'Portfolio', icon: <AccountBalance />, path: '/app/portfolio', badge: '5' },
      { title: 'News', icon: <Article />, path: '/app/news', badge: 'New' },
      { title: 'Calendar', icon: <CalendarToday />, path: '/app/calendar' },
    ],
    advanced: [
      { title: 'Strategy Builder', icon: <Code />, path: '/app/strategy-builder', tooltip: 'Build and backtest your trading strategies' },
      { title: 'Analytics', icon: <AnalyticsIcon />, path: '/app/analytics', tooltip: 'Advanced market analysis tools' },
      { title: 'Auto Trading', icon: <AutoFixHigh />, path: '/app/auto-trading', badge: 'Beta', tooltip: 'Automated trading strategies' },
      { title: 'Risk Management', icon: <SecurityIcon />, path: '/app/risk-management', tooltip: 'Advanced risk management tools' },
      { title: 'Trading Academy', icon: <School />, path: '/app/academy', badge: 'New', tooltip: 'Learn trading strategies and techniques' },
      { title: 'HFT', icon: <Speed />, path: '/app/hft', badge: 'Pro', tooltip: 'High-Frequency Trading tools' },
    ],
    professional: [
      { title: 'Money Manager', icon: <BusinessCenter />, path: '/app/money-manager', badge: 'Pro', tooltip: 'Professional money management tools' },
      { title: 'Advanced Trading', icon: <SignalCellular4Bar />, path: '/app/advanced-trading', badge: 'Pro', tooltip: 'Advanced trading features for professionals' },
      { title: 'Portfolio Optimizer', icon: <Assessment />, path: '/app/portfolio-optimizer', badge: 'Beta', tooltip: 'AI-powered portfolio optimization' },
      { title: 'Signal Provider', icon: <Groups />, path: '/app/signal-provider-portal', badge: 'Pro', tooltip: 'Become a signal provider' },
      { title: 'Broker Portal', icon: <BusinessCenter />, path: '/app/broker-portal', badge: 'Pro', tooltip: 'Broker management dashboard' },
      { title: 'Investor Portal', icon: <AccountBalance />, path: '/app/investor-portal', badge: 'Pro', tooltip: 'Investor management dashboard' },
    ]
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate('/auth/login');
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && <MobileNavigation />}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Algo360FX
          </Typography>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ml: 4 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 1,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
                },
                width: '100%',
                maxWidth: 600,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    padding: '0 16px',
                    height: '100%',
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <SearchIcon />
                </Box>
                <InputBase
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    performSearch(e.target.value);
                  }}
                  placeholder="Search..."
                  sx={{
                    color: 'inherit',
                    width: '100%',
                    '& .MuiInputBase-input': {
                      padding: '8px 8px 8px 48px',
                      width: '100%',
                    },
                  }}
                />
              </Box>
              <SearchResults />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationOpen}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={() => navigate('/app/settings')}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleUserMenuOpen} sx={{ p: 0, ml: 1 }}>
              <Avatar alt="User" src="/avatar.jpg" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open={open}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {/* Basic Features */}
              <ListItem>
                <ListItemText 
                  primary="Basic Features" 
                  secondary="Essential trading tools"
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: 'bold',
                      color: theme.palette.primary.main 
                    },
                    '& .MuiTypography-secondary': {
                      fontSize: '0.75rem',
                      color: theme.palette.text.secondary
                    }
                  }} 
                />
              </ListItem>
              {menuItems.basic.map((item) => (
                <Tooltip 
                  key={item.title}
                  title={item.tooltip || ''}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    onClick={() => handleMenuItemClick(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      pl: 3,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    )}
                  </ListItem>
                </Tooltip>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Advanced Features */}
              <ListItem>
                <ListItemText 
                  primary="Advanced Features" 
                  secondary="Professional trading tools"
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: 'bold',
                      color: theme.palette.secondary.main 
                    },
                    '& .MuiTypography-secondary': {
                      fontSize: '0.75rem',
                      color: theme.palette.text.secondary
                    }
                  }} 
                />
              </ListItem>
              {menuItems.advanced.map((item) => (
                <Tooltip 
                  key={item.title}
                  title={item.tooltip || ''}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    onClick={() => handleMenuItemClick(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      pl: 3,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: theme.palette.secondary.main 
                    }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          bgcolor: item.badge === 'Beta' 
                            ? theme.palette.warning.main
                            : item.badge === 'New'
                            ? theme.palette.success.main
                            : theme.palette.secondary.main,
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    )}
                  </ListItem>
                </Tooltip>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Professional Features */}
              <ListItem>
                <ListItemText 
                  primary="Professional Features" 
                  secondary="Enterprise-grade solutions"
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: 'bold',
                      color: theme.palette.success.main 
                    },
                    '& .MuiTypography-secondary': {
                      fontSize: '0.75rem',
                      color: theme.palette.text.secondary
                    }
                  }} 
                />
              </ListItem>
              {menuItems.professional.map((item) => (
                <Tooltip 
                  key={item.title}
                  title={item.tooltip || ''}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    onClick={() => handleMenuItemClick(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      pl: 3,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.05),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: theme.palette.success.main 
                    }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          bgcolor: item.badge === 'Beta' 
                            ? theme.palette.warning.main 
                            : theme.palette.error.main,
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    )}
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/app/profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/app/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        onClick={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>New trade alert: EURUSD</MenuItem>
        <MenuItem>Portfolio update</MenuItem>
        <MenuItem>System maintenance</MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/app/notifications')}>
          View all notifications
        </MenuItem>
      </Menu>
    </Box>
  );
});

export default MainLayout;
