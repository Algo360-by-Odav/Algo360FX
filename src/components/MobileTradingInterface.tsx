import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  SwipeableDrawer,
  TextField,
  Typography,
  IconButton,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowUpward as BuyIcon,
  ArrowDownward as SellIcon,
  Close as CloseIcon,
  WifiOff as OfflineIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useOfflineCapability } from '../hooks/useOfflineCapability';

interface MobileTradingInterfaceProps {
  symbol: string;
  currentPrice: number;
  onTrade: (order: {
    type: 'BUY' | 'SELL';
    amount: number;
    takeProfit?: number;
    stopLoss?: number;
  }) => Promise<void>;
}

export function MobileTradingInterface({
  symbol,
  currentPrice,
  onTrade,
}: MobileTradingInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState<number>(0.1);
  const [takeProfit, setTakeProfit] = useState<number | null>(currentPrice ? currentPrice * 1.02 : null);
  const [stopLoss, setStopLoss] = useState<number | null>(currentPrice ? currentPrice * 0.98 : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const theme = useTheme();

  const { isOnline, executeTrade } = useOfflineCapability();

  // Memoize calculated values
  const profitRange = useMemo(() => {
    if (!currentPrice) return { min: 0, max: 0 };
    return {
      min: currentPrice * 1.001,
      max: currentPrice * 1.1,
    };
  }, [currentPrice]);

  const lossRange = useMemo(() => {
    if (!currentPrice) return { min: 0, max: 0 };
    return {
      min: currentPrice * 0.9,
      max: currentPrice * 0.999,
    };
  }, [currentPrice]);

  // Haptic feedback function
  const vibrate = useCallback((pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      vibrate(50); // Short vibration on submit

      // Validate inputs
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }
      if (takeProfit && takeProfit <= currentPrice && orderType === 'BUY') {
        throw new Error('Take profit must be higher than current price for BUY orders');
      }
      if (takeProfit && takeProfit >= currentPrice && orderType === 'SELL') {
        throw new Error('Take profit must be lower than current price for SELL orders');
      }
      if (stopLoss && stopLoss >= currentPrice && orderType === 'BUY') {
        throw new Error('Stop loss must be lower than current price for BUY orders');
      }
      if (stopLoss && stopLoss <= currentPrice && orderType === 'SELL') {
        throw new Error('Stop loss must be higher than current price for SELL orders');
      }

      await onTrade({
        type: orderType,
        amount,
        takeProfit: takeProfit || undefined,
        stopLoss: stopLoss || undefined,
      });

      vibrate([50, 50, 100]); // Success vibration pattern
      setIsOpen(false);
    } catch (err) {
      vibrate([100, 50, 100]); // Error vibration pattern
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    vibrate(30);
    setIsOpen(false);
  }, [vibrate]);

  const handleOpen = useCallback(() => {
    vibrate(30);
    setIsOpen(true);
  }, [vibrate]);

  // Reset values when price changes
  useEffect(() => {
    if (currentPrice) {
      setTakeProfit(orderType === 'BUY' ? currentPrice * 1.02 : currentPrice * 0.98);
      setStopLoss(orderType === 'BUY' ? currentPrice * 0.98 : currentPrice * 1.02);
    }
  }, [currentPrice, orderType]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          disabled={!isOnline}
          startIcon={isOnline ? (orderType === 'BUY' ? <BuyIcon /> : <SellIcon />) : <OfflineIcon />}
          sx={{
            minWidth: 200,
            backgroundColor: orderType === 'BUY' ? theme.palette.success.main : theme.palette.error.main,
            '&:hover': {
              backgroundColor: orderType === 'BUY' ? theme.palette.success.dark : theme.palette.error.dark,
            },
          }}
        >
          {isOnline ? `${orderType} ${symbol}` : 'Offline'}
        </Button>
      </Box>

      <SwipeableDrawer
        anchor="bottom"
        open={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        swipeAreaWidth={56}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ p: 2, pb: 6 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {orderType} {symbol} @ {currentPrice?.toFixed(4)}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <ToggleButtonGroup
            value={orderType}
            exclusive
            onChange={(_, value) => value && setOrderType(value)}
            sx={{ mb: 2, width: '100%' }}
          >
            <ToggleButton 
              value="BUY"
              sx={{ 
                flex: 1,
                color: theme.palette.success.main,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.success.main,
                  color: theme.palette.common.white,
                },
              }}
            >
              BUY
            </ToggleButton>
            <ToggleButton
              value="SELL"
              sx={{
                flex: 1,
                color: theme.palette.error.main,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.common.white,
                },
              }}
            >
              SELL
            </ToggleButton>
          </ToggleButtonGroup>

          <Typography gutterBottom>Amount (Lots)</Typography>
          <Slider
            value={amount}
            onChange={(_, value) => {
              vibrate(20);
              setAmount(Array.isArray(value) ? value[0] : value);
            }}
            min={0.1}
            max={10}
            step={0.1}
            marks={[
              { value: 0.1, label: '0.1' },
              { value: 1, label: '1.0' },
              { value: 5, label: '5.0' },
              { value: 10, label: '10.0' },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value.toFixed(1)} lots`}
          />

          <Typography gutterBottom sx={{ mt: 2 }}>Take Profit</Typography>
          <Slider
            value={takeProfit || profitRange.min}
            onChange={(_, value) => {
              vibrate(20);
              setTakeProfit(Array.isArray(value) ? value[0] : value);
            }}
            min={profitRange.min}
            max={profitRange.max}
            step={0.0001}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(4)}
          />

          <Typography gutterBottom sx={{ mt: 2 }}>Stop Loss</Typography>
          <Slider
            value={stopLoss || lossRange.max}
            onChange={(_, value) => {
              vibrate(20);
              setStopLoss(Array.isArray(value) ? value[0] : value);
            }}
            min={lossRange.min}
            max={lossRange.max}
            step={0.0001}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(4)}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !isOnline}
            sx={{
              mt: 3,
              backgroundColor: orderType === 'BUY' ? theme.palette.success.main : theme.palette.error.main,
              '&:hover': {
                backgroundColor: orderType === 'BUY' ? theme.palette.success.dark : theme.palette.error.dark,
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Place ${orderType} Order`
            )}
          </Button>
        </Box>
      </SwipeableDrawer>

      <Snackbar
        open={showOfflineNotice}
        autoHideDuration={6000}
        onClose={() => setShowOfflineNotice(false)}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          You are currently offline. Some features may be limited.
        </Alert>
      </Snackbar>
    </>
  );
}
