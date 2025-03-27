import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  SignalCellular4Bar,
  Assessment,
  Settings,
  Search,
} from '@mui/icons-material';
import { SignalDashboard } from '../components/signal-provider/SignalDashboard';
import { ActiveSignals } from '../components/signal-provider/ActiveSignals';
import { ProviderAnalytics } from '../components/signal-provider/ProviderAnalytics';
import { SignalSettings } from '../components/signal-provider/SignalSettings';
import { ProviderSearch } from '../components/signal-provider/ProviderSearch';

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
      id={`signal-provider-tabpanel-${index}`}
      aria-labelledby={`signal-provider-tab-${index}`}
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

export const SignalProviderPage: React.FC = observer(() => {
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
            icon={<SignalCellular4Bar />}
            label="Active Signals"
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<Search />}
            label="Find Providers"
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
        <SignalDashboard />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <ActiveSignals />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ProviderSearch />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <ProviderAnalytics />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <SignalSettings />
      </TabPanel>
    </Box>
  );
});

export default SignalProviderPage;
