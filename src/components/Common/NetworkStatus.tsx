import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Box, Typography, useTheme, alpha } from '@mui/material';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkStatusProps {
  position?: 'top' | 'bottom';
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ position = 'top' }) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide the reconnected message after 3 seconds
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <AnimatePresence>
      {(!isOnline || showReconnected) && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            [position]: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: isOnline 
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${isOnline 
                ? alpha(theme.palette.success.main, 0.2)
                : alpha(theme.palette.error.main, 0.2)}`,
              boxShadow: `0 2px 12px ${alpha(
                isOnline ? theme.palette.success.main : theme.palette.error.main,
                0.1
              )}`,
            }}
          >
            {isOnline ? (
              <SignalWifiStatusbar4BarIcon 
                sx={{ color: theme.palette.success.main }} 
              />
            ) : (
              <SignalWifiOffIcon 
                sx={{ color: theme.palette.error.main }} 
              />
            )}
            <Typography
              variant="body2"
              sx={{
                color: isOnline 
                  ? theme.palette.success.main 
                  : theme.palette.error.main,
                fontWeight: 500,
              }}
            >
              {isOnline ? 'Connection Restored' : 'No Internet Connection'}
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
