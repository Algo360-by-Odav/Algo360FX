import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ChartWidget from '@components/Chart/ChartWidget';
import OrderBookWidget from '@components/OrderBook/OrderBookWidget';
import QuickTradeWidget from '@components/Trade/QuickTradeWidget';
import PositionManagerWidget from '@components/Position/PositionManagerWidget';
import RiskCalculatorWidget from '@components/Risk/RiskCalculatorWidget';
import { useResponsive } from '@/hooks/useResponsive';

const Trading: React.FC = observer(() => {
  const { deviceType } = useResponsive('up', 'xs');
  const isMobile = deviceType === 'mobile';
  const [selectedSymbol] = useState('EURUSD');

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        height: isMobile ? 'calc(100vh - 120px)' : '100%',
        overflow: 'auto',
        p: 2
      }}
    >
      <Grid container spacing={2}>
        {/* Main Trading Area */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ChartWidget 
                symbol={selectedSymbol} 
                interval="1D"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickTradeWidget />
            </Grid>
            <Grid item xs={12} md={6}>
              <RiskCalculatorWidget />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OrderBookWidget 
                symbol={selectedSymbol}
                precision={5}
                levels={15}
              />
            </Grid>
            <Grid item xs={12}>
              <PositionManagerWidget />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default Trading;
