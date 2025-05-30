import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TrendingUp,
  AccountBalance,
  Build,
  Analytics,
  Newspaper,
  School,
  Person,
  ExpandLess,
  ExpandMore,
  ShowChart,
  ListAlt,
  Speed,
  Timeline,
  Psychology,
  Business,
  School as EducationIcon,
  SupervisorAccount,
  Assessment,
  Storefront,
  Settings,
  SmartToy,
  QueryStats,
  Memory,
} from '@mui/icons-material';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <TrendingUp />,
    path: '/dashboard',
  },
  {
    text: 'Trading',
    icon: <ShowChart />,
    children: [
      { text: 'Platform', icon: <ShowChart />, path: '/dashboard/trading' },
      { text: 'MT5', icon: <Speed />, path: '/dashboard/mt5' },
      { text: 'HFT', icon: <Speed />, path: '/dashboard/hft' },
      { text: 'Advanced Trading', icon: <Build />, path: '/dashboard/advanced-trading' },
      { text: 'Multi-Mining', icon: <Memory />, path: '/dashboard/mining' },
    ],
  },
  {
    text: 'Portfolio & Analysis',
    icon: <Analytics />,
    children: [
      { text: 'Portfolio', icon: <AccountBalance />, path: '/dashboard/portfolio' },
      { text: 'Analytics', icon: <Analytics />, path: '/dashboard/analysis' },
      { text: 'Strategies', icon: <Psychology />, path: '/dashboard/strategies' },
      { text: 'Risk Management', icon: <Assessment />, path: '/dashboard/risk-management' },
      { text: 'Market Analysis', icon: <QueryStats />, path: '/dashboard/market-analysis' },
    ],
  },
  {
    text: 'Market & News',
    icon: <Newspaper />,
    children: [
      { text: 'News', icon: <Newspaper />, path: '/dashboard/news' },
      { text: 'NFT Marketplace', icon: <Storefront />, path: '/dashboard/nft-marketplace' },
    ],
  },
  {
    text: 'Portals',
    icon: <Business />,
    children: [
      { text: 'Broker Portal', icon: <SupervisorAccount />, path: '/dashboard/broker-portal' },
      { text: 'Investor Portal', icon: <Business />, path: '/dashboard/investor-portal' },
      { text: 'Signal Provider', icon: <Timeline />, path: '/dashboard/signal-provider' },
    ],
  },
  {
    text: 'Education',
    icon: <School />,
    children: [
      { text: 'Academy', icon: <EducationIcon />, path: '/dashboard/academy' },
      { text: 'AI Agent', icon: <SmartToy />, path: '/dashboard/ai-agent' },
    ],
  },
  {
    text: 'User',
    icon: <Person />,
    children: [
      { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
      { text: 'Subscription', icon: <ListAlt />, path: '/dashboard/subscription' },
    ],
  },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleSubMenuToggle = (text: string) => {
    setOpenSubMenus(prev => ({ ...prev, [text]: !prev[text] }));
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isSelected = item.path === location.pathname;
    const hasChildren = item.children && item.children.length > 0;
    const isSubMenuOpen = openSubMenus[item.text] || false;

    return (
      <React.Fragment key={item.text}>
        <ListItem
          button
          onClick={() => {
            if (hasChildren) {
              handleSubMenuToggle(item.text);
            } else if (item.path) {
              navigate(item.path);
            }
          }}
          sx={{
            pl: depth * 2 + 2,
            bgcolor: isSelected ? 'action.selected' : 'transparent',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
          {hasChildren && (isSubMenuOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        {hasChildren && item.children && (
          <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Algo360FX
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            ...(!open && {
              width: theme.spacing(7),
              overflowX: 'hidden',
            }),
          },
        }}
        open={open}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map(item => renderMenuItem(item))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;
