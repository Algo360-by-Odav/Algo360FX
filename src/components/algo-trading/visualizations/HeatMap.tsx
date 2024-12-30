import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { scaleLinear } from 'd3-scale';

interface HeatMapProps {
  data: {
    hour: number;
    value: number;
    trades: number;
    winRate: number;
  }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  // Calculate color scale based on values
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const colorScale = scaleLinear<string>()
    .domain([minValue, 0, maxValue])
    .range(['#f44336', '#ffffff', '#4caf50']);

  const cellSize = 40;
  const padding = 4;

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: padding,
        }}
      >
        {data.map((hour) => (
          <Tooltip
            key={hour.hour}
            title={
              <Box>
                <Typography variant="body2">
                  Hour: {hour.hour}:00
                </Typography>
                <Typography variant="body2">
                  Profit: ${hour.value.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Trades: {hour.trades}
                </Typography>
                <Typography variant="body2">
                  Win Rate: {(hour.winRate * 100).toFixed(1)}%
                </Typography>
              </Box>
            }
          >
            <Box
              sx={{
                width: cellSize,
                height: cellSize,
                backgroundColor: colorScale(hour.value),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: Math.abs(hour.value) > (maxValue - minValue) / 4 ? 'white' : 'black',
                }}
              >
                {hour.hour}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default HeatMap;
