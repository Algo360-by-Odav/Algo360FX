import React from 'react';
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
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Close, TrendingUp, TrendingDown } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';
import NumberTicker from '../common/NumberTicker';

const PositionManagerWidget: React.FC = observer(() => {
  const theme = useTheme();
  const { tradingStore } = useRootStoreContext();

  const handleClosePosition = (symbol: string) => {
    tradingStore.closePosition(symbol);
  };

  const getTotalPnL = () => {
    return tradingStore.positions.reduce((total, pos) => total + (pos.unrealizedPnL || 0), 0);
  };

  const getMarginUsage = () => {
    const totalMargin = tradingStore.positions.reduce((total, pos) => total + (pos.margin || 0), 0);
    return totalMargin > 0 ? (totalMargin / (tradingStore.accountInfo?.margin || 1)) * 100 : 0;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}>
            Positions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end',
            }}>
              <Typography variant="caption" color="text.secondary">
                Total P&L
              </Typography>
              <NumberTicker
                value={getTotalPnL()}
                precision={2}
                prefix="$"
                size="medium"
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end',
              ml: 2 
            }}>
              <Typography variant="caption" color="text.secondary">
                Margin Usage
              </Typography>
              <NumberTicker
                value={getMarginUsage()}
                precision={1}
                suffix="%"
                size="medium"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Side</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Entry Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">P&L</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tradingStore.positions.map((position) => (
              <TableRow key={position.symbol}>
                <TableCell>{position.symbol}</TableCell>
                <TableCell align="right">
                  {position.side === 'BUY' ? (
                    <TrendingUp color="success" />
                  ) : (
                    <TrendingDown color="error" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <NumberTicker
                    value={position.quantity}
                    precision={2}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <NumberTicker
                    value={position.averagePrice}
                    precision={5}
                    size="small"
                    isPrice
                  />
                </TableCell>
                <TableCell align="right">
                  <NumberTicker
                    value={position.currentPrice}
                    precision={5}
                    size="small"
                    isPrice
                  />
                </TableCell>
                <TableCell align="right">
                  <NumberTicker
                    value={position.unrealizedPnL}
                    precision={2}
                    prefix="$"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Close Position">
                    <IconButton
                      size="small"
                      onClick={() => handleClosePosition(position.symbol)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});

export default PositionManagerWidget;
