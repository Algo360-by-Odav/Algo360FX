import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Add as ZoomInIcon,
  Remove as ZoomOutIcon,
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with real data from your trading platform
const generateMockData = (days: number) => {
  const data = [];
  const startPrice = 1.0850;
  let currentPrice = startPrice;

  for (let i = 0; i < days; i++) {
    currentPrice += (Math.random() - 0.5) * 0.002;
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: currentPrice,
    });
  }
  return data;
};

const TradingChart: React.FC = observer(() => {
  const [timeframe, setTimeframe] = useState('1D');
  const data = generateMockData(30);

  const handleTimeframeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeframe: string | null,
  ) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            EURUSD
          </Typography>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleTimeframeChange}
            size="small"
          >
            <ToggleButton value="1H">1H</ToggleButton>
            <ToggleButton value="4H">4H</ToggleButton>
            <ToggleButton value="1D">1D</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box>
          <IconButton size="small">
            <ZoomOutIcon />
          </IconButton>
          <IconButton size="small">
            <ZoomInIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ height: 'calc(100% - 48px)', width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1976d2" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.split('-').slice(1).join('/')}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(4)}
            />
            <Tooltip
              formatter={(value: number) => [value.toFixed(4), 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1976d2"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
});

export default TradingChart;
