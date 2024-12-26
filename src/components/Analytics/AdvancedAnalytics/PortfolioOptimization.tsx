import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

interface PortfolioOptimizationProps {
  data: Array<{
    id: string;
    data: Array<{ x: number; y: number }>;
  }>;
}

const PortfolioOptimization: React.FC<PortfolioOptimizationProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '400px', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Efficient Frontier Analysis
      </Typography>
      <Box sx={{ height: '90%' }}>
        <ResponsiveScatterPlot
          data={data}
          margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
          xScale={{ type: 'linear', min: 0, max: 'auto' }}
          xFormat=">-.2%"
          yScale={{ type: 'linear', min: 0, max: 'auto' }}
          yFormat=">-.2%"
          blendMode="multiply"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Risk (Volatility)',
            legendPosition: 'middle',
            legendOffset: 46
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Expected Return',
            legendPosition: 'middle',
            legendOffset: -60
          }}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 130,
              translateY: 0,
              itemWidth: 100,
              itemHeight: 12,
              itemsSpacing: 5,
              itemDirection: 'left-to-right',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </Box>
    </Card>
  );
};

export default PortfolioOptimization;
