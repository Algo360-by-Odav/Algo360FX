import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import TradingInterface from '../../components/trading/TradingInterface';
import TradingChart from '../../components/trading/TradingChart';
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
      id={`trading-tabpanel-${index}`}
      aria-labelledby={`trading-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Trading: React.FC = observer(() => {
  const [activeTab, setActiveTab] = React.useState(0);
  const preferencesStore = useUserPreferencesStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#111827', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Trading
            </Typography>
          </Grid>

          {/* Chart Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 0, backgroundColor: '#1F2937', height: '500px' }}>
              <TradingChart />
            </Paper>
          </Grid>

          {/* Trading Interface */}
          <Grid item xs={12}>
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
                <Tab label="Spot Trading" />
                <Tab label="Margin Trading" />
                <Tab label="Futures" />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <TradingInterface />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Margin Trading - Coming Soon
                  </Typography>
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Futures Trading - Coming Soon
                  </Typography>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default Trading;
