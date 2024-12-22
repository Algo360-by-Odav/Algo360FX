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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/stores/RootStoreContext';
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

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Trading', icon: <ShowChart />, path: '/trading' },
    { text: 'Market Data', icon: <Timeline />, path: '/market-data' },
    { text: 'Portfolio', icon: <AccountBalance />, path: '/portfolio' },
    { text: 'Strategy Builder', icon: <Code />, path: '/strategy' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Auto Trading', icon: <AutoFixHigh />, path: '/auto-trading' },
    { text: 'News', icon: <Article />, path: '/news' },
    { text: 'Calendar', icon: <CalendarToday />, path: '/calendar' },
    { text: 'HFT', icon: <Speed />, path: '/hft' },
    { text: 'Trading Academy', icon: <School />, path: '/academy' },
  ];

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
    handleUserMenuClose();
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      pb: isMobile ? '56px' : 0 // Add padding for mobile navigation
    }}>
      {isMobile && <MobileNavigation />}
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open && {
              marginLeft: DRAWER_WIDTH,
              width: `calc(100% - ${DRAWER_WIDTH}px)`,
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
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
                <IconButton color="inherit" onClick={() => navigate('/settings')}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleUserMenuOpen} sx={{ p: 0, ml: 1 }}>
                <Avatar alt="User" src="/avatar.jpg" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? DRAWER_WIDTH : theme.spacing(7),
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              ...(open
                ? {}
                : {
                    width: theme.spacing(7),
                    overflowX: 'hidden',
                    transition: theme.transitions.create('width', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.leavingScreen,
                    }),
                  }),
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${open ? DRAWER_WIDTH : theme.spacing(7)}px)`,
            minHeight: '100vh',
            bgcolor: 'background.default',
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
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}>
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

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          onClick={handleNotificationClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <ListItemText
              primary="New trade executed"
              secondary="EUR/USD Buy order filled at 1.0950"
            />
          </MenuItem>
          <MenuItem>
            <ListItemText
              primary="Price Alert"
              secondary="GBP/USD reached target at 1.2500"
            />
          </MenuItem>
          <MenuItem>
            <ListItemText
              primary="System Update"
              secondary="New features available"
            />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigate('/notifications')}>
            View All Notifications
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
});

export default MainLayout;
