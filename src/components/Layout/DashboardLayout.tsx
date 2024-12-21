import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Divider,
  Collapse,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShowChart,
  Store,
  AccountBalance,
  Settings,
  Person,
  TrendingUp,
  Assessment,
  School,
  BarChart,
  ExpandLess,
  ExpandMore,
  AutoGraph,
  Article,
  Event,
  Description,
  MenuBook,
  Dashboard,
  Security,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import SearchResults from '../SearchResults/SearchResults';
import './DashboardLayout.css';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Trading', icon: <TrendingUp />, path: '/dashboard/trading' },
  { text: 'Portfolio', icon: <AccountBalance />, path: '/dashboard/portfolio' },
  { text: 'Market Data', icon: <ShowChart />, path: '/dashboard/market-data' },
  { text: 'Trading Academy', icon: <School />, path: '/dashboard/academy' },
  { text: 'Risk Management', icon: <Security />, path: '/dashboard/risk-management' },
];

const advancedMenuItems = [
  { text: 'Strategy Builder', icon: <AutoGraph />, path: '/dashboard/strategy' },
  { text: 'Strategy Marketplace', icon: <Store />, path: '/dashboard/strategy-marketplace' },
  { text: 'Portfolio Optimizer', icon: <Assessment />, path: '/dashboard/portfolio-optimizer' },
];

const documentationMenuItems = [
  { text: 'News', icon: <Article />, path: '/dashboard/news' },
  { text: 'Calendar', icon: <Event />, path: '/dashboard/calendar' },
  { text: 'Reports', icon: <Description />, path: '/dashboard/reports' },
  { text: 'Documentation', icon: <MenuBook />, path: '/dashboard/documentation' },
];

const settingsMenuItems = [
  { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  { text: 'Profile', icon: <Person />, path: '/dashboard/profile' },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { searchTerm, setSearchTerm, performSearch } = useSearch();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const allPages = [
    ...menuItems,
    ...advancedMenuItems,
    ...documentationMenuItems,
    ...settingsMenuItems,
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAdvancedClick = () => {
    setAdvancedOpen(!advancedOpen);
  };

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Algo360FX
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            className={location.pathname === item.path ? 'active-menu-item' : ''}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        <ListItem button onClick={handleAdvancedClick}>
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Advanced Features" />
          {advancedOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={advancedOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {advancedMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                className={location.pathname === item.path ? 'active-menu-item' : ''}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <Divider sx={{ my: 1 }} />

        {documentationMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            className={location.pathname === item.path ? 'active-menu-item' : ''}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        {settingsMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            className={location.pathname === item.path ? 'active-menu-item' : ''}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' } }}>
            Algo360FX
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
