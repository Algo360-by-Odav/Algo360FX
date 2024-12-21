import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { RiskMetrics } from '../../risk/types';

interface RiskChartsProps {
  timeRange: string;
}

const RiskCharts: React.FC<RiskChartsProps> = observer(({ timeRange }) => {
  const rootStore = useRootStore();
  const { riskStore } = rootStore;
  const historicalMetrics = riskStore.getRiskMetricsHistory();

  const theme = useTheme();

  const formatDrawdownData = () => {
    return historicalMetrics.map((metric, index) => ({
      time: new Date(Date.now() - (historicalMetrics.length - index) * 86400000).toLocaleDateString(),
      drawdown: metric.drawdown.current * 100,
      maxDrawdown: metric.drawdown.maximum * 100,
    }));
  };

  const formatVolatilityData = () => {
    return historicalMetrics.map((metric, index) => ({
      time: new Date(Date.now() - (historicalMetrics.length - index) * 86400000).toLocaleDateString(),
      volatility: metric.volatility * 100,
      var: metric.valueAtRisk * 100,
      es: metric.expectedShortfall * 100,
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Drawdown Analysis
          </Typography>
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <AreaChart
                data={formatDrawdownData()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="drawdown"
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.light}
                  fillOpacity={0.3}
                  name="Current Drawdown (%)"
                />
                <Area
                  type="monotone"
                  dataKey="maxDrawdown"
                  stroke={theme.palette.error.main}
                  fill={theme.palette.error.light}
                  fillOpacity={0.3}
                  name="Maximum Drawdown (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Risk Metrics
          </Typography>
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart
                data={formatVolatilityData()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volatility"
                  stroke={theme.palette.primary.main}
                  name="Volatility (%)"
                />
                <Line
                  type="monotone"
                  dataKey="var"
                  stroke={theme.palette.warning.main}
                  name="Value at Risk (%)"
                />
                <Line
                  type="monotone"
                  dataKey="es"
                  stroke={theme.palette.error.main}
                  name="Expected Shortfall (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
});

export default RiskCharts;
