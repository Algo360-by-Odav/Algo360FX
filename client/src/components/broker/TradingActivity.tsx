import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { Refresh as RefreshIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Trade {
  time: string;
  clientId: string;
  clientName: string;
  instrument: string;
  type: 'Buy' | 'Sell';
  volume: number;
  price: number;
}

interface PopularInstrument {
  symbol: string;
  volume: string;
  change: number;
}

export const TradingActivity: React.FC = observer(() => {
  // Sample data - replace with actual data from your store
  const trades: Trade[] = [
    {
      time: '2024-03-25 14:30:00',
      clientId: 'C001',
      clientName: 'John Doe',
      instrument: 'EUR/USD',
      type: 'Buy',
      volume: 100000,
      price: 1.0865,
    },
    // Add more sample trades here
  ];

  const popularInstruments: PopularInstrument[] = [
    {
      symbol: 'EUR/USD',
      volume: '1.2M',
      change: 0.15,
    },
    {
      symbol: 'GBP/USD',
      volume: '850K',
      change: -0.22,
    },
    {
      symbol: 'USD/JPY',
      volume: '950K',
      change: 0.08,
    },
  ];

  return (
    <Box>
      {/* Popular Instruments */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Popular Instruments
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {popularInstruments.map((instrument) => (
            <Card key={instrument.symbol} sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6">{instrument.symbol}</Typography>
                <Typography color="textSecondary">
                  Volume: {instrument.volume}
                </Typography>
                <Typography
                  color={instrument.change >= 0 ? 'success.main' : 'error.main'}
                >
                  {instrument.change >= 0 ? '+' : ''}
                  {instrument.change}%
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Recent Trades */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Recent Trades</Typography>
          <Box>
            <Button
              startIcon={<FilterIcon />}
              sx={{ mr: 1 }}
              variant="outlined"
              size="small"
            >
              Filter
            </Button>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Client ID</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Instrument</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Volume</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell>{trade.time}</TableCell>
                  <TableCell>{trade.clientId}</TableCell>
                  <TableCell>{trade.clientName}</TableCell>
                  <TableCell>{trade.instrument}</TableCell>
                  <TableCell>
                    <Chip
                      label={trade.type}
                      color={trade.type === 'Buy' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {trade.volume.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{trade.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
});

export default TradingActivity;
