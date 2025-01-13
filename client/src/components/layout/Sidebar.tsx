import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShowChart as ChartIcon,
  AccountBalance as PortfolioIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useStore } from '@/context/StoreContext';
import { observer } from 'mobx-react-lite';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { text: 'Trading', icon: ChartIcon, path: '/trading' },
  { text: 'Portfolio', icon: PortfolioIcon, path: '/portfolio' },
  { text: 'History', icon: HistoryIcon, path: '/history' },
  { text: 'Settings', icon: SettingsIcon, path: '/settings' },
  { text: 'Help', icon: HelpIcon, path: '/help' }
];

export const Sidebar: FC = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { uiStore } = useStore();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={uiStore.isSidebarOpen}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          mt: 8, // Space for navbar
          bgcolor: theme.palette.background.paper
        }
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map(({ text, icon: Icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => navigate(path)}
              >
                <ListItemIcon>
                  <Icon color={location.pathname === path ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
});
