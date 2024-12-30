import React from 'react';
import { Box, Typography } from '@mui/material';
import { scaleLinear } from 'd3-scale';

interface CorrelationMatrixProps {
  data: {
    parameters: string[];
    values: number[][];
  };
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data }) => {
  const colorScale = scaleLinear<string>()
    .domain([-1, 0, 1])
    .range(['#f44336', '#ffffff', '#4caf50']);

  const cellSize = 40;
  const padding = 4;

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      {/* Column Headers */}
      <Box sx={{ display: 'flex', ml: cellSize + padding }}>
        {data.parameters.map((param) => (
          <Box
            key={`header-${param}`}
            sx={{
              width: cellSize,
              height: cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-45deg)',
              transformOrigin: 'bottom left',
              whiteSpace: 'nowrap',
              position: 'relative',
              left: cellSize / 2,
            }}
          >
            <Typography variant="caption">{param}</Typography>
          </Box>
        ))}
      </Box>

      {/* Matrix */}
      <Box>
        {data.parameters.map((rowParam, i) => (
          <Box
            key={`row-${rowParam}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Row Header */}
            <Box
              sx={{
                width: cellSize,
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                pr: 1,
              }}
            >
              <Typography variant="caption">{rowParam}</Typography>
            </Box>

            {/* Correlation Cells */}
            {data.values[i].map((value, j) => (
              <Box
                key={`cell-${i}-${j}`}
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: colorScale(value),
                  margin: `${padding / 2}px`,
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
                    color: Math.abs(value) > 0.5 ? 'white' : 'black',
                  }}
                >
                  {value.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CorrelationMatrix;
