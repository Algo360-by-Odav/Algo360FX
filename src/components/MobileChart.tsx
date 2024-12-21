import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { createChart, IChartApi, ColorType, DeepPartial, ChartOptions } from 'lightweight-charts';
import {
  Box,
  IconButton,
  Chip,
  Fade,
  Paper,
  Typography,
  useTheme,
  Tooltip,
  CircularProgress,
  Zoom,
  Collapse,
  Grow,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Timeline as TimelineIcon,
  SwapVert as SwapVertIcon,
  WifiOff as OfflineIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useOfflineCapability } from '../hooks/useOfflineCapability';
import { debounce } from 'lodash';

interface ChartData {
  time: string;
  value: number;
}

export function MobileChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const theme = useTheme();
  const { isOnline } = useOfflineCapability();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');

  // Chart initialization and cleanup
  useEffect(() => {
    if (chartContainerRef.current) {
      const chartInstance = createChart(chartContainerRef.current, {
        layout: {
          background: { color: theme.palette.background.paper },
          textColor: theme.palette.text.primary,
        },
        grid: {
          vertLines: { color: theme.palette.divider },
          horzLines: { color: theme.palette.divider },
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
      });

      setChart(chartInstance);

      return () => {
        chartInstance.remove();
      };
    }
  }, [theme]);

  // Responsive chart sizing
  useEffect(() => {
    const handleResize = debounce(() => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    }, 300);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chart]);

  const handleZoomIn = useCallback(() => {
    if (chart) {
      const timeScale = chart.timeScale();
      timeScale.zoom(1.2);
    }
  }, [chart]);

  const handleZoomOut = useCallback(() => {
    if (chart) {
      const timeScale = chart.timeScale();
      timeScale.zoom(0.8);
    }
  }, [chart]);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleTimeframeChange = useCallback((newTimeframe: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
    setTimeframe(newTimeframe);
    // Add your timeframe change logic here
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Add your refresh logic here
      if (navigator.vibrate) {
        navigator.vibrate([50, 50]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const timeframes = useMemo(() => ['1H', '4H', '1D', '1W', '1M'], []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Grow in={true}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Chart</Typography>
            <Box>
              <Tooltip title={isOnline ? 'Online' : 'Offline'}>
                <Chip
                  icon={isOnline ? <RefreshIcon /> : <OfflineIcon />}
                  label={isOnline ? 'Online' : 'Offline'}
                  color={isOnline ? 'success' : 'error'}
                  size="small"
                  sx={{ mr: 1 }}
                />
              </Tooltip>
              <IconButton onClick={handleZoomIn} size="small">
                <ZoomInIcon />
              </IconButton>
              <IconButton onClick={handleZoomOut} size="small">
                <ZoomOutIcon />
              </IconButton>
              <IconButton onClick={toggleSettings} size="small">
                <SettingsIcon />
              </IconButton>
              <IconButton onClick={handleRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <Box ref={chartContainerRef} sx={{ width: '100%', height: 300 }} />

          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <Collapse in={showSettings}>
            <Paper sx={{ mt: 2, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Chart Settings
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip
                  label="Candlestick"
                  onClick={() => setChartType('candlestick')}
                  color={chartType === 'candlestick' ? 'primary' : 'default'}
                />
                <Chip
                  label="Line"
                  onClick={() => setChartType('line')}
                  color={chartType === 'line' ? 'primary' : 'default'}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {timeframes.map((tf) => (
                  <Chip
                    key={tf}
                    label={tf}
                    onClick={() => handleTimeframeChange(tf)}
                    color={timeframe === tf ? 'primary' : 'default'}
                    size="small"
                  />
                ))}
              </Box>
            </Paper>
          </Collapse>

          {error && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'error.main',
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
        </Paper>
      </Grow>
    </Box>
  );
}
