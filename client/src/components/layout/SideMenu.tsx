import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Analytics as AnalyticsIcon,
  School as AcademyIcon,
  AccountBalance as BrokerIcon,
  Security as RiskIcon,
  Person as InvestorIcon,
  SignalCellularAlt as SignalIcon,
  Newspaper as NewsIcon,
  SmartToy as AIIcon,
  Collections as NFTIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

const menuItems = [
  {
    category: 'Overview',
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
      { title: 'Portfolio', path: '/dashboard/portfolio', icon: <TrendingUp /> },
    ],
  },
  {
    category: 'Trading',
    items: [
      { title: 'Trading Platform', path: '/dashboard/trading', icon: <TrendingUp /> },
      { title: 'Advanced Trading', path: '/dashboard/advanced-trading', icon: <AnalyticsIcon /> },
      { title: 'HFT', path: '/dashboard/hft', icon: <TrendingUp /> },
      { title: 'MT5', path: '/dashboard/mt5', icon: <TrendingUp /> },
    ],
  },
  {
    category: 'Analysis & AI',
    items: [
      { title: 'Market Analysis', path: '/dashboard/analysis', icon: <AnalyticsIcon /> },
      { title: 'AI Assistant', path: '/dashboard/ai-agent', icon: <AIIcon /> },
    ],
  },
  {
    category: 'Digital Assets',
    items: [
      { title: 'NFT Marketplace', path: '/dashboard/nft-marketplace', icon: <NFTIcon /> },
    ],
  },
  {
    category: 'Services',
    items: [
      { title: 'News', path: '/dashboard/news', icon: <NewsIcon /> },
      { title: 'Risk Management', path: '/dashboard/risk-management', icon: <RiskIcon /> },
      { title: 'Signal Provider', path: '/dashboard/signal-provider', icon: <SignalIcon /> },
      { title: 'Broker Portal', path: '/dashboard/broker-portal', icon: <BrokerIcon /> },
      { title: 'Investor Portal', path: '/dashboard/investor-portal', icon: <InvestorIcon /> },
    ],
  },
  {
    category: 'Learn',
    items: [
      { title: 'Academy', path: '/dashboard/academy', icon: <AcademyIcon /> },
    ],
  },
  {
    category: 'Account',
    items: [
      { title: 'Subscription', path: '/dashboard/subscription', icon: <PaymentIcon /> },
    ],
  },
];

interface SideMenuProps {
  open: boolean;
}

const drawerWidth = 240;

const SideMenu = observer(({ open }: SideMenuProps) => {
  const navigate = useNavigate();

  const drawer = (
    <div>
      <Toolbar />
      {menuItems.map((category, index) => (
        <React.Fragment key={category.category}>
          {index > 0 && <Divider />}
          <List>
            {category.items.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            transform: open ? 'none' : 'translateX(-100%)',
            visibility: open ? 'visible' : 'hidden',
            transition: (theme) =>
              theme.transitions.create(['transform', 'visibility'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>
    </Box>
  );
});

export default SideMenu;
