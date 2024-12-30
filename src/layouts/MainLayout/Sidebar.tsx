import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  ShowChart,
  AccountBalance,
  Build,
  Analytics,
  Article,
  Event,
  Person,
  Settings,
  ChevronLeft,
  School,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRootStore } from '../../hooks/useRootStore';
import Logo from '../../components/Common/Logo';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Trading', icon: <TrendingUp />, path: '/trading' },
  { text: 'Market Data', icon: <ShowChart />, path: '/market-data' },
  { text: 'Portfolio', icon: <AccountBalance />, path: '/portfolio' },
  { text: 'Strategy Builder', icon: <Build />, path: '/strategy' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Trading Academy', icon: <School />, path: '/academy' },
  { text: 'News', icon: <Article />, path: '/news' },
  { text: 'Calendar', icon: <Event />, path: '/calendar' },
];

const bottomMenuItems = [
  { text: 'Profile', icon: <Person />, path: '/profile' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = observer(({ open, onClose, drawerWidth }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { authStore } = useRootStore();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < theme.breakpoints.values.md) {
      onClose();
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo size={48} />
      </Box>
      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '30',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List>
        {bottomMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '30',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
});

export default Sidebar;
