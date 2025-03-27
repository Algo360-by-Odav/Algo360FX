import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  Search,
  AccountBalance,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { InvestorDashboard } from '../components/investor-portal/InvestorDashboard';
import PortfolioOverview from '../components/investor-portal/PortfolioOverview';
import InvestmentOpportunities from '../components/investor-portal/InvestmentOpportunities';
import InvestmentAnalytics from '../components/investor-portal/InvestmentAnalytics';
import InvestorSettings from '../components/investor-portal/InvestorSettings';

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
      id={`investor-portal-tabpanel-${index}`}
      aria-labelledby={`investor-portal-tab-${index}`}
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

export const InvestorPortalPage: React.FC = observer(() => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Paper
        sx={{
          borderRadius: 0,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab
            icon={<Dashboard />}
            label="Dashboard"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<AccountBalance />}
            label="Portfolio"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<Search />}
            label="Opportunities"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<Assessment />}
            label="Analytics"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<Settings />}
            label="Settings"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <InvestorDashboard />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <PortfolioOverview />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <InvestmentOpportunities />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <InvestmentAnalytics />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <InvestorSettings />
      </TabPanel>
    </Box>
  );
});

export default InvestorPortalPage;
