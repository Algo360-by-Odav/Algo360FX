import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import apiService from '../services/apiService';
import websocketService from '../services/websocketService';
import { useApp } from '../context/AppContext';

interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  openPrice: number;
  currentPrice: number;
  volume: number;
  pnl: number;
  openTime: string;
}

const PositionsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [positions, setPositions] = useState<Position[]>([]);

  const fetchPositions = async () => {
    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { 
          isLoading: true, 
          message: 'Loading positions...' 
        } 
      });

      const data = await apiService.get<Position[]>('/api/positions');
      setPositions(data);
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Positions loaded successfully',
          type: 'success'
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch positions';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: errorMessage,
          type: 'error'
        }
      });
    } finally {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { isLoading: false } 
      });
    }
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { 
          isLoading: true, 
          message: 'Closing position...' 
        } 
      });

      await apiService.post(`/api/positions/${positionId}/close`, {});
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Position closed successfully',
          type: 'success'
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to close position';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: errorMessage,
          type: 'error'
        }
      });
    } finally {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { isLoading: false } 
      });
    }
  };

  useEffect(() => {
    fetchPositions();

    // Subscribe to real-time position updates
    const unsubscribe = websocketService.subscribe<Position[]>('positions-update', (data) => {
      setPositions(data);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Positions updated in real-time',
          type: 'info'
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  if (state.lastError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}
        >
          {state.lastError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Open Positions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Volume</TableCell>
              <TableCell align="right">Open Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">P&L</TableCell>
              <TableCell align="right">Open Time</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id}>
                <TableCell>{position.symbol}</TableCell>
                <TableCell>
                  <Typography color={position.type === 'BUY' ? 'success.main' : 'error.main'}>
                    {position.type}
                  </Typography>
                </TableCell>
                <TableCell align="right">{position.volume}</TableCell>
                <TableCell align="right">${position.openPrice.toFixed(5)}</TableCell>
                <TableCell align="right">${position.currentPrice.toFixed(5)}</TableCell>
                <TableCell align="right">
                  <Typography color={position.pnl >= 0 ? 'success.main' : 'error.main'}>
                    ${position.pnl.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {new Date(position.openTime).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Close Position">
                    <IconButton
                      size="small"
                      onClick={() => handleClosePosition(position.id)}
                      color="error"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {positions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No open positions
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PositionsPage;
