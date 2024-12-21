import React from 'react';
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
import { useTheme } from '@mui/material';
import { EquityCurve } from '../../types/trading';

interface PerformanceChartProps {
  data: EquityCurve[];
  height?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, height = 400 }) => {
  const theme = useTheme();

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatDate}
          stroke={theme.palette.text.primary}
        />
        <YAxis
          tickFormatter={formatValue}
          stroke={theme.palette.text.primary}
        />
        <Tooltip
          formatter={formatValue}
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="equity"
          name="Equity"
          stroke={theme.palette.primary.main}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="drawdown"
          name="Drawdown"
          stroke={theme.palette.error.main}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
