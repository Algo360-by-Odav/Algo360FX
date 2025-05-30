import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Speed,
  Memory,
  Timeline,
  Settings,
  PlayArrow,
  Stop,
  Refresh,
  Warning,
  CheckCircle,
  TrendingUp,
  NetworkCheck,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import { LineChart, BarChart } from '@mui/x-charts';

const HFTPage: React.FC = observer(() => {
  const { hftStore } = useStores();
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [latencyThreshold, setLatencyThreshold] = useState(1);
  const [orderSize, setOrderSize] = useState(0.1);
  const [maxPositions, setMaxPositions] = useState(5);

  const mockLatencyData = Array.from({ length: 50 }, (_, i) => ({
    time: new Date(Date.now() - (49 - i) * 1000),
    latency: Math.random() * 0.5 + 0.2,
  }));

  const mockStrategies = [
    { id: 'market-making', name: 'Market Making' },
    { id: 'statistical-arbitrage', name: 'Statistical Arbitrage' },
    { id: 'delta-neutral', name: 'Delta Neutral' },
    { id: 'momentum-ignition', name: 'Momentum Ignition' },
    { id: 'liquidity-detection', name: 'Liquidity Detection' },
  ];

  const renderSystemStatus = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Speed color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">Latency</Typography>
            </Box>
            <Typography variant="h6" color="primary">0.3ms</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Memory color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">Memory Usage</Typography>
            </Box>
            <Typography variant="h6" color="primary">45%</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <NetworkCheck color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">Network Status</Typography>
            </Box>
            <Typography variant="h6" color="success.main">Optimal</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">Active Strategies</Typography>
            </Box>
            <Typography variant="h6" color="primary">3</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderLatencyMonitor = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Latency Monitor
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <LineChart
            xAxis={[{ 
              data: mockLatencyData.map(d => d.time),
              scaleType: 'time',
            }]}
            series={[
              {
                data: mockLatencyData.map(d => d.latency),
                area: true,
                label: 'Latency (ms)',
              },
            ]}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const renderStrategyControls = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Strategy Controls
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Strategy</InputLabel>
              <Select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
              >
                {mockStrategies.map(strategy => (
                  <MenuItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Latency Threshold (ms)"
              type="number"
              value={latencyThreshold}
              onChange={(e) => setLatencyThreshold(Number(e.target.value))}
              inputProps={{ step: 0.1, min: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Order Size"
              type="number"
              value={orderSize}
              onChange={(e) => setOrderSize(Number(e.target.value))}
              inputProps={{ step: 0.01, min: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Positions"
              type="number"
              value={maxPositions}
              onChange={(e) => setMaxPositions(Number(e.target.value))}
              inputProps={{ step: 1, min: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Enable Dynamic Position Sizing"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Auto Risk Management"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrow />}
              >
                Start Strategy
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Stop />}
              >
                Stop Strategy
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
              >
                Reset Parameters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderActiveOrders = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Orders
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Latency</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{`ORD-${1000 + index}`}</TableCell>
                  <TableCell>EUR/USD</TableCell>
                  <TableCell>
                    <Chip
                      label={index % 2 === 0 ? 'BUY' : 'SELL'}
                      color={index % 2 === 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">0.1</TableCell>
                  <TableCell align="right">1.2345</TableCell>
                  <TableCell align="right">0.3ms</TableCell>
                  <TableCell>
                    <Chip
                      label="ACTIVE"
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        High-Frequency Trading
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderSystemStatus()}
        </Grid>

        <Grid item xs={12} md={8}>
          {renderLatencyMonitor()}
        </Grid>

        <Grid item xs={12} md={4}>
          {renderStrategyControls()}
        </Grid>

        <Grid item xs={12}>
          {renderActiveOrders()}
        </Grid>
      </Grid>
    </Box>
  );
});

export default HFTPage;

