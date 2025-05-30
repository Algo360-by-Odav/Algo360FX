import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as PortfolioIcon,
  Analytics as AnalyticsIcon,
  People as ClientsIcon,
  SwapVert as TradingActivityIcon,
  AccountTree as AssetAllocationIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MoneyManager: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const stats = [
    { title: 'Assets Under Management', value: '$125M', icon: <PortfolioIcon /> },
    { title: 'Active Portfolios', value: '85', icon: <DashboardIcon /> },
    { title: 'Monthly Return', value: '+8.5%', color: '#4CAF50', icon: <AnalyticsIcon /> },
    { title: 'Total Clients', value: '320', icon: <ClientsIcon /> },
  ];

  const strategies = [
    { name: 'Conservative', return: '+6.2%', risk: 'Low' },
    { name: 'Balanced', return: '+7.8%', risk: 'Medium' },
    { name: 'Aggressive', return: '+12.4%', risk: 'High' },
    { name: 'Forex Focus', return: '+9.6%', risk: 'Medium-High' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Money Manager Portal
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Professional portfolio management and performance tracking
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    {stat.icon}
                  </IconButton>
                  <Typography variant="h6" component="div">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  component="div"
                  sx={{ 
                    color: stat.color || 'text.primary',
                    fontWeight: 'bold'
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="money manager tabs">
          <Tab icon={<DashboardIcon />} label="DASHBOARD" />
          <Tab icon={<PortfolioIcon />} label="PORTFOLIO MANAGEMENT" />
          <Tab icon={<AnalyticsIcon />} label="PERFORMANCE ANALYTICS" />
          <Tab icon={<AssetAllocationIcon />} label="ASSET ALLOCATION" />
          <Tab icon={<TradingActivityIcon />} label="TRADING ACTIVITY" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '400px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Performance Overview
                </Typography>
                {/* Add chart component here */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Strategy Performance
                </Typography>
                {strategies.map((strategy, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1">
                        {strategy.name}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: parseFloat(strategy.return) > 0 ? '#4CAF50' : '#f44336'
                        }}
                      >
                        {strategy.return}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(strategy.return)} 
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: strategy.risk === 'Low' ? '#4CAF50' : 
                                         strategy.risk === 'Medium' ? '#FF9800' : 
                                         '#f44336'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Risk Level: {strategy.risk}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography>Portfolio Management Content</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography>Performance Analytics Content</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography>Asset Allocation Content</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Typography>Trading Activity Content</Typography>
      </TabPanel>
    </Box>
  );
};

export default MoneyManager;
