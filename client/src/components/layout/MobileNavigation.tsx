import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TradingIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  SmartToy as AIIcon,
  Memory as MiningIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';

/**
 * MobileNavigation component provides:
 * 1. Fixed bottom navigation bar with main actions
 * 2. Full drawer menu for all navigation options
 */
const MobileNavigation = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { themeStore } = useStores();

  // Get current path for highlighting active navigation items
  const currentPath = location.pathname;
  const getActivePath = (path: string) => currentPath === path || currentPath.startsWith(path);

  // Primary navigation items for bottom bar
  const primaryNavItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Trading', icon: <TradingIcon />, path: '/dashboard/trading' },
    { label: 'Menu', icon: <MenuIcon />, path: null, onClick: () => setDrawerOpen(true) },
    { label: 'Mining', icon: <MiningIcon />, path: '/dashboard/mining' },
    { label: 'Wallet', icon: <WalletIcon />, path: '/dashboard/wallet' },
  ];

  // Calculate current value for bottom navigation
  const getValue = () => {
    const index = primaryNavItems.findIndex(
      item => item.path && getActivePath(item.path)
    );
    return index > -1 ? index : 2; // Default to "Menu" if no match
  };

  // Secondary navigation items (full drawer menu)
  const secondaryNavItems = [
    {
      category: 'Platform',
      items: [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { label: 'Trading', icon: <TradingIcon />, path: '/dashboard/trading' },
        { label: 'Advanced Trading', icon: <AnalyticsIcon />, path: '/dashboard/advanced-trading' },
        { label: 'Analysis', icon: <AnalyticsIcon />, path: '/dashboard/analysis' },
      ]
    },
    {
      category: 'Features',
      items: [
        { label: 'Mining', icon: <MiningIcon />, path: '/dashboard/mining' },
        { label: 'AI Assistant', icon: <AIIcon />, path: '/dashboard/ai-agent' },
        { label: 'Wallet', icon: <WalletIcon />, path: '/dashboard/wallet' },
      ]
    },
    {
      category: 'Account',
      items: [
        { label: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
      ]
    }
  ];

  // Handle navigation item click
  const handleNavigation = (path: string | null) => {
    if (path) {
      navigate(path);
      setDrawerOpen(false);
    }
  };

  // Render full navigation drawer
  const renderFullMenu = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: '85%',
          maxWidth: '300px',
          borderRadius: '0 8px 8px 0'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        p: 1 
      }}>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {secondaryNavItems.map((section, index) => (
        <React.Fragment key={section.category}>
          {index > 0 && <Divider sx={{ my: 1 }} />}
          <List sx={{ px: 1 }}>
            {section.items.map((item) => (
              <ListItem disablePadding key={item.path}>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  selected={getActivePath(item.path)}
                  sx={{ 
                    borderRadius: 1,
                    mb: 0.5,
                    bgcolor: getActivePath(item.path) 
                      ? (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.1)' 
                        : 'rgba(0,0,0,0.05)' 
                      : 'transparent'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ))}
    </Drawer>
  );

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          display: { xs: 'block', sm: 'none' }, 
          zIndex: 1100,
          borderRadius: '10px 10px 0 0',
          overflow: 'hidden',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={getValue()}
          showLabels
          sx={{
            height: '60px',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
              color: themeStore.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              '&.Mui-selected': {
                color: themeStore.isDarkMode ? '#90caf9' : '#1976d2',
              }
            }
          }}
        >
          {primaryNavItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={item.icon}
              onClick={() => item.onClick ? item.onClick() : handleNavigation(item.path)}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Full menu drawer */}
      {renderFullMenu()}
    </>
  );
});

export default MobileNavigation;
