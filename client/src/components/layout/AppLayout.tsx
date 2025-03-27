import React, { useState } from 'react';
import { 
  Box, 
  useTheme, 
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  InputBase,
  Badge,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  alpha,
  Fab,
  CssBaseline,
} from '@mui/material';
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  AutoGraph as AutoTradingIcon,
  Article as NewsIcon,
  Event as CalendarIcon,
  Speed as HFTIcon,
  School as AcademyIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Chat as ChatIcon,
  Build as BuildIcon,
  History as HistoryIcon,
  Storefront as StorefrontIcon,
  FolderSpecial as FolderSpecialIcon,
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  MenuBook as MenuBookIcon,
  AccountBalance as BrokerIcon,
  AttachMoney as MoneyIcon,
  SignalCellularAlt as SignalIcon,
  Groups as InvestorIcon,
  AdminPanelSettings as ManagementIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { observer } from 'mobx-react-lite';
import AIAgent from '../ai/AIAgent';
import { Outlet } from 'react-router-dom';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface MenuCategory {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

interface SearchResult {
  title: string;
  description: string;
  path: string;
}

const DRAWER_WIDTH = 240;

const navigationMenu: MenuCategory[] = [
  {
    title: 'Management',
    icon: <ManagementIcon />,
    items: [
      { title: 'Broker Portal', path: '/broker', icon: <BrokerIcon /> },
      { title: 'Money Manager', path: '/money-manager', icon: <MoneyIcon /> },
      { title: 'Signal Provider', path: '/signal-provider', icon: <SignalIcon /> },
      { title: 'Investor Portal', path: '/investor', icon: <InvestorIcon /> },
    ]
  },
  {
    title: 'Trading',
    icon: <TrendingUpIcon />,
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
      { title: 'Manual Trading', path: '/trading', icon: <TrendingUpIcon /> },
      { title: 'Auto Trading', path: '/auto-trading', icon: <AutoTradingIcon /> },
      { title: 'HFT', path: '/hft', icon: <HFTIcon /> },
    ]
  },
  {
    title: 'Strategy',
    icon: <StorefrontIcon />,
    items: [
      { title: 'Strategy Builder', path: '/strategy', icon: <BuildIcon /> },
      { title: 'Backtesting', path: '/backtesting', icon: <HistoryIcon /> },
      { title: 'Strategy Market', path: '/strategy-market', icon: <StorefrontIcon /> },
      { title: 'My Strategies', path: '/my-strategies', icon: <FolderSpecialIcon /> },
    ]
  },
  {
    title: 'Analysis',
    icon: <AnalyticsIcon />,
    items: [
      { title: 'Market Analysis', path: '/analysis', icon: <AnalyticsIcon /> },
      { title: 'Technical Analysis', path: '/technical', icon: <ShowChartIcon /> },
      { title: 'Fundamental Analysis', path: '/fundamental', icon: <AssessmentIcon /> },
      { title: 'Risk Analysis', path: '/risk', icon: <SecurityIcon /> },
    ]
  },
  {
    title: 'Resources',
    icon: <AcademyIcon />,
    items: [
      { title: 'News', path: '/news', icon: <NewsIcon /> },
      { title: 'Calendar', path: '/calendar', icon: <CalendarIcon /> },
      { title: 'Academy', path: '/academy', icon: <AcademyIcon /> },
      { title: 'Documentation', path: '/docs', icon: <MenuBookIcon /> },
    ]
  }
];

const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: theme.palette.mode === 'dark' ? '#1A2C42' : 'primary.main',
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Algo360FX
          </Typography>
          <IconButton color="inherit" onClick={() => logout()}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Navigation content */}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
