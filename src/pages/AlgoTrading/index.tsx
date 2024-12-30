import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import StrategyBuilder from '../../components/algo-trading/StrategyBuilder';
import StrategyList from '../../components/algo-trading/StrategyList';
import BacktestRunner from '../../components/algo-trading/BacktestRunner';
import PerformanceAnalytics from '../../components/algo-trading/PerformanceAnalytics';
import StrategyTemplates from '../../components/algo-trading/StrategyTemplates';
import StrategyOptimization from '../../components/algo-trading/optimization/StrategyOptimization';
import { useUserPreferencesStore } from '../../stores/UserPreferencesStore';

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
      id={`algo-trading-tabpanel-${index}`}
      aria-labelledby={`algo-trading-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const AlgoTrading: React.FC = observer(() => {
  const [activeTab, setActiveTab] = useState(0);
  const preferencesStore = useUserPreferencesStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#111827', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
          Algorithmic Trading
        </Typography>

        <Paper sx={{ backgroundColor: '#1F2937' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .Mui-selected': { color: '#2196f3' },
            }}
          >
            <Tab label="Active Strategies" />
            <Tab label="Strategy Builder" />
            <Tab label="Backtesting" />
            <Tab label="Performance" />
            <Tab label="Strategy Templates" />
            <Tab label="Strategy Optimization" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <StrategyList />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <StrategyBuilder />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <BacktestRunner />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <PerformanceAnalytics />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <StrategyTemplates />
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <StrategyOptimization />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
});

export default AlgoTrading;
