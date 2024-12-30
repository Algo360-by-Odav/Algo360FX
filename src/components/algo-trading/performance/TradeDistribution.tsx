import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface TradeDistributionProps {
  distribution: {
    byOutcome: {
      winners: number;
      losers: number;
      breakeven: number;
    };
    byTimeOfDay: {
      hour: number;
      trades: number;
      winRate: number;
    }[];
    byDayOfWeek: {
      day: string;
      trades: number;
      winRate: number;
    }[];
    byProfitRange: {
      range: string;
      count: number;
    }[];
  };
}

const COLORS = ['#4caf50', '#f44336', '#ff9800'];

const TradeDistribution: React.FC<TradeDistributionProps> = ({
  distribution,
}) => {
  const outcomeData = [
    { name: 'Winners', value: distribution.byOutcome.winners },
    { name: 'Losers', value: distribution.byOutcome.losers },
    { name: 'Breakeven', value: distribution.byOutcome.breakeven },
  ];

  return (
    <Paper
      sx={{
        p: 2,
        mb: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'white' }}>
        Trade Distribution Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Trade Outcomes */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Trade Outcomes
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    name,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {`${name} (${value})`}
                      </text>
                    );
                  }}
                >
                  {outcomeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  labelStyle={{ color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Trading Hours */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Trading Hours Performance
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution.byTimeOfDay}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(hour) =>
                    `${hour.toString().padStart(2, '0')}:00`
                  }
                  stroke="rgba(255, 255, 255, 0.7)"
                />
                <YAxis
                  yAxisId="left"
                  stroke="rgba(255, 255, 255, 0.7)"
                  tickFormatter={(value) => value.toString()}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255, 255, 255, 0.7)"
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  labelStyle={{ color: 'white' }}
                  formatter={(value: number, name: string) => [
                    name === 'winRate'
                      ? formatPercentage(value)
                      : value.toString(),
                    name === 'winRate' ? 'Win Rate' : 'Trades',
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="trades"
                  fill="#2196f3"
                  name="Trades"
                />
                <Bar
                  yAxisId="right"
                  dataKey="winRate"
                  fill="#4caf50"
                  name="Win Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Day of Week Performance */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Day of Week Performance
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution.byDayOfWeek}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255, 255, 255, 0.7)"
                />
                <YAxis
                  yAxisId="left"
                  stroke="rgba(255, 255, 255, 0.7)"
                  tickFormatter={(value) => value.toString()}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255, 255, 255, 0.7)"
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  labelStyle={{ color: 'white' }}
                  formatter={(value: number, name: string) => [
                    name === 'winRate'
                      ? formatPercentage(value)
                      : value.toString(),
                    name === 'winRate' ? 'Win Rate' : 'Trades',
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="trades"
                  fill="#2196f3"
                  name="Trades"
                />
                <Bar
                  yAxisId="right"
                  dataKey="winRate"
                  fill="#4caf50"
                  name="Win Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Profit Distribution */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Profit Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution.byProfitRange}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis
                  dataKey="range"
                  stroke="rgba(255, 255, 255, 0.7)"
                />
                <YAxis
                  stroke="rgba(255, 255, 255, 0.7)"
                  tickFormatter={(value) => value.toString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  labelStyle={{ color: 'white' }}
                />
                <Bar dataKey="count" fill="#2196f3" name="Trades" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TradeDistribution;
