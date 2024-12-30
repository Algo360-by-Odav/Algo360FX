import React, { useRef, useState, useCallback } from 'react';
import { Box, CircularProgress, Fade, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
  threshold?: number;
  maxPull?: number;
}

export function PullToRefresh({
  onRefresh,
  disabled = false,
  children,
  threshold = 80,
  maxPull = 120,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const theme = useTheme();

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isRefreshing) return;
      const touch = e.touches[0];
      startY.current = touch.clientY;
      currentY.current = touch.clientY;
    },
    [disabled, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (
        disabled ||
        isRefreshing ||
        startY.current === null ||
        currentY.current === null
      )
        return;

      const touch = e.touches[0];
      currentY.current = touch.clientY;
      const deltaY = currentY.current - startY.current;

      // Only allow pull down when scrolled to top
      if (deltaY < 0 || e.currentTarget.scrollTop > 0) {
        setPullDistance(0);
        return;
      }

      // Apply resistance to pull
      const resistance = 0.5;
      const newDistance = Math.min(deltaY * resistance, maxPull);
      setPullDistance(newDistance);

      // Prevent default scrolling when pulling
      if (newDistance > 0) {
        e.preventDefault();
      }
    },
    [disabled, isRefreshing, maxPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || startY.current === null) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    startY.current = null;
    currentY.current = null;
    setPullDistance(0);
  }, [disabled, isRefreshing, onRefresh, pullDistance, threshold]);

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const shouldShowSpinner = pullDistance > 0 || isRefreshing;
  const spinnerSize = Math.min(24 + (pullDistance / maxPull) * 12, 36);

  return (
    <Box
      sx={{
        position: 'relative',
        touchAction: pullDistance > 0 ? 'none' : 'auto',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Fade in={shouldShowSpinner}>
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: `translate(-50%, ${
              isRefreshing ? '12px' : `${Math.min(pullDistance / 2, 24)}px`
            })`,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CircularProgress
            size={spinnerSize}
            variant={isRefreshing ? 'indeterminate' : 'determinate'}
            value={progress}
            sx={{
              color: theme.palette.primary.main,
              transition: 'all 0.2s ease-in-out',
            }}
          />
          {!isRefreshing && pullDistance > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                transition: 'opacity 0.2s ease-in-out',
                opacity: pullDistance >= threshold ? 1 : 0.7,
              }}
            >
              {pullDistance >= threshold
                ? 'Release to refresh'
                : 'Pull down to refresh'}
            </Typography>
          )}
        </Box>
      </Fade>

      <Box
        sx={{
          transform: `translateY(${isRefreshing ? '40px' : `${pullDistance}px`})`,
          transition: isRefreshing
            ? 'transform 0.2s ease-in-out'
            : pullDistance > 0
            ? 'none'
            : 'transform 0.2s ease-in-out',
          position: 'relative',
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -maxPull,
            left: 0,
            right: 0,
            height: maxPull,
            background: `linear-gradient(to bottom, transparent, ${alpha(
              theme.palette.background.paper,
              0.1
            )})`,
            opacity: pullDistance / maxPull,
            transition: 'opacity 0.2s ease-in-out',
            pointerEvents: 'none',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
