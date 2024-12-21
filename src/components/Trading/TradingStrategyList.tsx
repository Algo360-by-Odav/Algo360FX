import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { useRootStoreContext } from '../../stores/RootStoreContext';

const TradingStrategyList: React.FC = observer(() => {
  const { algoTradingStore } = useRootStoreContext();

  // Sample strategies data
  const strategies = [
    {
      id: 1,
      name: 'Trend Following',
      status: 'active',
      profit: 250.50,
      trades: 15,
      winRate: 73,
    },
    {
      id: 2,
      name: 'Mean Reversion',
      status: 'inactive',
      profit: 180.25,
      trades: 22,
      winRate: 68,
    },
    {
      id: 3,
      name: 'Breakout',
      status: 'active',
      profit: -45.75,
      trades: 8,
      winRate: 50,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Trading Strategies
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Strategy</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Profit</TableCell>
                <TableCell align="right">Trades</TableCell>
                <TableCell align="right">Win Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {strategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell>{strategy.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={strategy.status}
                      color={strategy.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ color: strategy.profit >= 0 ? 'success.main' : 'error.main' }}
                  >
                    ${strategy.profit.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{strategy.trades}</TableCell>
                  <TableCell align="right">{strategy.winRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
});

export default TradingStrategyList;
