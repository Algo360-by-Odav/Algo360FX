import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../hooks/useRootStore';
import ChartWidget from '../components/Chart/ChartWidget';

interface Strategy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters: Record<string, number>;
}

const defaultStrategies: Strategy[] = [
  {
    id: 'scalping',
    name: 'Scalping Strategy',
    description: 'High-frequency trading with small profit targets',
    enabled: false,
    parameters: {
      takeProfit: 5,
      stopLoss: 3,
      tradeSize: 0.01,
      maxOpenTrades: 5,
    },
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage Strategy',
    description: 'Exploit price differences across exchanges',
    enabled: false,
    parameters: {
      minSpread: 2,
      maxLatency: 100,
      tradeSize: 0.01,
      maxExposure: 0.05,
    },
  },
];

const HFT: React.FC = observer(() => {
  const { hftStore } = useRootStore();
  const [strategies, setStrategies] = useState<Strategy[]>(defaultStrategies);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performance, setPerformance] = useState({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    sharpeRatio: 0,
  });

  const handleStrategyToggle = (strategyId: string) => {
    setStrategies(prevStrategies =>
      prevStrategies.map(strategy =>
        strategy.id === strategyId
          ? { ...strategy, enabled: !strategy.enabled }
          : strategy
      )
    );
  };

  const handleParameterChange = (strategyId: string, param: string, value: string) => {
    setStrategies(prevStrategies =>
      prevStrategies.map(strategy =>
        strategy.id === strategyId
          ? {
              ...strategy,
              parameters: {
                ...strategy.parameters,
                [param]: Number(value),
              },
            }
          : strategy
      )
    );
  };

  const handleStartStop = () => {
    setIsRunning(prev => !prev);
    // Here you would typically start/stop your HFT strategies
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2, height: '100%', overflow: 'auto' }}>
      <Grid container spacing={2}>
        {/* Main Chart and Controls */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">HFT Dashboard</Typography>
                    <Button
                      variant="contained"
                      color={isRunning ? 'error' : 'primary'}
                      onClick={handleStartStop}
                    >
                      {isRunning ? 'Stop HFT' : 'Start HFT'}
                    </Button>
                  </Box>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <ChartWidget
                    symbol={selectedSymbol}
                    interval="1m"
                    onSymbolChange={setSelectedSymbol}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2">Total Trades</Typography>
                      <Typography variant="h6">{performance.totalTrades}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2">Win Rate</Typography>
                      <Typography variant="h6">{performance.winRate}%</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2">Profit Factor</Typography>
                      <Typography variant="h6">{performance.profitFactor}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2">Sharpe Ratio</Typography>
                      <Typography variant="h6">{performance.sharpeRatio}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Strategy Controls */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                HFT Strategies
              </Typography>
              {strategies.map((strategy) => (
                <Box key={strategy.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">{strategy.name}</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={strategy.enabled}
                          onChange={() => handleStrategyToggle(strategy.id)}
                          disabled={isRunning}
                        />
                      }
                      label={strategy.enabled ? 'Enabled' : 'Disabled'}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {strategy.description}
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(strategy.parameters).map(([param, value]) => (
                      <Grid item xs={6} key={param}>
                        <TextField
                          label={param
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())}
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleParameterChange(strategy.id, param, e.target.value)
                          }
                          disabled={isRunning}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default HFT;
