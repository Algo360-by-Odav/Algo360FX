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
  CompareArrows as CompareIcon,
  Storage as StorageIcon,
  Memory as MiningIcon,
  AccountBalanceWallet as WalletIcon,
  SmartButton as RobotIcon,
} from '@mui/icons-material';
import { observer } from '../../utils/mobxMock';

// Define menu item interface
interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  external?: boolean;
  highlight?: boolean;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// Special highlighted item for Trading Agent
const tradingAgentItem = { 
  title: 'Trading Agent', 
  path: '/standalone-agent.html', 
  icon: <RobotIcon color="primary" />, 
  external: true,
  highlight: true 
};

const menuItems: MenuCategory[] = [
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
      tradingAgentItem, // Use the special highlighted item
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
      { title: 'Wallet', path: '/dashboard/wallet', icon: <WalletIcon /> },
    ],
  },
  {
    category: 'Mining',
    items: [
      { title: 'Mining Hub', path: '/dashboard/mining', icon: <MiningIcon /> },
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
      { title: 'Backend Demo', path: '/dashboard/backend-demo', icon: <StorageIcon /> },
      { title: 'Comparison', path: '/dashboard/comparison', icon: <CompareIcon /> },
      { title: 'Trading Agent (Alt)', path: '/standalone-agent.html', icon: <RobotIcon color="secondary" />, external: true },
    ],
  },
];

interface SideMenuProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const drawerWidth = 240;

const SideMenu = observer(({ open, handleDrawerToggle }: SideMenuProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string, isExternal = false) => {
    if (isExternal) {
      // Handle external links by directly changing window.location
      window.location.href = path;
    } else {
      // Use React Router for internal navigation
      navigate(path);
    }
    
    // Close drawer on mobile after navigation
    if (window.innerWidth < 600) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      {menuItems.map((category, index) => (
        <React.Fragment key={category.category}>
          {index > 0 && <Divider />}
          <List sx={{ py: 0 }}>
            {category.items.map((item: MenuItem) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path, item.external)}
                  sx={{ 
                    py: 1,
                    ...(item.highlight && {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.12)',
                      },
                      borderLeft: '4px solid #1976d2',
                      pl: 1.5,
                    })
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  />
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
      }}
      aria-label="main navigation"
    >
      {/* Mobile drawer (temporary) */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better mobile performance
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            overflowX: 'hidden',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer (permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
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
