import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';

interface VolatilityAnalysisProps {
  data: Array<{
    id: string;
    data: Array<{ x: string | Date; y: number }>;
  }>;
}

const VolatilityAnalysis: React.FC<VolatilityAnalysisProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '400px', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Historical Volatility Analysis
      </Typography>
      <Box sx={{ height: '90%' }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: '%b %d',
            tickValues: 'every 2 weeks',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Volatility (%)',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
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

export default VolatilityAnalysis;
