import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';

interface CorrelationData {
  pair1: string;
  pair2: string;
  correlation: number;
  strength: 'Strong' | 'Moderate' | 'Weak';
}

const MarketCorrelationWidget: React.FC = observer(() => {
  const theme = useTheme();
  const { marketStore } = useRootStore();
  const [correlations, setCorrelations] = useState<CorrelationData[]>([
    { pair1: 'EUR/USD', pair2: 'GBP/USD', correlation: 0.85, strength: 'Strong' },
    { pair1: 'EUR/USD', pair2: 'USD/JPY', correlation: -0.65, strength: 'Moderate' },
    { pair1: 'GBP/USD', pair2: 'USD/JPY', correlation: -0.55, strength: 'Moderate' },
    { pair1: 'USD/CHF', pair2: 'EUR/USD', correlation: -0.95, strength: 'Strong' },
    { pair1: 'AUD/USD', pair2: 'NZD/USD', correlation: 0.92, strength: 'Strong' },
  ]);

  const getCorrelationColor = (correlation: number) => {
    if (correlation >= 0.7) return theme.palette.success.main;
    if (correlation <= -0.7) return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Currency Correlations</Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pair 1</TableCell>
              <TableCell>Pair 2</TableCell>
              <TableCell align="right">Correlation</TableCell>
              <TableCell>Strength</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {correlations.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.pair1}</TableCell>
                <TableCell>{row.pair2}</TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: getCorrelationColor(row.correlation),
                    fontWeight: 'bold'
                  }}
                >
                  {(row.correlation * 100).toFixed(1)}%
                </TableCell>
                <TableCell>{row.strength}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});

export default MarketCorrelationWidget;
