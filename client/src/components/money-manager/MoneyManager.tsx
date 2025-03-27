import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  AccountBalance,
  ShowChart,
  PieChart,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';
import { Overview } from './Overview';
import { PositionSizeCalculator } from './PositionSizeCalculator';
import { RiskParametersPanel } from './RiskParametersPanel';
import { TradeValidation } from './TradeValidation';
import { PerformanceAnalytics } from './PerformanceAnalytics';
import { AssetAllocation } from './AssetAllocation';
import { Reports } from './Reports';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`money-manager-tabpanel-${index}`}
      aria-labelledby={`money-manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const MoneyManager = observer(() => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="money manager tabs"
        >
          <Tab icon={<Dashboard />} label="OVERVIEW" />
          <Tab icon={<AccountBalance />} label="PORTFOLIO MANAGEMENT" />
          <Tab icon={<ShowChart />} label="PERFORMANCE ANALYTICS" />
          <Tab icon={<PieChart />} label="ASSET ALLOCATION" />
          <Tab icon={<TrendingUp />} label="TRADING ACTIVITY" />
          <Tab icon={<Assessment />} label="REPORTS" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Overview />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Portfolio Management
          </Typography>
          <Box sx={{ mt: 2 }}>
            <PositionSizeCalculator />
          </Box>
          <Box sx={{ mt: 4 }}>
            <RiskParametersPanel />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <PerformanceAnalytics />
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <AssetAllocation />
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Trading Activity
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TradeValidation />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Reports />
      </TabPanel>
    </Box>
  );
});
