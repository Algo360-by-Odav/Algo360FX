import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/RootStoreContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HFTSignal, HFTStrategyConfig, HFTPerformanceSnapshot } from '../../hft/types';

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
      id={`hft-tabpanel-${index}`}
      aria-labelledby={`hft-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const HFTDashboard = observer(() => {
  const rootStore = useRootStore();
  const { hftStore } = rootStore;
  const [tabValue, setTabValue] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  useEffect(() => {
    hftStore.startMonitoring();
    return () => hftStore.stopMonitoring();
  }, [hftStore]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderPerformanceMetrics = () => {
    const history = hftStore.getPerformanceHistory();
    const latest = history[history.length - 1];

    if (!latest) return null;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Performance Metrics</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Sharpe Ratio</TableCell>
                  <TableCell>{latest.metrics.sharpeRatio.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Win Rate</TableCell>
                  <TableCell>{(latest.metrics.winRate * 100).toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Profit Factor</TableCell>
                  <TableCell>{latest.metrics.profitFactor.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Max Drawdown</TableCell>
                  <TableCell>{(latest.metrics.maxDrawdown * 100).toFixed(2)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Latency Metrics</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Mean Latency</TableCell>
                  <TableCell>{latest.metrics.latency.mean.toFixed(2)} ms</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>P95 Latency</TableCell>
                  <TableCell>{latest.metrics.latency.p95.toFixed(2)} ms</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>P99 Latency</TableCell>
                  <TableCell>{latest.metrics.latency.p99.toFixed(2)} ms</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderSignals = () => {
    const strategies = hftStore.getActiveStrategies();
    const signals = selectedStrategy
      ? hftStore.getLatestSignals(selectedStrategy)
      : strategies.flatMap(s => hftStore.getLatestSignals(s.name));

    return (
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Active Signals</Typography>
          {strategies.map(strategy => (
            <Button
              key={strategy.name}
              variant={selectedStrategy === strategy.name ? 'contained' : 'outlined'}
              onClick={() => setSelectedStrategy(strategy.name)}
              sx={{ mr: 1, mb: 1 }}
            >
              {strategy.name}
            </Button>
          ))}
          {selectedStrategy && (
            <Button
              variant="outlined"
              onClick={() => setSelectedStrategy(null)}
              sx={{ mb: 1 }}
            >
              Show All
            </Button>
          )}
        </Box>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Direction</TableCell>
                <TableCell>Strength</TableCell>
                <TableCell>Confidence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signals.map((signal, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(signal.timestamp).toLocaleTimeString()}</TableCell>
                  <TableCell>{signal.symbol}</TableCell>
                  <TableCell>{signal.type}</TableCell>
                  <TableCell>{signal.direction}</TableCell>
                  <TableCell>{signal.strength.toFixed(2)}</TableCell>
                  <TableCell>{signal.confidence}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderOrderFlow = () => {
    const history = hftStore.getPerformanceHistory();
    const latest = history[history.length - 1];

    if (!latest) return null;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Order Flow Metrics</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>VWAP</TableCell>
                  <TableCell>{latest.orderFlow.volumeWeightedPrice.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Buy Volume</TableCell>
                  <TableCell>{latest.orderFlow.buyVolume.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sell Volume</TableCell>
                  <TableCell>{latest.orderFlow.sellVolume.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Volume Imbalance</TableCell>
                  <TableCell>{(latest.orderFlow.volumeImbalance * 100).toFixed(2)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Market Making Metrics</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Inventory Level</TableCell>
                  <TableCell>{latest.marketMaking.inventoryLevel.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Spread Capture</TableCell>
                  <TableCell>{(latest.marketMaking.spreadCapture * 100).toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fill Ratio</TableCell>
                  <TableCell>{(latest.marketMaking.fillRatio * 100).toFixed(2)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderPositions = () => {
    const history = hftStore.getPerformanceHistory();
    const latest = history[history.length - 1];

    if (!latest) return null;

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Entry Price</TableCell>
              <TableCell>Unrealized P/L</TableCell>
              <TableCell>Holding Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latest.positions.map((position, index) => (
              <TableRow key={index}>
                <TableCell>{position.symbol}</TableCell>
                <TableCell>{position.size}</TableCell>
                <TableCell>{position.entryPrice.toFixed(2)}</TableCell>
                <TableCell>{position.unrealizedPnL.toFixed(2)}</TableCell>
                <TableCell>{Math.floor(position.holdingTime / 1000)}s</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        High-Frequency Trading Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Performance" />
          <Tab label="Signals" />
          <Tab label="Order Flow" />
          <Tab label="Positions" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderPerformanceMetrics()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderSignals()}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderOrderFlow()}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderPositions()}
      </TabPanel>
    </Box>
  );
});

export default HFTDashboard;
