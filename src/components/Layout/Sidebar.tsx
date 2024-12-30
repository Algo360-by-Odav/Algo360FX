import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard,
  ShowChart,
  Assessment,
  Settings,
  Timeline,
  AccountBalance,
  Build,
  ExpandLess,
  ExpandMore,
  Speed,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';

const Sidebar: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authStore } = useStore();
  const [tradingOpen, setTradingOpen] = React.useState(true);
  const [advancedTradingOpen, setAdvancedTradingOpen] = React.useState(true);
  const [analyticsOpen, setAnalyticsOpen] = React.useState(true);
  const [strategyOpen, setStrategyOpen] = React.useState(true);
  const [portfolioOpen, setPortfolioOpen] = React.useState(true);

  const handleTradingClick = () => {
    setTradingOpen(!tradingOpen);
  };

  const handleAdvancedTradingClick = () => {
    setAdvancedTradingOpen(!advancedTradingOpen);
  };

  const handleAnalyticsClick = () => {
    setAnalyticsOpen(!analyticsOpen);
  };

  const handleStrategyClick = () => {
    setStrategyOpen(!strategyOpen);
  };

  const handlePortfolioClick = () => {
    setPortfolioOpen(!portfolioOpen);
  };

  const isSelected = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/app/dashboard', icon: <Dashboard />, text: 'Dashboard' },
    {
      icon: <ShowChart />,
      text: 'Trading',
      subItems: [
        { path: '/app/trading/spot', text: 'Spot Trading' },
        { path: '/app/trading/futures', text: 'Futures' },
        { path: '/app/trading/orders', text: 'Orders' },
        { path: '/app/trading/positions', text: 'Positions' },
      ],
    },
    {
      icon: <Speed />,
      text: 'Advanced Trading',
      subItems: [
        { path: '/app/hft', text: 'High Frequency' },
        { path: '/app/auto-trading', text: 'Auto Trading' },
        { path: '/app/grid-trading', text: 'Grid Trading' },
        { path: '/app/arbitrage', text: 'Arbitrage' },
      ],
    },
    {
      icon: <Assessment />,
      text: 'Analytics',
      subItems: [
        { path: '/app/analytics/performance', text: 'Performance' },
        { path: '/app/analytics/risk', text: 'Risk Analysis' },
        { path: '/app/analytics/journal', text: 'Trading Journal' },
        { path: '/app/analytics/reports', text: 'Reports' },
      ],
    },
    {
      icon: <Timeline />,
      text: 'Strategy',
      subItems: [
        { path: '/app/strategy/builder', text: 'Strategy Builder' },
        { path: '/app/strategy/backtesting', text: 'Backtesting' },
        { path: '/app/strategy/optimizer', text: 'Optimizer' },
        { path: '/app/strategy/marketplace', text: 'Marketplace' },
      ],
    },
    {
      icon: <AccountBalance />,
      text: 'Portfolio',
      subItems: [
        { path: '/app/portfolio/overview', text: 'Overview' },
        { path: '/app/portfolio/allocation', text: 'Allocation' },
        { path: '/app/portfolio/optimizer', text: 'Portfolio Optimizer' },
        { path: '/app/portfolio/risk', text: 'Risk Management' },
      ],
    },
    { path: '/app/settings', icon: <Settings />, text: 'Settings' },
  ];

  return (
    <List>
      {menuItems.map((item, index) => (
        <React.Fragment key={item.text}>
          {item.subItems ? (
            <>
              <ListItemButton
                onClick={
                  item.text === 'Trading'
                    ? handleTradingClick
                    : item.text === 'Advanced Trading'
                    ? handleAdvancedTradingClick
                    : item.text === 'Analytics'
                    ? handleAnalyticsClick
                    : item.text === 'Strategy'
                    ? handleStrategyClick
                    : item.text === 'Portfolio'
                    ? handlePortfolioClick
                    : undefined
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.text === 'Trading' ? (
                  tradingOpen ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : item.text === 'Advanced Trading' ? (
                  advancedTradingOpen ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : item.text === 'Analytics' ? (
                  analyticsOpen ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : item.text === 'Strategy' ? (
                  strategyOpen ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : item.text === 'Portfolio' ? (
                  portfolioOpen ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItemButton>
              <Collapse
                in={
                  item.text === 'Trading'
                    ? tradingOpen
                    : item.text === 'Advanced Trading'
                    ? advancedTradingOpen
                    : item.text === 'Analytics'
                    ? analyticsOpen
                    : item.text === 'Strategy'
                    ? strategyOpen
                    : item.text === 'Portfolio'
                    ? portfolioOpen
                    : false
                }
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      sx={{ pl: 4 }}
                      selected={isSelected(subItem.path)}
                      onClick={() => navigate(subItem.path)}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          ) : (
            <ListItemButton
              selected={isSelected(item.path)}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          )}
          {index < menuItems.length - 1 && (
            <Divider key={`divider-${item.text}`} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
});

export default Sidebar;
