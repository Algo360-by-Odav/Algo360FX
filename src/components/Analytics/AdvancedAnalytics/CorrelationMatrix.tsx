import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface CorrelationMatrixProps {
  data: {
    id: string;
    data: Array<{ x: string; y: number }>;
  }[];
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '400px', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Asset Correlation Matrix
      </Typography>
      <Box sx={{ height: '90%' }}>
        <ResponsiveHeatMap
          data={data}
          margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
          valueFormat=">-.2f"
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: '',
            legendOffset: 46
          }}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: '',
            legendOffset: 46
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: -40
          }}
          colors={{
            type: 'diverging',
            scheme: 'red_yellow_blue',
            divergeAt: 0.5,
            minValue: -1,
            maxValue: 1
          }}
          emptyColor="#555555"
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.4]]
          }}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 3]]
          }}
          legends={[
            {
              anchor: 'bottom',
              translateX: 0,
              translateY: 30,
              length: 400,
              thickness: 8,
              direction: 'row',
              tickPosition: 'after',
              tickSize: 3,
              tickSpacing: 4,
              tickOverlap: false,
              tickFormat: '>-.2f',
              title: 'Correlation →',
              titleAlign: 'start',
              titleOffset: 4
            }
          ]}
        />
      </Box>
    </Card>
  );
};

export default CorrelationMatrix;
