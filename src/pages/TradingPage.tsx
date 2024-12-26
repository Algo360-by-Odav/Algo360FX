import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TradingChart from '../components/Trading/TradingChart';
import MobileTradingInterface from '../components/Trading/MobileTradingInterface';
import { useRootStore } from '../stores/RootStoreContext';

const TradingPage: React.FC = observer(() => {
  const { marketStore, tradingStore } = useRootStore();
  const [currentSymbol, setCurrentSymbol] = useState('EURUSD');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSymbolChange = (symbol: string) => {
    setCurrentSymbol(symbol);
    tradingStore.setActiveSymbol(symbol);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        p: isMobile ? 0 : 2,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!isMobile && (
        <Grid item xs={12}>
          <Paper elevation={2}>
            <Box p={2}>
              <Typography variant="h5" gutterBottom>
                Trading Chart - {currentSymbol}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
      
      <Box sx={{ flexGrow: 1, position: 'relative', height: isMobile ? '100%' : 'auto' }}>
        <TradingChart
          symbol={currentSymbol}
          onSymbolChange={handleSymbolChange}
        />
        {isMobile && (
          <MobileTradingInterface
            symbol={currentSymbol}
            onSymbolChange={handleSymbolChange}
          />
        )}
      </Box>
    </Container>
  );
});

export default TradingPage;
