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
  Divider,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TrendingUp,
  AccountBalance,
  Build,
  Analytics,
  AutoMode,
  Newspaper,
  Event,
  Token,
  School,
  Person,
  ExpandLess,
  ExpandMore,
  ShowChart,
  History,
  ListAlt,
  Speed,
  Timeline,
  Psychology,
  Architecture,
  Business,
  School as EducationIcon,
  Api,
  MenuBook,
  SupervisorAccount,
  Assessment,
  Storefront,
  Settings,
  Login,
  PersonAdd,
  VerifiedUser,
  LockReset,
  SmartToy,
  QueryStats,
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
      { text: 'Platform', icon: <ShowChart />, path: '/trading' },
      { text: 'MT5', icon: <Speed />, path: '/trading/mt5' },
      { text: 'HFT', icon: <Speed />, path: '/trading/hft' },
      { text: 'Advanced', icon: <Build />, path: '/trading/advanced' },
    ],
  },
  {
    text: 'Portfolio & Analysis',
    icon: <Analytics />,
    children: [
      { text: 'Portfolio', icon: <AccountBalance />, path: '/portfolio' },
      { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
      { text: 'Strategies', icon: <Psychology />, path: '/strategies' },
      { text: 'Risk Management', icon: <Assessment />, path: '/risk-management' },
    ],
  },
  {
    text: 'Market & News',
    icon: <Newspaper />,
    children: [
      { text: 'News', icon: <Newspaper />, path: '/news' },
      { text: 'NFT', icon: <Token />, path: '/nft' },
      { text: 'NFT Marketplace', icon: <Storefront />, path: '/nft/marketplace' },
    ],
  },
  {
    text: 'Portals',
    icon: <Business />,
    children: [
      { text: 'Broker Portal', icon: <SupervisorAccount />, path: '/broker' },
      { text: 'Investor Portal', icon: <Business />, path: '/investor' },
      { text: 'Signal Provider', icon: <Timeline />, path: '/signal-provider' },
    ],
  },
  {
    text: 'Education',
    icon: <School />,
    children: [
      { text: 'Academy', icon: <EducationIcon />, path: '/academy' },
      { text: 'AI Agent', icon: <SmartToy />, path: '/ai-agent' },
    ],
  },
  {
    text: 'User',
    icon: <Person />,
    children: [
      { text: 'Profile', icon: <Person />, path: '/profile' },
      { text: 'Subscription', icon: <ListAlt />, path: '/subscription' },
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
        {hasChildren && (
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
