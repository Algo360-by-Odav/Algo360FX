import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

interface MarketData {
  symbol: string;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
}

const MarketOverview: React.FC = observer(() => {
  const { tradingStore } = useStores();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tradingStore.prices || !tradingStore.availableSymbols) {
      setIsLoading(true);
      return;
    }

    // Update market data whenever prices change
    const data = tradingStore.availableSymbols.map(symbol => {
      const price = tradingStore.prices[symbol] || { bid: 0, ask: 0 };
      const previousPrice = tradingStore.previousPrices[symbol] || { bid: price.bid, ask: price.ask };
      const change = price.bid - previousPrice.bid;
      const changePercent = previousPrice.bid ? (change / previousPrice.bid) * 100 : 0;

      return {
        symbol,
        bid: price.bid,
        ask: price.ask,
        change,
        changePercent,
      };
    });

    setMarketData(data);
    setIsLoading(false);
  }, [tradingStore.prices, tradingStore.previousPrices, tradingStore.availableSymbols]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Bid</TableCell>
            <TableCell align="right">Ask</TableCell>
            <TableCell align="right">Change</TableCell>
            <TableCell align="right">Change %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {marketData.map((row) => (
            <TableRow key={row.symbol}>
              <TableCell component="th" scope="row">
                {row.symbol}
              </TableCell>
              <TableCell align="right">{row.bid ? row.bid.toFixed(5) : '-'}</TableCell>
              <TableCell align="right">{row.ask ? row.ask.toFixed(5) : '-'}</TableCell>
              <TableCell 
                align="right"
                sx={{ color: row.change >= 0 ? 'success.main' : 'error.main' }}
              >
                {row.change ? row.change.toFixed(5) : '-'}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ color: row.changePercent >= 0 ? 'success.main' : 'error.main' }}
              >
                {row.changePercent ? `${row.changePercent.toFixed(2)}%` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default MarketOverview;

