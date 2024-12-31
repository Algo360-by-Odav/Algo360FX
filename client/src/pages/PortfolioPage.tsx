import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Alert,
} from '@mui/material';
import apiService from '../services/apiService';
import websocketService from '../services/websocketService';
import { useApp } from '../context/AppContext';

interface Portfolio {
  totalBalance: number;
  equity: number;
  openPositions: number;
  dailyPnL: number;
}

const PortfolioPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  const fetchPortfolio = async () => {
    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { 
          isLoading: true, 
          message: 'Loading portfolio data...' 
        } 
      });

      const data = await apiService.get<Portfolio>('/api/portfolio');
      setPortfolio(data);
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Portfolio data updated',
          type: 'success'
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio data';
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
    fetchPortfolio();

    // Subscribe to real-time portfolio updates
    const unsubscribe = websocketService.subscribe<Portfolio>('portfolio-update', (data) => {
      setPortfolio(data);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Portfolio updated in real-time',
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
        Portfolio Overview
      </Typography>
      
      {portfolio && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Balance
              </Typography>
              <Typography variant="h4">
                ${portfolio.totalBalance.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Equity
              </Typography>
              <Typography variant="h4">
                ${portfolio.equity.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Open Positions
              </Typography>
              <Typography variant="h4">
                {portfolio.openPositions}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Daily P&L
              </Typography>
              <Typography variant="h4" color={portfolio.dailyPnL >= 0 ? 'success.main' : 'error.main'}>
                ${portfolio.dailyPnL.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PortfolioPage;
